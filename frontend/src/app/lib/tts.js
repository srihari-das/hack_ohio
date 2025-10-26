// Simple Text-to-Speech utility built on the Web Speech Synthesis API
// Exports: speak, cancel, getVoices, onVoicesChanged, supported
// Extras: setPreferredVoice, getPreferredVoice (defaults to Tingting zh-CN if available)

export const supported =
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  "SpeechSynthesisUtterance" in window;

export function getVoices() {
  if (!supported) return [];
  return window.speechSynthesis.getVoices();
}

// Preferred voice configuration (overridable)
let preferred = { name: "Fred", lang: "en-US" };

export function setPreferredVoice({ name, lang } = {}) {
  if (typeof name === "string" && name.trim()) preferred.name = name.trim();
  if (typeof lang === "string" && lang.trim()) preferred.lang = lang.trim();
}

function resolvePreferredVoice() {
  if (!supported) return null;
  const voices = getVoices();
  if (!voices.length) return null;
  // 1) Exact name match (case-sensitive matches typical getVoices names)
  if (preferred?.name) {
    const exact = voices.find((v) => v.name === preferred.name);
    if (exact) return exact;
    // fuzzy contains
    const fuzzy = voices.find((v) =>
      v.name?.toLowerCase().includes(preferred.name.toLowerCase())
    );
    if (fuzzy) return fuzzy;
  }
  // 2) Language match
  if (preferred?.lang) {
    const langMatch = voices.find((v) =>
      v.lang?.toLowerCase().startsWith(preferred.lang.toLowerCase())
    );
    if (langMatch) return langMatch;
  }
  // 3) Browser default
  const def = voices.find((v) => v.default);
  if (def) return def;
  // 4) Fallback: first voice
  return voices[0] || null;
}

export function getPreferredVoice() {
  return resolvePreferredVoice();
}

export function onVoicesChanged(cb) {
  if (!supported) return () => {};
  const handler = () => cb(getVoices());
  window.speechSynthesis.addEventListener("voiceschanged", handler);
  // Fire once in case voices are already loaded
  queueMicrotask(handler);
  return () =>
    window.speechSynthesis.removeEventListener("voiceschanged", handler);
}

export function speak({
  text,
  voice = null,
  rate = 1,
  pitch = 1,
  volume = 1,
} = {}) {
  if (!supported)
    throw new Error("Speech synthesis not supported in this browser");
  if (!text) return;
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate;
  u.pitch = pitch;
  u.volume = volume;
  // Prefer passed-in voice; otherwise pick configured preferred voice
  const chosen = voice || resolvePreferredVoice();
  if (chosen) u.voice = chosen;
  window.speechSynthesis.speak(u);
  return u; // return utterance in case the caller wants events
}

// Realistic TTS via backend (e.g., ElevenLabs). Returns an HTMLAudioElement if successful.
export async function speakRealistic({
  text,
  voice_id,
  model_id,
  stability,
  similarity_boost,
} = {}) {
  if (!text) return null;
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice_id,
        model_id,
        stability,
        similarity_boost,
      }),
    });
    if (!res.ok) throw new Error((await res.text()) || "TTS failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    await audio.play();
    return audio;
  } catch (e) {
    // Fallback to browser TTS if backend/provider not configured or fails
    try {
      speak({ text });
    } catch {}
    return null;
  }
}

export function cancel() {
  if (!supported) return;
  window.speechSynthesis.cancel();
}
