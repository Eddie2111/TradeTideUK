import Link from "next/link";

export default function Page() {
  return (
    <div>
      You have cancelled your payment,{" "}
      <Link href="/checkout">back to shopping</Link>
    </div>
  );
}
