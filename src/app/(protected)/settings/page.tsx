"use client";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { data: session, status, update } = useSession();

  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      update();
    }
  });

  const onUpdate = () => {
    router.push("/settings/update/password");
  };

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="m-auto w-fit flex flex-col gap-6 bg-secondary p-8 rounded-xl">
      <Image
        src={session?.user?.image ?? "/vercel.svg"}
        loader={() => session?.user?.image ?? "/vercel.svg"}
        alt="logo"
        width={100}
        height={100}
        className="m-auto"
      />
      <section>
        <h1>Hallo, {session?.user?.name}</h1>
        <h2>Your email, {session?.user?.email}</h2>
      </section>
      <section>
        <Button onClick={onUpdate}>Update</Button>
      </section>
    </div>
  );
}
