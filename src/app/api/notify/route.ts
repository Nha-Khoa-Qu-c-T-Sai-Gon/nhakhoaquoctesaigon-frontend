import { NextRequest, NextResponse } from "next/server";
import {
  sendBookingNotifications,
  sendPromotionNotification,
} from "@/src/lib/email/notifications";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (data.type === "promotion") {
      // Fire and forget promotion notification
      sendPromotionNotification({
        phoneNumber: data.phoneNumber,
        promotionName: data.promotionName,
      }).catch(() => {});
    } else {
      // Fire and forget booking notification
      sendBookingNotifications({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        service: data.service,
        otherService: data.otherService,
        message: data.message,
      }).catch(() => {});
    }

    return NextResponse.json(
      { success: true, message: "Notification queued" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
