import type {
  ApiResponse,
  SpamRequestBody,
  SpamResponse,
} from "../types/spam-api";

export async function fetchSpamScore(
  body: SpamRequestBody
): Promise<ApiResponse<SpamResponse>> {
  try {
    const resp = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      return {
        ok: false,
        error: json.error ?? resp.statusText,
        status: resp.status,
      };
    }
    return { ok: true, data: json as SpamResponse };
  } catch (e) {
    return { ok: false, error: (e as Error).message, status: 0 };
  }
}
