import Link from "next/link";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import SeparatorWithText from "../separator/SeparatorWithText";
import { Button } from "../ui/button";

interface AuthContainerProps {
  variant: "login" | "register";
  children: React.ReactNode;
  headerLabel?: string;
  backButtonLabel?: string;
  hrefBack?: string;
  hrefBackLabel?: string;
  authLabel?: string;
  loading?: boolean;
}
export default function AuthContainer({
  children,
  variant = "login",
  loading = false,
  headerLabel,
  backButtonLabel,
  hrefBack,
  hrefBackLabel,
  authLabel,
}: AuthContainerProps) {
  return (
    <div className="flex flex-col xl:w-72 justify-center items-center min-h-screen m-auto">
      <h3 className="text-2xl mb-6 font-extrabold">
        {headerLabel ?? variant === "login"
          ? "Welcome back"
          : "Create an account"}
      </h3>
      {children}
      <SeparatorWithText label="Or" />
      <Button disabled={loading} className="w-full">
        <FcGoogle className="mr-2" />
        {loading ? "Loading..." : `${authLabel ?? variant} with Google`}
      </Button>

      <section className="flex w-full justify-center items-center">
        <p>
          {backButtonLabel ?? variant === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
        </p>
        <Button variant="link">
          <Link
            href={
              hrefBack ?? `${variant === "login" ? "/register" : "/login"}`
            }>
            {hrefBackLabel ?? variant === "login" ? "Register" : "Login"}
          </Link>
        </Button>
      </section>
    </div>
  );
}
