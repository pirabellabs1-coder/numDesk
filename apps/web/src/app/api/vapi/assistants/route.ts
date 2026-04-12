import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { listVapiAssistants } from "@/lib/vapi";

export async function GET() {
  try {
    await withAuth();
    const assistants = await listVapiAssistants();
    return apiSuccess(assistants);
  } catch (error) {
    return handleApiError(error);
  }
}
