import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth/signup-form";
import { getCurrentUser } from "@/lib/auth/current-user";

export const metadata: Metadata = { title: "Sign up" };

export default async function SignUpPage() {
  const user = await getCurrentUser();
  if (user) redirect("/boards");

  return <SignUpForm />;
}
