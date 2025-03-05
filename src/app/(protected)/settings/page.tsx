"use client";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Page() {
  const { data: session, status, update } = useSession();
  const handleLogOut = async () => {
    await signOut();
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      update();
    }
  });

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div>
      <h1>{JSON.stringify({ session, status })}</h1>
      <Button onClick={handleLogOut}>Log out</Button>
    </div>
  );
}
