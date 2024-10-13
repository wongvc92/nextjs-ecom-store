import { CourierService } from "@/lib/types";

interface GetCourierServicesProps {
  fromPostcode: number;
  toPostcode: number;
  weight: number;
}
const baseUrl = process.env.NEXT_PUBLIC_TRACKING_MY_URL!;
const apiKey = process.env.NEXT_PUBLIC_TRACKING_MY_API_KEY!;

export const getCourierServices = async ({ fromPostcode, toPostcode, weight }: GetCourierServicesProps) => {
  try {
    console.log("apiKey", apiKey);
    const url = new URL(
      `${baseUrl}/api/v1/services?from_postcode=${fromPostcode}&to_postcode=${toPostcode}&weight=${weight}&from_country=MY&to_country=MY&type=normal`
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
    console.log("getCourierServices", data.services);
    return data.services as CourierService[];
  } catch (error) {
    console.log("Failed fetch courier list: ", error);
  }
};

interface GetJnTEkspressQuotePriceProps {
  fromPostcode: number;
  toPostcode: number;
  weight: number;
  courier: string;
}
export const getJnTEkspressQuotePrice = async ({ fromPostcode, toPostcode, weight, courier }: GetJnTEkspressQuotePriceProps) => {
  const courierServices = await getCourierServices({ fromPostcode, toPostcode, weight });

  const JnTCourier = courierServices?.filter((item) => item.courier_title === courier);
  if (!JnTCourier) return null;
  return JnTCourier[1];
};
