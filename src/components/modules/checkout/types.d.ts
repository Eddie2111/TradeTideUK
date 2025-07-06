export interface IShippingFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  onSubmit: (data: ShippingFormProps["initialData"]) => void;
  shippingMethod: string;
  onShippingMethodChange: (method: string) => void;
}

export interface IReviewOrderProps {
  shippingData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentData: {
    cardName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    saveCard: boolean;
  };
  paymentMethod: string;
  shippingMethod: string;
  onBack: () => void;
  onPlaceOrder: () => void;
  isProcessing: boolean;
}

export interface IPaymentFormProps {
  initialData?: {
    cardName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    saveCard: boolean;
  };
  onSubmit?: (data: IPaymentFormProps["initialData"], method: string) => void;
  onBack: () => void;
}

export interface ICartItems {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
}

export interface IOrderSummaryProps {
  cartItems: {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    color: string;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingMethod: string;
}

export interface IShippingFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
}

export type TShippingMethod = "standard" | "express"
