import { UserRoleEnum } from "@/@types/next-auth";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const role = session?.user.role;
  console.log(role);
  if (role && role === "ADMIN") {
    return new NextResponse(null, { status: 200 });
  }

  return new NextResponse(null, { status: 403 });
}
