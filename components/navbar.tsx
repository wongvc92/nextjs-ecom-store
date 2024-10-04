import React from "react";
import Link from "next/link";
import SearchModal from "./search-modal";
import MaxWrapper from "./max-wrapper";
import MobileCart from "./cart-sheet";
import UserButton from "./auth/user-button";
import { getOrderStatsCount } from "@/lib/db/queries/orders";
import { auth } from "@/auth";
import SideNav from "./side-nav";

const Navbar = async () => {
  const session = await auth();
  const { allOrdersCount } = await getOrderStatsCount(session?.user.id as string);

  console.log("allOrdersCount", allOrdersCount);
  return (
    <MaxWrapper className="flex justify-between items-center py-2 h-20 px-4">
      <SideNav allOrdersCount={allOrdersCount} />
      <Link href="/" className="text-sm">
        store logo
      </Link>
      <SearchModal />
      <div className="flex items-center gap-4">
        <UserButton />
        <MobileCart />
      </div>
    </MaxWrapper>
  );
};

export default Navbar;
