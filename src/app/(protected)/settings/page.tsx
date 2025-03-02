"use client";
import { Button } from "@/components/ui/button";
import logout from "@/server/actions/logout";
import { useSession } from "next-auth/react";

export default function Page() {
  const session = useSession();

  return (
    <div>
      <h1>{JSON.stringify(session)}</h1>
      <Button onClick={async () => await logout()}>Log out</Button>
    </div>
  );
}
