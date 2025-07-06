"use client";

import dynamic from "next/dynamic";

import { LoadingSpinner } from "@/components/common/loadingSpinner";

const CartItems = dynamic(
  () => import("@/components/modules/cart/cartItem").then(mod => mod.CartItems),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
);
const OrderSummary = dynamic(
  () =>
    import("@/components/modules/cart/orderSummary").then(
      mod => mod.OrderSummary,
    ),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
);
const CartEmpty = dynamic(
  () =>
    import("@/components/modules/cart/cartEmpty").then(mod => mod.CartEmpty),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
);

export {
  CartItems,
  OrderSummary,
  CartEmpty
}