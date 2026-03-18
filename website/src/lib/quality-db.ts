import { sql } from "@vercel/postgres";

export interface QualityScore {
  id: number;
  portrait_id: string;
  portrait_url: string;
  original_photo_url: string;
  order_id: string;
  score: number;
  status: "pending_review" | "approved" | "rejected";
  auto_approved: boolean;
  reviewer_notes: string | null;
  created_at: Date;
  reviewed_at: Date | null;
}

export async function getPortraitsForReview(): Promise<QualityScore[]> {
  try {
    const result = await sql<QualityScore>`
      SELECT * FROM quality_scores
      WHERE status = 'pending_review'
      ORDER BY created_at ASC
    `;
    return result.rows;
  } catch (error) {
    console.error("Error fetching portraits for review:", error);
    throw error;
  }
}

export async function approvePortrait(
  id: number,
  reviewerNotes?: string
): Promise<void> {
  try {
    await sql`
      UPDATE quality_scores
      SET
        status = 'approved',
        reviewed_at = NOW(),
        reviewer_notes = ${reviewerNotes || null}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Error approving portrait:", error);
    throw error;
  }
}

export async function rejectPortrait(
  id: number,
  notes: string
): Promise<void> {
  try {
    await sql`
      UPDATE quality_scores
      SET
        status = 'rejected',
        reviewed_at = NOW(),
        reviewer_notes = ${notes}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Error rejecting portrait:", error);
    throw error;
  }
}

export async function updateScore(
  id: number,
  score: number
): Promise<void> {
  try {
    await sql`
      UPDATE quality_scores
      SET score = ${score}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Error updating score:", error);
    throw error;
  }
}

export async function createQualityScore(data: {
  portrait_id: string;
  portrait_url: string;
  original_photo_url: string;
  order_id: string;
  score: number;
  status: "pending_review" | "approved" | "rejected";
  auto_approved: boolean;
}): Promise<void> {
  try {
    await sql`
      INSERT INTO quality_scores (
        portrait_id,
        portrait_url,
        original_photo_url,
        order_id,
        score,
        status,
        auto_approved
      ) VALUES (
        ${data.portrait_id},
        ${data.portrait_url},
        ${data.original_photo_url},
        ${data.order_id},
        ${data.score},
        ${data.status},
        ${data.auto_approved}
      )
    `;
  } catch (error) {
    console.error("Error creating quality score:", error);
    throw error;
  }
}

export async function getQualityScoresByOrderId(
  orderId: string
): Promise<QualityScore[]> {
  try {
    const result = await sql<QualityScore>`
      SELECT * FROM quality_scores
      WHERE order_id = ${orderId}
      ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error("Error fetching quality scores by order ID:", error);
    throw error;
  }
}
