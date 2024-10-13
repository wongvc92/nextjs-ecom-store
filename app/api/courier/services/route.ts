import { CourierService } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_TRACKING_MY_URL!;
const apiKey = process.env.TRACKING_MY_API_KEY!;

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { fromPostcode, toPostcode, weight, courier } = body;
  if (!fromPostcode || !toPostcode || !weight) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  try {
    console.log("apiKey", apiKey);
    const url = new URL(
      `${baseUrl}/api/v1/services?from_postcode=${fromPostcode}&to_postcode=${toPostcode}&weight=${weight}&from_country=MY&to_country=MY&type=normal&service_type=`
    );
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Tracking-Api-Key": apiKey,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      console.log("Failed fetch Tracking list");
      return null;
    }

    const data = await res.json();

    console.log("data services", data.services);
    const filteredServices = data.services.filter((item: CourierService) => item.courier_title === courier);
    console.log("filteredServices", filteredServices);
    return NextResponse.json(filteredServices as CourierService[], { status: 200 });
  } catch (error) {
    console.log("Failed fetch courier list: ", error);
    return NextResponse.json({ error: "Failed fetch courier list:" }, { status: 500 });
  }
};
