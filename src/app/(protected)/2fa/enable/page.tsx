"use client";
import InputOTPComponent from "@/components/input/InputOTPComponent";
import { generate2fa } from "@/server/actions/2fa/generate";
import { verify2fa } from "@/server/actions/2fa/verify";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";
import QRCode from "react-qr-code";

const TwoFactorModal = () => {
  const [qrData, setQrData] = useState("");
  const [secret, setSecret] = useState("");

  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");

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

  const get2faQrCode = async () => {
    const response = await generate2fa();
    console.log("generated 2fa", response);

    if (response) {
      setQrData(response.otpauthUrl);
      setSecret(response.secret);
    }
  };

  useEffect(() => {
    get2faQrCode();
  }, []);

  return (
    <div className="flex justify-end w-full">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-1 justify-center items-center p-4 text-white rounded-md">
            {qrData && (
              <QRCode
                value={qrData}
                size={256}
                fgColor="#000"
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

            <InputOTPComponent
              handleOtpChange={handleOtpChange}
              otp={otp}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorModal;
