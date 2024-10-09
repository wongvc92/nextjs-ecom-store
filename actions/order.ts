"use server";

import { updateOrderStatusSchema } from "@/lib/validation/orderSchemas";
import { revalidatePath } from "next/cache";

const baseUrl = process.env.NEXT_PUBLIC_ADMIN_URL!;
export const updateOrderStatusByOrderId = async (formData: FormData) => {
  const parsed = updateOrderStatusSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }

  const { id, status } = parsed.data;

  const url = new URL(`${baseUrl}/api/orders/updateStatus`);

  try {
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        error: errorData.error || "Failed to update order status",
      };
    }

    revalidatePath("orders");
    return {
      success: "Order status updated successfully",
    };
  } catch (error) {
    console.log("Failed update order status: ", error);
    return { error: "Failed update order status" };
  }
};
