"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { LucideSettings } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";

export function NavBar() {
  const session = useSession();
  return (
    <nav className="w-full flex justify-between px-6 py-2">
      <NavigationMenu>
        <NavigationMenuList className="flex gap-4">
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle() + " underline"}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu>
        <NavigationMenuList className="flex gap-4">
          {session.status === "unauthenticated" ? (
            <>
              <NavigationMenuItem>
                <Link href="/auth/login" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Login
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/auth/register" passHref>
                  <Button asChild>
                    <a>Register</a>
                  </Button>
                </Link>
              </NavigationMenuItem>
            </>
          ) : (
            <>
              <NavigationMenuItem>
                <Link href="/auth/register" passHref>
                  <Button asChild>
                    <a>Log Out</a>
                  </Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/settings" passHref>
                  <LucideSettings />
                </Link>
              </NavigationMenuItem>
            </>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
