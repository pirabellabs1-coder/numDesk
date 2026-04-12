import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";

// Keywords are derived from conversations transcript analysis
// For now, returns aggregated data. In production, this would query a materialized view.
export async function GET() {
  try { await withAuth();
    // TODO: Implement keyword extraction from conversation transcripts
    return apiSuccess([]);
  } catch (error) { return handleApiError(error); }
}
