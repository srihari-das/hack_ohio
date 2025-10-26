/**
 * API client utilities for calling the FastAPI backend.
 * These run on the client and rely on Next.js rewrites to proxy /api/* to the backend.
 */

/**
 * Ask Gemini via backend POST /api/gemini
 * @param {string} prompt - The user prompt text.
 * @param {{system?: string, model?: string, max_tokens?: number}} [opts]
 * @returns {Promise<{ text: string }>} response JSON from backend.
 */
export async function askGemini(prompt, { system, model, max_tokens } = {}) {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, system, model, max_tokens }),
  });
  if (!res.ok) {
    let detail = "Request failed";
    try {
      const err = await res.json();
      detail = err?.detail || detail;
    } catch {}
    throw new Error(detail);
  }
  const data = await res.json();
  return data; // expected shape: { text }
}
