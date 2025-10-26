// Simple Text-to-Speech utility built on the Web Speech Synthesis API
// Exports: speak, cancel, getVoices, onVoicesChanged, supported

export const supported =
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  "SpeechSynthesisUtterance" in window;

export function getVoices() {
  if (!supported) return [];
  return window.speechSynthesis.getVoices();
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
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
  return u; // return utterance in case the caller wants events
}

export function cancel() {
  if (!supported) return;
  window.speechSynthesis.cancel();
}
