import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe';
import { ICartItems } from '@/components/modules/checkout/types';
import { getManyProducts } from '@/lib/repositories/product.repository';
import { createOrder } from '@/lib/repositories/order.repository';
import { getOneUserProfile } from '@/lib/repositories/profile.repository';
import { OrderStatus, PaymentMethod } from '@prisma/client';

const payment_implemented = true;

interface IErrorResponse {
    statusCode: number
    message: string
}
interface TResponseProducts {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string[];
}
/*
response = 
[
  {
    id: 'cm8rio52m0000vlychm1rfalw',
    name: 'test name',
    price: 123,
    image: '5h8dt9gX1aLb59C03tK2Xn',
    quantity: 6,
    color: [ 'red' ]
  },
  ...
]
*/

export async function POST(request: Request) {
  try {
    if (payment_implemented) {
      const response = await request.json();
      console.log(response);
      const productData = await getManyProducts(
        response.products.map(
          (product: ICartItems) => product.id
        ));
      const processedProducts = productData.flatMap((product) => 
        response.products.filter((item: ICartItems) => String(item.id) === String(product.id)).map((item: ICartItems) => ({
          quantity: item.quantity,
          name: product.name,
          price: product.price,
          totalPrice: product.price * item.quantity,
          description: product.description,
        }))
      )
      const lineItems = processedProducts.map((product) => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: product.name,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: product.quantity,
      }));
      try {
        const userProfileData = await getOneUserProfile(response.userId ?? "");
        if (!userProfileData) return NextResponse.json({ error: 'User not found' }, { status: 404 });
        const productArray = response.products as TResponseProducts[];
        const parsedProductArray = productArray.map((product) => product.id)
        console.log(lineItems.reduce((acc, item) => acc + item.price_data.unit_amount * item.quantity, 0) / 100);
        const orderId = await createOrder({
          userId: response.userId ?? "",
          products: parsedProductArray ?? [],
          shippingAddress: userProfileData.data?.shippingAddress ?? "",
          billingAddress: userProfileData.data?.address ?? "",
          shippingCharge: 50,
          orderStatus: OrderStatus.PENDING,
          paymentMethod: PaymentMethod.STRIPE,
          totalPrice: lineItems.reduce((acc, item) => acc + item.price_data.unit_amount * item.quantity, 0) / 100,
        });
        if (orderId) {
          const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.APP_URL}/checkout/confirmation/${orderId.id}`,
            cancel_url: `${process.env.APP_URL}/cancel`,
          });
          return NextResponse.json({ url: session.url }, { status: 200 });
        }
        return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
      } catch(err) {
        console.log(err);
        return NextResponse.json({ error: 'Error creating session' }, { status: 500 });
      }
    }
    return NextResponse.json({ error: 'Payment not implemented' }, { status: 500 })
  } catch (err: unknown) {
    const errorMessage = err as IErrorResponse;
    console.log(err);
    return NextResponse.json(
      { error: errorMessage.message },
      { status: errorMessage.statusCode || 500 }
    )
  }
}