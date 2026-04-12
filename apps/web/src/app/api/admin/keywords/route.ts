import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";

// Keywords extracted from conversations — global platform view
export async function GET() {
  try { await withAuth();
    // TODO: Implement real keyword extraction from conversations
    return apiSuccess([]);
  } catch (error) { return handleApiError(error); }
}
