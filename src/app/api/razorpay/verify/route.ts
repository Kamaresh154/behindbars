// src/app/api/razorpay/verify/route.ts
// Verifies Razorpay payment signature — the critical security step.
// Called after client completes payment via Razorpay Checkout.

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";

const schema = z.object({
  razorpay_order_id:   z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature:  z.string(),
  orderId:             z.string(), // our internal order ID
});

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = parsed.data;

    // HMAC-SHA256 verification — the only tamper-proof check
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.warn("[Razorpay] Signature mismatch for order:", orderId);
      return NextResponse.json(
        { error: "Payment verification failed — invalid signature" },
        { status: 400 }
      );
    }

    // TODO: Update order status in DB
    // await prisma.payment.update({
    //   where: { orderId },
    //   data: {
    //     gatewayPaymentId: razorpay_payment_id,
    //     gatewaySignature: razorpay_signature,
    //     status: "CAPTURED",
    //   },
    // });
    // await prisma.order.update({ where: { id: orderId }, data: { status: "CONFIRMED" } });

    return NextResponse.json({ success: true, paymentId: razorpay_payment_id });
  } catch (err) {
    console.error("[Razorpay verify]", err);
    return NextResponse.json(
      { error: "Verification error" },
      { status: 500 }
    );
  }
}
