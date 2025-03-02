"use client";
import { useSession } from "next-auth/react";

export default function Page() {
  const session = useSession();
  return (
    <div>
      <h1>{JSON.stringify(session)}</h1>
    </div>
  );
}
