import RoleGate from "@/components/auth/role-gate";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export const dynamic = "force-dynamic";

const Base_URL = process.env.NEXT_PUBLIC_STORE_URL!;

const AdminPage = () => {
  const onApiRouteClick = () => {
    const url = new URL(`${Base_URL}/api/admin`);
    fetch(url.toString()).then((response) => {
      if (response.ok) {
        console.log("okay");
      } else {
        console.log("forbidden");
      }
    });
  };
  return (
    <div className="max-w-md mx-auto ">
      <div className="flex flex-col gap-4 px-4">
        <RoleGate>
          You are admin
          <div className="flex items-center justify-between border rounded-md p-2 gap-2 shadow-sm">
            <p>Admin only api route</p>
            <Button type="button" onClick={onApiRouteClick}>
              Click to test
            </Button>
          </div>
          <div className="flex items-center justify-between border rounded-md p-2 gap-2 shadow-sm">
            <p>Admin only server action</p>
            <Button type="button">Click to test</Button>
          </div>
        </RoleGate>
      </div>
    </div>
  );
};

export default AdminPage;
