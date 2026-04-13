import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { z } from "zod";

const twilioSchema = z.object({
  accountSid: z.string().min(1, "Account SID requis"),
  authToken: z.string().min(1, "Auth Token requis"),
});

export async function POST(req: NextRequest) {
  try {
    await withAuth();
    const body = twilioSchema.parse(await req.json());

    // Fetch incoming phone numbers from Twilio REST API
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${body.accountSid}/IncomingPhoneNumbers.json`;
    const credentials = Buffer.from(`${body.accountSid}:${body.authToken}`).toString("base64");

    const res = await fetch(twilioUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      let detail = "Identifiants Twilio invalides ou erreur de connexion";
      try {
        const errJson = JSON.parse(errText);
        detail = errJson.message || detail;
      } catch {}
      return apiError("TWILIO_ERROR", detail, res.status >= 500 ? 502 : 401);
    }

    const data = await res.json();
    const numbers = (data.incoming_phone_numbers || []).map((n: any) => ({
      phoneNumber: n.phone_number,
      friendlyName: n.friendly_name,
      sid: n.sid,
      capabilities: n.capabilities,
    }));

    return apiSuccess(numbers);
  } catch (error) {
    return handleApiError(error);
  }
}
