// src/app/api/razorpay/create-order/route.ts
// Creates a Razorpay order server-side before presenting checkout to customer.

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";
import { nanoid } from "nanoid";

const schema = z.object({
  amount:   z.number().min(1),   // in INR paise (amount × 100)
  currency: z.string().default("INR"),
  receipt:  z.string().optional(),
});

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { amount, currency } = parsed.data;

    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100), // paise
      currency,
      receipt:  `bb_${nanoid(10)}`,
      notes:    { source: "behindbars.in" },
    });

    return NextResponse.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("[Razorpay create-order]", err);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
