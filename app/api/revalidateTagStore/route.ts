import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const { secret, tags } = data;

  // Check for the secret to confirm this is a valid request
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  if (!tags) {
    return NextResponse.json({ message: "Please provide tags" }, { status: 401 });
  }
  try {
    // Revalidate the specified path
    await Promise.all(
      tags.map(async (tag: string) => {
        revalidateTag(tag);
      })
    );
    console.log("revalidateTagstore POST");
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
