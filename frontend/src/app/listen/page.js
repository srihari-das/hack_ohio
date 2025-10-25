"use client";

import { useEffect, useState } from "react";
import { sttSupported, useSpeechToText } from "../lib/stt";
import { askGemini } from "../api/client";
import { speak, cancel, supported as ttsSupported } from "../lib/tts";

export default function ListenPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Keep replies short
  const MAX_TOKENS = 150;

  // Conversational: use discrete utterances (continuous: false) so onend fires after a pause
  const { listening, interim, finalText, error, start, stop, reset } =
    useSpeechToText({
      lang: "en-US",
      continuous: false,
      interimResults: true,
    });

  // If user starts speaking, immediately stop any ongoing TTS
  useEffect(() => {
    if (listening && ttsSupported) {
      try {
        cancel();
      } catch {}
    }
  }, [listening]);

  // Auto-reply loop: when recognition ends and we have content, send to Gemini, speak reply, and restart
  useEffect(() => {
    if (!mounted || !sttSupported) return;
    if (listening) return;
    const prompt = (finalText + (interim ? " " + interim : "")).trim();
    if (!prompt) return;

    let canceled = false;
    (async () => {
      try {
        const { text } = await askGemini(prompt, { max_tokens: MAX_TOKENS });
        if (!canceled && ttsSupported) {
          cancel();
          speak({ text });
        }
      } catch (e) {
        // Optional: surface error via alert or UI
        // eslint-disable-next-line no-alert
        if (!canceled) alert("Gemini error: " + (e?.message || String(e)));
      } finally {
        if (!canceled) {
          // Clear the transcript we just used and resume listening for the next turn
          reset();
          // Small delay to avoid immediate restart issues on some browsers
          setTimeout(() => {
            try {
              start();
            } catch {}
          }, 150);
        }
      }
    })();

    return () => {
      canceled = true;
    };
  }, [mounted, listening, finalText, interim, reset, start]);

  if (!mounted) return null; // avoid SSR/client mismatch

  if (!sttSupported) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Listen</h1>
        <p>Your browser does not support the Web Speech Recognition API.</p>
        <p>Try Chrome or Edge on desktop.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Listen (Speech to Text)</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          onClick={() => {
            try {
              cancel();
            } catch {}
            start();
          }}
          disabled={listening}
        >
          Start
        </button>
        <button onClick={stop} disabled={!listening}>
          Stop
        </button>
        <button onClick={reset}>Reset</button>
      </div>
      {error && (
        <div style={{ color: "#b00020", marginBottom: 12 }}>Error: {error}</div>
      )}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: 12,
          minHeight: 180,
          background: "#fafafa",
        }}
      >
        <div style={{ whiteSpace: "pre-wrap" }}>{finalText}</div>
        {interim && (
          <div style={{ opacity: 0.6, whiteSpace: "pre-wrap" }}>{interim}</div>
        )}
      </div>
      <p style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>
        Status: {listening ? "Listening…" : "Idle"} • Language: en-US • Interim:
        on • Conversational: on
      </p>
    </div>
  );
}
