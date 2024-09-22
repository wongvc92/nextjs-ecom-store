"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Heart, Menu, Receipt, ReceiptText, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./ui/mode-toggle";

import MobileSearch from "./mobile-search";
import { useState } from "react";
import LoginButton from "./login-button";

import { useFavouriteContext } from "@/providers/favourite.provider";

import { useSession } from "next-auth/react";
import SignOutButton from "./auth/sign-out-button";
import UserButton from "./auth/user-button";
import { Separator } from "./ui/separator";
import { useRouter } from "next/navigation";
import { SignInButton } from "./auth/sign-in-button";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data } = useSession();
  const { favouriteProducts } = useFavouriteContext();
  const handleChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleChange}>
      <Button variant="link" type="button" onClick={() => setIsOpen(true)}>
        <Menu />
      </Button>
      <SheetContent side="left" className="w-full min-h-screen py-20 space-y-4 flex-grow text-muted-foreground">
        <div className="flex flex-col space-y-10 ">
          <MobileSearch setIsOpen={setIsOpen} />
          <div className="space-y-4" onClick={() => setIsOpen(false)}>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 rounded-md" onClick={() => router.push("/favourites")}>
              <Heart /> Favourites {!!favouriteProducts && favouriteProducts.length > 0 && `(${favouriteProducts?.length})`}
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 rounded-md" onClick={() => router.push("/orders")}>
              <ReceiptText /> Orders {!!favouriteProducts && favouriteProducts.length > 0 && `(${favouriteProducts?.length})`}
            </div>

            <div className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 rounded-md" onClick={() => router.push("/settings")}>
              <SettingsIcon />
              Settings
            </div>
            <div className="hover:bg-muted cursor-pointer p-1 rounded-md">
              <ModeToggle />
            </div>

            <div className="hover:bg-muted cursor-pointer p-1 rounded-md">{data?.user ? <SignOutButton /> : <SignInButton />}</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
