"use client";

import type React from "react";
import { useState } from "react";
import { Box, ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import Axios from "axios";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";

import type { IPaymentFormProps } from "./types";
import { useLocalStorage } from "@/lib/useLocalStorage";

export default function PaymentForm({ onBack }: IPaymentFormProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const { getLocalStorage } = useLocalStorage();
  const automatePayment = async() => {
    if(paymentMethod === "credit") {
      const cart = getLocalStorage("cart-storage") ?? "";
      const profile = getLocalStorage("profile") ?? ""
      const payment = await Axios.post("/api/payment",{
        userId: JSON.parse(profile).id,
        products: JSON.parse(cart).state.items,
      }
      );
      router.push(payment.data.url);
      console.log(payment.data.url)
      console.log(paymentMethod)
    }
  }
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
        <p className="text-muted-foreground">
          Choose how you&apos;d like to pay
        </p>
      </div>


        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="space-y-4"
        >
          <Card
            className={`border ${paymentMethod === "credit" ? "border-primary" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <RadioGroupItem value="credit" id="credit" />
                <Label
                  htmlFor="credit"
                  className="flex cursor-pointer flex-col"
                >
                  <div className="flex flex-row">
                    <CreditCard className="mr-2 h-5 w-5" />
                    <p>Credit / Debit Card</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pay when your order is delivered
                  </p>
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`border ${paymentMethod === "cash" ? "border-primary" : ""}`}
          >
            <CardContent className="flex items-center space-x-3 p-4">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="cursor-pointer">
                <div className="flex flex-col">
                  <div className="flex flex-row space-y-1">
                    <Box className="h-6 w-6 rounded-full bg-muted mr-2" />
                    <p className="font-medium">Cash on Delivery</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pay when your order is delivered
                  </p>
                </div>
              </Label>
            </CardContent>
          </Card>
        </RadioGroup>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Shipping
          </Button>
          <Button onClick={automatePayment}>
            Continue to Review
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

    </div>
  );
}
