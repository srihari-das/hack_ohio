// Speech-to-Text utility using the Web Speech Recognition API
// Exports:
// - sttSupported: boolean
// - createRecognition(options)
// - startRecognition({ onInterim, onFinal, onError, onStart, onEnd, lang, continuous, interimResults })
// - useSpeechToText(options) -> { listening, interim, finalText, error, start, stop, reset }

import { useEffect, useRef, useState } from "react";

const SR =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

export const sttSupported = Boolean(SR);

export function createRecognition({
  lang = "en-US",
  continuous = true,
  interimResults = true,
} = {}) {
  if (!sttSupported) return null;
  const rec = new SR();
  rec.lang = lang;
  rec.continuous = continuous;
  rec.interimResults = interimResults;
  return rec;
}

export function startRecognition({
  lang = "en-US",
  continuous = true,
  interimResults = true,
  onInterim,
  onFinal,
  onError,
  onStart,
  onEnd,
} = {}) {
  const rec = createRecognition({ lang, continuous, interimResults });
  if (!rec) throw new Error("Speech recognition not supported in this browser");

  rec.onstart = () => {
    onStart && onStart();
  };
  rec.onresult = (event) => {
    let interim = "";
    let finalChunk = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) finalChunk += result[0].transcript;
      else interim += result[0].transcript;
    }
    if (interim && onInterim) onInterim(interim);
    if (finalChunk && onFinal) onFinal(finalChunk);
  };
  rec.onerror = (e) => {
    onError && onError(e);
  };
  rec.onend = () => {
    onEnd && onEnd();
  };

  rec.start();

  return {
    recognition: rec,
    stop: () => {
      try {
        rec.stop();
      } catch {}
    },
    abort: () => {
      try {
        rec.abort();
      } catch {}
    },
  };
}

export function useSpeechToText({
  lang = "en-US",
  continuous = true,
  interimResults = true,
} = {}) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [finalText, setFinalText] = useState("");
  const [error, setError] = useState("");
  const recRef = useRef(null);

  useEffect(() => {
    return () => {
      try {
        recRef.current?.stop?.();
      } catch {}
    };
  }, []);

  const start = () => {
    setError("");
    if (!sttSupported) {
      setError("Speech recognition not supported");
      return;
    }
    // If already listening, restart to refresh handlers
    try {
      recRef.current?.abort?.();
    } catch {}

    const { recognition } = startRecognition({
      lang,
      continuous,
      interimResults,
      onStart: () => setListening(true),
      onInterim: (i) => setInterim(i),
      onFinal: (f) => {
        setFinalText((prev) => (prev ? prev + " " : "") + f);
        setInterim(""); // avoid double-including the last interim after it becomes final
      },
      onError: (e) => {
        setError(e?.error || e?.message || "recognition error");
        setListening(false);
      },
      onEnd: () => {
        setListening(false);
        setInterim(""); // ensure cleared at end of session
      },
    });
    recRef.current = recognition;
  };

  const stop = () => {
    try {
      recRef.current?.stop?.();
    } catch (e) {
      setError(e?.message || String(e));
    }
  };

  const reset = () => {
    setInterim("");
    setFinalText("");
    setError("");
  };

  return { listening, interim, finalText, error, start, stop, reset };
}
