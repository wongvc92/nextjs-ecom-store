import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound, SettingsIcon } from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "../ui/mode-toggle";
import SignOutButton from "./sign-out-button";
import { SignInButton } from "./sign-in-button";
import { Session } from "next-auth";
import Link from "next/link";

const UserButton = ({ session }: { session: Session | null }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden md:block">
        {session?.user.image ? (
          <Image src={session.user.image} alt="user Image" height={40} width={40} className="rounded-full" />
        ) : (
          <CircleUserRound />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
            <SettingsIcon />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ModeToggle />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{session?.user.id ? <SignOutButton /> : <SignInButton />}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
