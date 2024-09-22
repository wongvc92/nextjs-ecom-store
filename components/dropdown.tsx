"use client";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import Image from "next/image";
import React, { useState } from "react";

import { useSession } from "next-auth/react";
import SignOutButton from "./auth/sign-out-button";

const DropdownMenu = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { data } = useSession();

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        setOpen(true);
      }}
      onMouseLeave={() => {
        setOpen(false);
      }}
    >
      {data?.user.id && data.user?.image && (
        <div className="relative rounded-full overflow-hidden">
          <Image src={data.user?.image} alt="profile image" width={50} height={50} />
        </div>
      )}
      <Button variant="none" className="border-none rounded-full" onClick={() => setOpen(!open)}>
        {/* {user && <Image src={user?.imageUrl} alt="user image" height={50} width={50} className="rounded-full" />} */}
      </Button>

      <div
        className={cn("absolute border shadow-sm rounded-md mt-2 top-8 right-0 w-[200px] z-10 bg-white text-sm h-[300px]", open ? "block" : "hidden")}
        //   onMouseEnter={() => {
        //     setOpen(true);
        //   }}
        //   onMouseLeave={() => {
        //     setOpen(false);
        //   }}
      >
        <ul className="space-y-4 mt-5 px-4">
          <li>User Profile</li>
          {/* <li onClick={clearCart}></li> */}
          <li>
            <SignOutButton />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DropdownMenu;
