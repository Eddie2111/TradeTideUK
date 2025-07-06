"use client";

import Dynamic from "next/dynamic";
import { LoadingSpinner } from "@/components/common/loadingSpinner";

const ShippingForm = Dynamic(
  () => import("@/components/modules/checkout/shipping-form"),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
);
const PaymentForm = Dynamic(
  () => import("@/components/modules/checkout/payment-form"),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
);
const ReviewOrder = Dynamic(
  () => import("@/components/modules/checkout/review-order"),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
);
const OrderSummary = Dynamic(
  () => import("@/components/modules/checkout/order-summary"),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
);

export {
  ShippingForm,
  PaymentForm,
  ReviewOrder,
  OrderSummary,
}