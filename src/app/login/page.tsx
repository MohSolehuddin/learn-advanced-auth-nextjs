"use client";
import AuthContainer from "@/components/auth/AuthContainer";
import { FormLogin } from "@/components/auth/FormLogin";

export default function Home() {
  return (
    <AuthContainer variant="login">
      <FormLogin />
    </AuthContainer>
  );
}
