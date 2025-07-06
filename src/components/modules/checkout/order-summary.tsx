"use client";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CURRENCY } from "@/constants/app.constant";
import type { IOrderSummaryProps } from "./types";
import SanityImage from "@/components/common/sanity-image.client";

export default function OrderSummary({
  cartItems,
  subtotal,
  shipping,
  total,
  shippingMethod,
}: IOrderSummaryProps) {
  const [promoCode, setPromoCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;

    setIsApplying(true);

    // Simulate API call
    setTimeout(() => {
      setIsApplying(false);
      setPromoCode("");
      // Here you would normally apply the discount
    }, 1000);
  };

  return (
    <div className="bg-muted rounded-lg p-6 sticky top-20">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      <div className="space-y-4 mb-6 overflow-y-auto max-h-[300px] p-2 border-slate-500 border-1">
        {cartItems.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
              <SanityImage
                image={item.image || "/placeholder.svg"}
                alt={item.name}
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                Color: {item.color}
              </p>
              <div className="flex justify-between mt-1">
                <p className="text-sm">Qty: {item.quantity}</p>
                <p className="font-medium">
                  {CURRENCY}{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{CURRENCY}{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? "Free" : `${CURRENCY}${shipping.toLocaleString()}`}
            <span className="text-xs text-muted-foreground ml-1">
              ({shippingMethod === "standard" ? "Standard" : "Express"})
            </span>
          </span>
        </div>
      </div>

      <div className="mt-4 mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Promo code"
            value={promoCode}
            onChange={e => setPromoCode(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={handleApplyPromo}
            disabled={isApplying || !promoCode.trim()}
          >
            {isApplying ? "..." : "Apply"}
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>{CURRENCY}{total.toLocaleString()}</span>
      </div>
    </div>
  );
}
