"use client";
// src/app/checkout/page.tsx
// Single-page checkout: address → shipping method → payment summary → Razorpay

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/stores/useCartStore";
import { formatINR } from "@/lib/utils";

const addressSchema = z.object({
  name:    z.string().min(2, "Name is required"),
  phone:   z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number"),
  email:   z.string().email("Enter valid email"),
  line1:   z.string().min(5, "Address is required"),
  line2:   z.string().optional(),
  city:    z.string().min(2, "City is required"),
  state:   z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter valid 6-digit PIN code"),
  gst:     z.string().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry",
];

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

export default function CheckoutPage() {
  const { items, subtotal, discountAmount, couponCode, clearCart } = useCartStore();
  const [step, setStep]             = useState<"address" | "review" | "done">("address");
  const [pincodeMsg, setPincodeMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading]   = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({ resolver: zodResolver(addressSchema) });

  const pincode = watch("pincode");

  const checkPincode = async () => {
    if (!pincode || pincode.length !== 6) return;
    setPincodeMsg("Checking…");
    // Placeholder — replace with Shiprocket pincode serviceability API
    await new Promise((r) => setTimeout(r, 800));
    setPincodeMsg("✓ Delivery available (3-5 days)");
  };

  const shipping   = subtotal() > 1999 ? 0 : 99;
  const taxAmount  = Math.round((subtotal() - discountAmount) * 0.18);
  const total      = subtotal() - discountAmount + shipping + taxAmount;

  const onSubmit = async (data: AddressFormData) => {
    setIsLoading(true);
    try {
      // 1. Create Razorpay order server-side
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const { orderId, keyId } = await res.json();

      // 2. Load Razorpay Checkout SDK
      await loadRazorpayScript();

      // 3. Open Razorpay Checkout
      const rzp = new window.Razorpay({
        key:        keyId,
        amount:     total * 100,
        currency:   "INR",
        name:       "BehindBars Fabrics",
        description:"Premium Men's Fashion",
        order_id:   orderId,
        prefill: {
          name:    data.name,
          email:   data.email,
          contact: data.phone,
        },
        theme: { color: "#C9A84C" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // 4. Verify payment server-side
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, orderId }),
          });
          if (verifyRes.ok) {
            clearCart();
            setStep("done");
          }
        },
      });
      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "done") {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 pt-20">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <polyline points="20,6 9,17 4,12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="font-display text-4xl text-white mb-3">Order Placed!</h1>
          <p className="text-white/50 mb-8">
            Thank you for your order. You'll receive a confirmation via email and WhatsApp shortly.
          </p>
          <a href="/" className="inline-block px-8 py-3 bg-bar-gold text-obsidian text-sm tracking-[0.2em] uppercase font-bold hover:bg-bar-gold-light transition-all">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian pt-24 pb-20">
      <div className="container px-4 lg:px-8 max-w-5xl">
        <h1 className="font-display text-4xl text-white mb-10">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT — Address Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <h2 className="font-display text-xl text-white mb-2">Delivery Address</h2>

              {/* Name + Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" error={errors.name?.message}>
                  <input {...register("name")} placeholder="Manigandan" className={input} />
                </Field>
                <Field label="Mobile Number" error={errors.phone?.message}>
                  <input {...register("phone")} placeholder="9876543210" maxLength={10} className={input} />
                </Field>
              </div>

              {/* Email */}
              <Field label="Email Address" error={errors.email?.message}>
                <input {...register("email")} type="email" placeholder="you@example.com" className={input} />
              </Field>

              {/* Address */}
              <Field label="Address Line 1" error={errors.line1?.message}>
                <input {...register("line1")} placeholder="House / Flat / Street" className={input} />
              </Field>
              <Field label="Address Line 2 (Optional)">
                <input {...register("line2")} placeholder="Landmark, Area" className={input} />
              </Field>

              {/* City + State + PIN */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="City" error={errors.city?.message}>
                  <input {...register("city")} placeholder="Chennai" className={input} />
                </Field>
                <Field label="State" error={errors.state?.message}>
                  <select {...register("state")} className={input}>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="PIN Code" error={errors.pincode?.message}>
                  <div className="flex gap-2">
                    <input
                      {...register("pincode")}
                      placeholder="600001"
                      maxLength={6}
                      onBlur={checkPincode}
                      className={`${input} flex-1`}
                    />
                  </div>
                  {pincodeMsg && (
                    <p className={`text-xs mt-1 ${pincodeMsg.startsWith("✓") ? "text-green-400" : "text-white/40"}`}>
                      {pincodeMsg}
                    </p>
                  )}
                </Field>
              </div>

              {/* GST number (optional) */}
              <Field label="GST Number (Optional)">
                <input {...register("gst")} placeholder="22AAAAA0000A1Z5" className={input} />
              </Field>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-bar-gold text-obsidian text-sm font-bold tracking-[0.2em] uppercase hover:bg-bar-gold-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing…" : `Pay ${formatINR(total)} via Razorpay`}
              </button>

              <p className="text-white/25 text-xs text-center">
                🔒 Secured by Razorpay · PCI-DSS Compliant · No card data stored on our servers
              </p>
            </form>
          </div>

          {/* RIGHT — Order Summary */}
          <div className="bg-charcoal rounded-2xl p-6 space-y-4 h-fit sticky top-24">
            <h2 className="font-display text-lg text-white">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-10 h-12 bg-smoke rounded overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs truncate">{item.productName}</p>
                    <p className="text-white/40 text-[10px]">{item.variant.colour} · {item.variant.size} · ×{item.quantity}</p>
                  </div>
                  <p className="text-white/70 text-xs self-start">{formatINR(item.unitPrice * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-4 space-y-2">
              <Row label="Subtotal"   value={formatINR(subtotal())} />
              {discountAmount > 0 && (
                <Row label={`Coupon (${couponCode})`} value={`−${formatINR(discountAmount)}`} accent />
              )}
              <Row label="Shipping" value={shipping === 0 ? "FREE" : formatINR(shipping)} />
              <Row label="GST (18%)" value={formatINR(taxAmount)} />
              <div className="border-t border-white/5 pt-3">
                <Row label="Total" value={formatINR(total)} bold />
              </div>
            </div>

            {/* Payment methods */}
            <div className="pt-2 border-t border-white/5">
              <p className="text-white/30 text-[10px] tracking-wider mb-2">Accepted payments</p>
              <div className="flex gap-1.5 flex-wrap">
                {["UPI", "Cards", "EMI", "BNPL", "COD"].map((m) => (
                  <span key={m} className="px-2 py-0.5 border border-white/10 text-white/30 text-[9px] rounded tracking-wider">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────

const input = "w-full bg-smoke border border-white/10 text-white placeholder:text-white/30 px-4 py-2.5 text-sm outline-none focus:border-bar-gold transition-colors rounded-lg";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-white/60 text-xs tracking-[0.2em] uppercase mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Row({ label, value, accent, bold }: { label: string; value: string; accent?: boolean; bold?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className={bold ? "text-white font-medium" : "text-white/50"}>{label}</span>
      <span className={accent ? "text-green-400" : bold ? "text-bar-gold font-bold" : "text-white/70"}>{value}</span>
    </div>
  );
}

async function loadRazorpayScript() {
  if (document.querySelector("#razorpay-script")) return;
  return new Promise<void>((resolve) => {
    const s = document.createElement("script");
    s.id  = "razorpay-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}
