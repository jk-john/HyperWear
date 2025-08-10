import { createClient as createServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const getShippingCost = (cartTotal: number): number => {
  return cartTotal >= 60 ? 0 : 9.99;
};

export async function POST(request: NextRequest) {
  try {
    const { shippingAddress, cartItems } = await request.json();
    const supabase = createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      );
    }

    // Calculate cart total to determine shipping
    const cartTotal = cartItems.reduce((sum: number, item: { price: number; quantity: number }) => 
      sum + (item.price * item.quantity), 0
    );
    const shippingCost = getShippingCost(cartTotal);

    // Create dynamic line items from cart data
    const lineItems = cartItems.map((item: { name: string; size?: string; price: number; quantity: number }) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.size ? `Size: ${item.size}` : undefined,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a separate line item if applicable
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Standard shipping (Free shipping on orders over $60)',
          },
          unit_amount: Math.round(shippingCost * 100), // Convert to cents
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: shippingAddress?.email,
      client_reference_id: user.id, // Also include user ID here
      metadata: {
        userId: user.id,
        cartItems: JSON.stringify(cartItems),
        shipping: JSON.stringify(shippingAddress),
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/cancel`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: session.id,
      url: session.url,
    });
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}