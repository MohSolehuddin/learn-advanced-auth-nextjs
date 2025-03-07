"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verify2fa } from "@/server/actions/2fa/verify";
import { useSession } from "next-auth/react";
import { ChangeEvent, useState } from "react";

export default function InputOTPComponent({ secret }: { secret?: string }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const { update } = useSession();

  const handleOtpChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (error) setError("");
    setOtp(e.target.value);

    if (e.target.value.length === 6) {
      const token = e.target.value;
      let response;
      if (!secret) {
        update({ otp: token });
      } else {
        response = await verify2fa({ token, secret });
      }

      if (!response?.success) return setError(response?.message ?? "");
      console.log("Successfully verified 2fa", response);
    }
  };

  return (
    <section>
      <InputOTP maxLength={6} onInput={handleOtpChange} value={otp}>
        <InputOTPGroup className="text-primary">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator className="text-primary" />
        <InputOTPGroup className="text-primary">
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      {error && <p className="mt-3 text-red-500 text-sm">*{error}</p>}
    </section>
  );
}
