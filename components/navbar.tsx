import React from "react";
import Link from "next/link";
import SearchModal from "./search-modal";
import MaxWrapper from "./max-wrapper";
import MobileNav from "./mobile-nav";
import MobileCart from "./mobile-cart";
import UserButton from "./auth/user-button";

const Navbar = () => {
  return (
    <MaxWrapper className="flex justify-between items-center py-2 h-20 px-4">
      <MobileNav />
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
