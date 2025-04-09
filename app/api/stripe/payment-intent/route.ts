import { NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Stripe secret key is not defined');
}

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil", // Use the latest stable API version
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = "SAR", metadata = {} } = body;

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents/smallest currency unit
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Return the client secret to the client
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}


