"use client";

import RoleGate from "@/components/auth/role-gate";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import React from "react";

const AdminPage = () => {
  const { data } = useSession();

  const onApiRouteClick = () => {
    fetch("/api/admin").then((response) => {
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
        <RoleGate>You are admin</RoleGate>
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
      </div>
    </div>
  );
};

export default AdminPage;
