"use client";
import InputOTPComponent from "@/components/input/InputOTPComponent";

export default function Page() {
  return (
    <section>
      <h1>Input your token here from your authenticator app</h1>
      <InputOTPComponent />
    </section>
  );
}
