import { auth } from "@/auth";
import { SettingsForm } from "./components/settings-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your account settings, update your personal information, and configure preferences for your account.",
};

const SettingsPage = async () => {
  const session = await auth();
  return (
    <>
      {session && session.user && (
        <div className="max-w-md mx-auto ">
          <div className="px-4 space-y-4">
            <p className="text-center">Settings</p>
            <SettingsForm session={session} />
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsPage;
