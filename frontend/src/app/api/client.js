/**
 * API client utilities for calling the FastAPI backend.
 * These run on the client and rely on Next.js rewrites to proxy /api/* to the backend.
 */

/**
 * Ask Gemini via backend POST /api/gemini
 * @param {string} prompt - The user prompt text.
 * @param {{max_tokens?: number, duck?: string, history?: Array}} [opts]
 * @returns {Promise<{ text: string }>} response JSON from backend.
 */
export async function askGemini(prompt, { max_tokens, duck, history = [] } = {}) {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, max_tokens, duck, history }),
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


/**
 * Get Gemini sentiment analysis via backend POST /api/analyze_sentiment
 */
export async function analyzeSentiment(prompt, { max_tokens, history = [] } = {}) {
  const res = await fetch("/api/analyze_sentiment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, max_tokens, history }),
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
  return data; 
}