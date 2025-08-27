"use server";

import { createClient } from "@/types/utils/supabase/server";
import { createServiceClient } from "@/types/utils/supabase/service";

export async function getOrderDetailsBySessionId(sessionId: string) {
  // Use service role client to bypass RLS for order lookup on success page
  const supabase = createServiceClient();

  console.log(`[SUCCESS PAGE] Looking up order by stripe_session_id: ${sessionId}`);
  
  // Retry logic to handle webhook race condition
  let retries = 5;
  let delayMs = 1000; // Start with 1 second delay

  while (retries > 0) {
    console.log(`[SUCCESS PAGE] Attempt ${6 - retries}/5: Querying orders table by stripe_session_id`);
    
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          quantity,
          price_at_purchase,
          size,
          color,
          products (
            name,
            images
          )
        )
      `,
      )
      .eq("stripe_session_id", sessionId)
      .single();

    if (order) {
      console.log(`[SUCCESS PAGE] Order found! Order ID: ${order.id}, Status: ${order.status}`);
      return { order };
    }

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error(`[SUCCESS PAGE] Database error (not 'no rows'):`, error);
      return {
        error: "Error retrieving order details.",
      };
    }

    // If no order found and we have retries left, wait and try again
    if (retries > 1) {
      console.log(`[SUCCESS PAGE] Order not found for session ${sessionId}, retrying in ${delayMs}ms... (${retries - 1} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      delayMs = Math.min(delayMs * 1.5, 3000); // Exponential backoff, max 3s
    } else {
      console.log(`[SUCCESS PAGE] All retries exhausted for session ${sessionId}`);
    }

    retries--;
  }

  // FALLBACK: If webhook hasn't processed yet, create order from Stripe session
  console.log(`[SUCCESS PAGE] Webhook hasn't processed session ${sessionId} yet. Creating order as fallback.`);
  
  try {
    // Initialize Stripe to retrieve session details
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent']
    });

    if (session.payment_status !== 'paid') {
      console.log(`[SUCCESS PAGE] Session ${sessionId} payment not completed yet`);
      return {
        error: "Payment not completed yet. Please wait a moment and refresh the page.",
      };
    }

    console.log(`[SUCCESS PAGE] Retrieved session from Stripe:`, {
      id: session.id,
      amount_total: session.amount_total,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email
    });

    // Parse metadata
    const cartItems = session.metadata?.cartItems ? JSON.parse(session.metadata.cartItems) : [];
    const shippingDetails = session.metadata?.shipping ? JSON.parse(session.metadata.shipping) : {};
    
    // Calculate amounts
    const totalAmount = (session.amount_total ?? 0) / 100;
    const cartSubtotal = cartItems.reduce((sum: number, item: { price: number; quantity: number }) => 
      sum + (item.price * item.quantity), 0
    );
    const calculatedShipping = cartSubtotal >= 60 ? 0 : 9.99;
    
    // Get receipt URL
    let receiptUrl = null;
    if (session.payment_intent && typeof session.payment_intent === 'object') {
      if (session.payment_intent.latest_charge && typeof session.payment_intent.latest_charge === 'object') {
        receiptUrl = session.payment_intent.latest_charge.receipt_url;
      }
    }

    // Create the order
    const { data: order, error: createError } = await supabase
      .from("orders")
      .insert({
        user_id: session.metadata?.userId || session.client_reference_id || undefined,
        total: totalAmount, // Use 'total' instead of 'total_usd'
        total_token_amount: totalAmount, // Use 'total_token_amount' instead of 'total_hype'
        status: "paid",
        payment_method: "Stripe",
        stripe_session_id: session.id,
        amount_subtotal: cartSubtotal,
        amount_shipping: calculatedShipping,
        amount_tax: (session.total_details?.amount_tax || 0) / 100,
        amount_total: (session.amount_total || 0) / 100,
        currency: session.currency || 'usd',
        receipt_url: receiptUrl,
        email_sent: false, // Use 'email_sent' boolean instead of 'email_sent_status'
        shipping_first_name: shippingDetails.first_name || session.customer_details?.name?.split(' ')[0] || 'Customer',
        shipping_last_name: shippingDetails.last_name || session.customer_details?.name?.split(' ')[1] || '',
        shipping_email: shippingDetails.email || session.customer_details?.email || '',
        shipping_phone_number: shippingDetails.phone_number || session.customer_details?.phone || '',
        shipping_street: shippingDetails.street || '',
        shipping_city: shippingDetails.city || '',
        shipping_postal_code: shippingDetails.postal_code || shippingDetails.zip || '',
        shipping_country: shippingDetails.country || '',
      })
      .select()
      .single();

    if (createError) {
      console.error(`[SUCCESS PAGE] Failed to create fallback order:`, createError);
      return {
        error: "Failed to create order record. Please contact support with your session ID.",
      };
    }

    console.log(`[SUCCESS PAGE] Fallback order created! Order ID: ${order.id}`);

    // Create order items if we have cart data
    if (order && cartItems.length > 0) {
      type CartItemLite = { id: string; quantity: number; price: number; size?: string | null; color?: string | null };
      const orderItems = (cartItems as CartItemLite[]).map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
        size: item.size ?? undefined,
        color: item.color ?? undefined,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error(`[SUCCESS PAGE] Failed to create order items:`, itemsError);
      }
    }

    // Send confirmation email from fallback
    const customerEmail = session.customer_details?.email;
    if (customerEmail) {
      try {
        console.log(`[SUCCESS PAGE] Sending confirmation email to ${customerEmail}`);
        
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY!);
        
        // Import the email component
        const { default: OrderConfirmationEmail } = await import('@/components/emails/OrderConfirmationEmail');
        
        const items = cartItems.map((item: { name: string; size?: string; quantity: number; price: number }) => ({
          name: item.size ? `${item.name} (Size: ${item.size})` : item.name,
          quantity: item.quantity ?? 0,
          price: item.price ?? 0,
        }));

        await resend.emails.send({
          from: "HyperWear <noreply@hyperwear.io>",
          to: customerEmail,
          subject: "Your HyperWear Order Confirmation",
          react: OrderConfirmationEmail({
            customerName: session.customer_details?.name ?? "Valued Customer",
            orderId: order.id.toString(),
            orderDate: new Date(order.created_at).toLocaleDateString(),
            items,
            total: totalAmount,
            receiptUrl: receiptUrl,
          }),
        });

        // Mark email as sent
        await supabase
          .from("orders")
          .update({ email_sent: true })
          .eq("id", order.id);
        
        console.log(`[SUCCESS PAGE] Confirmation email sent successfully for order ${order.id}`);
      } catch (emailError) {
        console.error(`[SUCCESS PAGE] Failed to send confirmation email for order ${order.id}:`, emailError);
        // Don't fail the whole process if email fails
      }
    }

    // Fetch the complete order with items
    const { data: completeOrder } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          quantity,
          price_at_purchase,
          size,
          color,
          products (
            name,
            images
          )
        )
      `,
      )
      .eq("id", order.id)
      .single();

    return { order: completeOrder || order };

  } catch (fallbackError) {
    console.error(`[SUCCESS PAGE] Fallback order creation failed:`, fallbackError);
    return {
      error: "Order not found. The payment may still be processing - please check your email for confirmation or contact support.",
    };
  }
}

// Keep the old function for backward compatibility
export async function getOrderDetails(orderId: string) {
  const supabase = createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        quantity,
        price_at_purchase,
        size,
        color,
        products (
          name,
          images
        )
      )
    `,
    )
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Error fetching order details:", error);
    return {
      error: "Order not found or you do not have permission to view it.",
    };
  }

  return { order };
}

export async function sendConfirmationEmail(orderId: string) {
  const supabase = createServiceClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        quantity,
        price_at_purchase,
        size,
        color,
        products (
          name,
          images
        )
      )
    `,
    )
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Error fetching order details for email:", error);
    return {
      error: "Order not found or you do not have permission to view it.",
    };
  }

  if (!order) {
    console.error("Order not found for email:", orderId);
    return {
      error: "Order not found.",
    };
  }

  if (order.email_sent === true) {
    console.log(`[SUCCESS PAGE] Email already sent for order ${orderId}`);
    return {
      message: "Email already sent.",
    };
  }

  try {
    const customerEmail = order.shipping_email || order.customer_details?.email;
    if (!customerEmail) {
      console.error(`[SUCCESS PAGE] No email address found for order ${orderId}`);
      return {
        error: "No email address found for this order.",
      };
    }

    console.log(`[SUCCESS PAGE] Sending confirmation email to ${customerEmail}`);
    
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY!);
    
    // Import the email component
    const { default: OrderConfirmationEmail } = await import('@/components/emails/OrderConfirmationEmail');
    
    const items = order.order_items.map((item: { products: { name: string }; quantity: number; price_at_purchase: number }) => ({
      name: item.products.name,
      quantity: item.quantity,
      price: item.price_at_purchase,
    }));

        await resend.emails.send({
      from: "HyperWear <noreply@hyperwear.io>",
      to: customerEmail,
      subject: "Your HyperWear Order Confirmation",
      react: OrderConfirmationEmail({
            customerName: order.shipping_first_name || (order.customer_details?.name ?? "Valued Customer"),
        orderId: order.id.toString(),
        orderDate: new Date(order.created_at).toLocaleDateString(),
        items,
            total: order.total ?? order.amount_total ?? 0,
        receiptUrl: order.receipt_url,
      }),
    });

    // Mark email as sent
    await supabase
      .from("orders")
      .update({ email_sent: true })
      .eq("id", order.id);
    
    console.log(`[SUCCESS PAGE] Confirmation email sent successfully for order ${order.id}`);
    return {
      message: "Email sent successfully.",
    };
  } catch (emailError) {
    console.error(`[SUCCESS PAGE] Failed to send confirmation email for order ${orderId}:`, emailError);
    return {
      error: "Failed to send confirmation email. Please try again later.",
    };
  }
}

// Reserved for future use if manual order creation is needed
