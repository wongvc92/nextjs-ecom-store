import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { secret, urlPaths } = data;

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  if (!urlPaths) {
    return NextResponse.json({ message: "Please provide paths" }, { status: 401 });
  }
  try {
    // Revalidate the specified path
    await Promise.all(
      urlPaths.map(async (path: string) => {
        revalidatePath(path);
      })
    );
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
