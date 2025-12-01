import { CartItem, ShippingAddress } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, shippingAddress, cartItems }: {
      userId: string;
      shippingAddress: ShippingAddress;
      cartItems: CartItem[];
    } = body;

    if (!userId || !shippingAddress || !cartItems?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate total
    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingCost = cartTotal >= 60 ? 0 : 9.99;
    const finalTotal = cartTotal + shippingCost;

    // Create line items for Stripe
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: [
            item.name,
            item.size && `Size: ${item.size}`,
            item.color && `Color: ${item.color}`,
            item.iphoneModel && `Model: ${item.iphoneModel}`,
          ]
            .filter(Boolean)
            .join(" - "),
          images: [item.imageUrl],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if applicable
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: shippingAddress.email,
      client_reference_id: userId,
      metadata: {
        userId: userId,
        shipping: JSON.stringify(shippingAddress),
        cartItems: JSON.stringify(cartItems),
        cartTotal: cartTotal.toString(),
        shippingCost: shippingCost.toString(),
        finalTotal: finalTotal.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}