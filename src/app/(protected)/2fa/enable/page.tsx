"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { generate2fa } from "@/server/actions/2fa/generate";
import { verify2fa } from "@/server/actions/2fa/verify";
import { ChangeEvent, useEffect, useState } from "react";
import QRCode from "react-qr-code";

const TwoFactorModal = () => {
  const [otp, setOtp] = useState("");
  const [invalidOtp, setInvalidOtp] = useState(false);
  const [qrData, setQrData] = useState("");
  const [secret, setSecret] = useState("");

  const get2faQrCode = async () => {
    const response = await generate2fa();

    console.log("Created QR Code", response);

    if (response) {
      setQrData(response.otpauthUrl);
      setSecret(response.secret);
    }
  };

  useEffect(() => {
    get2faQrCode();
  }, []);

  const handleOtpChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);

    if (e.target.value.length === 6) {
      const token = e.target.value;
      const response = await verify2fa(secret, token);

      if (response.success) {
        console.log("OTP Verified!");
      } else {
        setInvalidOtp(true);
      }
    }
  };

  return (
    <div className="flex justify-end w-full">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-1 justify-center items-center p-4 text-white rounded-md">
            {qrData && (
              <QRCode
                value={qrData}
                size={256}
                fgColor="#000000"
                bgColor="#fff"
                className="rounded-lg border-2"
              />
            )}
          </div>

          <div className="flex-1 p-4 text-white rounded-md">
            <p className="text-2xl text-gray-700 font-bold mb-4">
              Use an Authenticator App to enable 2FA
            </p>
            <ul className="list-none list-inside mb-4 text-gray-700">
              <li className="mb-2">
                <span className="font-bold">Step 1:</span> Scan the QR Code with
                your Authenticator app.
              </li>
              <li className="mb-2">
                <span className="font-bold">Step 2:</span> Enter the code below
                from your app.
              </li>
            </ul>

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

            {invalidOtp && (
              <p className="mt-3 text-red-500 text-sm">*Invalid Code</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorModal;
