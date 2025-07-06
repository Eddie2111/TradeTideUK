import { Metadata } from "next";
import NextHead from "@/components/common/metaData";

import LoginPage from "./_component";
import { auth } from "@/auth";
import RedirectBack from "@/components/common/client-redirect";

export const metadata: Metadata = NextHead({
  title: "Login",
});

export default async function Login() {
  const session = await auth();
  if(session) {
    return <RedirectBack/>
  }
  return <LoginPage />;
}
