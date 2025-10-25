module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/app/api/client.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API client utilities for calling the FastAPI backend.
 * These run on the client and rely on Next.js rewrites to proxy /api/* to the backend.
 */ /**
 * Ask Gemini via backend POST /api/gemini
 * @param {string} prompt - The user prompt text.
 * @param {{system?: string, model?: string, max_tokens?: number}} [opts]
 * @returns {Promise<{ text: string }>} response JSON from backend.
 */ __turbopack_context__.s([
    "askGemini",
    ()=>askGemini
]);
async function askGemini(prompt, { system, model, max_tokens } = {}) {
    const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt,
            system,
            model,
            max_tokens
        })
    });
    if (!res.ok) {
        let detail = "Request failed";
        try {
            const err = await res.json();
            detail = err?.detail || detail;
        } catch  {}
        throw new Error(detail);
    }
    const data = await res.json();
    return data; // expected shape: { text }
}
}),
"[project]/src/app/lib/stt.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Speech-to-Text utility using the Web Speech Recognition API
// Exports:
// - sttSupported: boolean
// - createRecognition(options)
// - startRecognition({ onInterim, onFinal, onError, onStart, onEnd, lang, continuous, interimResults })
// - useSpeechToText(options) -> { listening, interim, finalText, error, start, stop, reset }
__turbopack_context__.s([
    "createRecognition",
    ()=>createRecognition,
    "startRecognition",
    ()=>startRecognition,
    "sttSupported",
    ()=>sttSupported,
    "useSpeechToText",
    ()=>useSpeechToText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
const SR = ("TURBOPACK compile-time value", "undefined") !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
const sttSupported = Boolean(SR);
function createRecognition({ lang = "en-US", continuous = true, interimResults = true } = {}) {
    if (!sttSupported) return null;
    const rec = new SR();
    rec.lang = lang;
    rec.continuous = continuous;
    rec.interimResults = interimResults;
    return rec;
}
function startRecognition({ lang = "en-US", continuous = true, interimResults = true, onInterim, onFinal, onError, onStart, onEnd } = {}) {
    const rec = createRecognition({
        lang,
        continuous,
        interimResults
    });
    if (!rec) throw new Error("Speech recognition not supported in this browser");
    rec.onstart = ()=>{
        onStart && onStart();
    };
    rec.onresult = (event)=>{
        let interim = "";
        let finalChunk = "";
        for(let i = event.resultIndex; i < event.results.length; i++){
            const result = event.results[i];
            if (result.isFinal) finalChunk += result[0].transcript;
            else interim += result[0].transcript;
        }
        if (interim && onInterim) onInterim(interim);
        if (finalChunk && onFinal) onFinal(finalChunk);
    };
    rec.onerror = (e)=>{
        onError && onError(e);
    };
    rec.onend = ()=>{
        onEnd && onEnd();
    };
    rec.start();
    return {
        recognition: rec,
        stop: ()=>{
            try {
                rec.stop();
            } catch  {}
        },
        abort: ()=>{
            try {
                rec.abort();
            } catch  {}
        }
    };
}
function useSpeechToText({ lang = "en-US", continuous = true, interimResults = true } = {}) {
    const [listening, setListening] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [interim, setInterim] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [finalText, setFinalText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const recRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            try {
                recRef.current?.stop?.();
            } catch  {}
        };
    }, []);
    const start = ()=>{
        setError("");
        if (!sttSupported) {
            setError("Speech recognition not supported");
            return;
        }
        // If already listening, restart to refresh handlers
        try {
            recRef.current?.abort?.();
        } catch  {}
        const { recognition } = startRecognition({
            lang,
            continuous,
            interimResults,
            onStart: ()=>setListening(true),
            onInterim: (i)=>setInterim(i),
            onFinal: (f)=>setFinalText((prev)=>(prev ? prev + " " : "") + f),
            onError: (e)=>{
                setError(e?.error || e?.message || "recognition error");
                setListening(false);
            },
            onEnd: ()=>setListening(false)
        });
        recRef.current = recognition;
    };
    const stop = ()=>{
        try {
            recRef.current?.stop?.();
        } catch (e) {
            setError(e?.message || String(e));
        }
    };
    const reset = ()=>{
        setInterim("");
        setFinalText("");
        setError("");
    };
    return {
        listening,
        interim,
        finalText,
        error,
        start,
        stop,
        reset
    };
}
}),
"[project]/src/app/lib/tts.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Simple Text-to-Speech utility built on the Web Speech Synthesis API
// Exports: speak, cancel, getVoices, onVoicesChanged, supported
__turbopack_context__.s([
    "cancel",
    ()=>cancel,
    "getVoices",
    ()=>getVoices,
    "onVoicesChanged",
    ()=>onVoicesChanged,
    "speak",
    ()=>speak,
    "supported",
    ()=>supported
]);
const supported = ("TURBOPACK compile-time value", "undefined") !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
function getVoices() {
    if ("TURBOPACK compile-time truthy", 1) return [];
    //TURBOPACK unreachable
    ;
}
function onVoicesChanged(cb) {
    if ("TURBOPACK compile-time truthy", 1) return ()=>{};
    //TURBOPACK unreachable
    ;
    const handler = undefined;
}
function speak({ text, voice = null, rate = 1, pitch = 1, volume = 1 } = {}) {
    if ("TURBOPACK compile-time truthy", 1) throw new Error("Speech synthesis not supported in this browser");
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = pitch;
    u.volume = volume;
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
    return u; // return utterance in case the caller wants events
}
function cancel() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
}),
"[project]/src/app/quacking/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/app/quacking/page.js
__turbopack_context__.s([
    "default",
    ()=>Quacking
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/client.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$stt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/stt.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$tts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/tts.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function Quacking() {
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Speech-to-Text: one-shot utterances; auto end when user pauses
    const { listening, interim, finalText, error: sttError, start, stop, reset } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$stt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSpeechToText"])({
        lang: "en-US",
        continuous: false,
        interimResults: true
    });
    // If user starts speaking, stop any ongoing TTS so it doesn't talk over them
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (listening && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$tts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supported"]) {
            try {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$tts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cancel"])();
            } catch  {}
        }
    }, [
        listening
    ]);
    const sendPrompt = async (prompt, { max_tokens = 512 } = {})=>{
        const trimmed = (prompt || "").trim();
        if (!trimmed) return;
        // Append user message and an assistant placeholder (loading)
        setMessages((prev)=>[
                ...prev,
                {
                    role: "user",
                    content: trimmed
                },
                {
                    role: "assistant",
                    content: "",
                    isLoading: true
                }
            ]);
        setIsLoading(true);
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["askGemini"])(trimmed, {
                system: "You are a helpful rubber duck assistant that asks Socratic questions to help users learn by explaining concepts. When a user explains something to you, ask thoughtful questions that guide them to deeper understanding. Be encouraging and curious.",
                max_tokens
            });
            // Replace the trailing placeholder with the actual response
            setMessages((prev)=>{
                if (!prev.length) return prev;
                const next = prev.slice();
                const last = next.length - 1;
                if (next[last]?.isLoading) {
                    next[last] = {
                        role: "assistant",
                        content: data.text
                    };
                } else {
                    next.push({
                        role: "assistant",
                        content: data.text
                    });
                }
                return next;
            });
            // Speak assistant reply
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$tts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supported"]) {
                try {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$tts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cancel"])();
                } catch  {}
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$tts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["speak"])({
                    text: data.text
                });
            }
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev)=>{
                if (!prev.length) return prev;
                const next = prev.slice();
                const last = next.length - 1;
                if (next[last]?.isLoading) {
                    next[last] = {
                        role: "assistant",
                        content: "Sorry, something went wrong. Please try again."
                    };
                } else {
                    next.push({
                        role: "assistant",
                        content: "Sorry, something went wrong. Please try again."
                    });
                }
                return next;
            });
        } finally{
            setIsLoading(false);
        }
    };
    const handleSend = async ()=>{
        if (!input.trim()) return;
        const prompt = input;
        setInput("");
        await sendPrompt(prompt, {
            max_tokens: 512
        });
    };
    // When speech recognition ends and we have an utterance, send it
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$stt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sttSupported"]) return;
        if (listening) return; // still capturing
        const prompt = (finalText + (interim ? " " + interim : "")).trim();
        if (!prompt) return;
        (async ()=>{
            try {
                await sendPrompt(prompt, {
                    max_tokens: 256
                });
            } finally{
                // clear transcript after sending; do not auto-restart here, user controls with mic
                try {
                    reset();
                } catch  {}
            }
        })();
    }, [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$stt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sttSupported"],
        listening,
        finalText,
        interim
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto px-4 py-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-4xl mx-auto space-y-8",
                    children: [
                        messages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center text-gray-400 mt-20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-lg mb-2",
                                    children: "Start explaining a concept"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/quacking/page.js",
                                    lineNumber: 134,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm",
                                    children: "The duck will ask questions to help you learn"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/quacking/page.js",
                                    lineNumber: 135,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/quacking/page.js",
                            lineNumber: 133,
                            columnNumber: 13
                        }, this),
                        messages.map((msg, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: msg.role === "user" ? // User message - simple style
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "max-w-2xl px-6 py-4 rounded-lg bg-blue-600 text-white",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "whitespace-pre-wrap",
                                            children: msg.content
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/quacking/page.js",
                                            lineNumber: 147,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/quacking/page.js",
                                        lineNumber: 146,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/quacking/page.js",
                                    lineNumber: 145,
                                    columnNumber: 17
                                }, this) : // Assistant message - Hades style
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative max-w-3xl mx-auto",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-center mb-[-60px] relative z-0 opacity-70",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/graduate_duck2.png",
                                                alt: "Graduate Duck",
                                                width: 300,
                                                height: 300,
                                                priority: true
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/quacking/page.js",
                                                lineNumber: 155,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/quacking/page.js",
                                            lineNumber: 154,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative z-10 bg-gradient-to-b from-amber-100 to-amber-50 border-4 border-amber-800 rounded-lg p-6 pt-12 shadow-2xl",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-0 left-0 right-0 bg-amber-800 text-amber-100 py-1 px-4 text-center font-bold tracking-wider text-sm border-b-2 border-amber-900",
                                                    children: "RUBBER DUCK"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/quacking/page.js",
                                                    lineNumber: 167,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-amber-900"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/quacking/page.js",
                                                    lineNumber: 172,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-amber-900"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/quacking/page.js",
                                                    lineNumber: 173,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-amber-900"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/quacking/page.js",
                                                    lineNumber: 174,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-amber-900"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/quacking/page.js",
                                                    lineNumber: 175,
                                                    columnNumber: 21
                                                }, this),
                                                msg.isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex space-x-2 items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-3 h-3 bg-amber-800 rounded-full animate-bounce",
                                                            style: {
                                                                animationDelay: "0ms"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/quacking/page.js",
                                                            lineNumber: 180,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-3 h-3 bg-amber-800 rounded-full animate-bounce",
                                                            style: {
                                                                animationDelay: "150ms"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/quacking/page.js",
                                                            lineNumber: 184,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-3 h-3 bg-amber-800 rounded-full animate-bounce",
                                                            style: {
                                                                animationDelay: "300ms"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/quacking/page.js",
                                                            lineNumber: 188,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/quacking/page.js",
                                                    lineNumber: 179,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-900 text-lg leading-relaxed font-serif whitespace-pre-wrap",
                                                    children: msg.content
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/quacking/page.js",
                                                    lineNumber: 194,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/quacking/page.js",
                                            lineNumber: 165,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/quacking/page.js",
                                    lineNumber: 152,
                                    columnNumber: 17
                                }, this)
                            }, idx, false, {
                                fileName: "[project]/src/app/quacking/page.js",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/quacking/page.js",
                    lineNumber: 131,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/quacking/page.js",
                lineNumber: 130,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gray-900 border-t-2 border-amber-800 px-4 py-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-4xl mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>{
                                        try {
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$tts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cancel"])();
                                        } catch  {}
                                        if (listening) {
                                            stop();
                                        } else {
                                            reset();
                                            start();
                                        }
                                    },
                                    title: listening ? "Stop listening" : "Start listening",
                                    className: `px-4 py-3 rounded-lg border-2 ${listening ? "border-red-500 bg-red-600 text-white" : "border-amber-700 bg-amber-600 text-white"} hover:brightness-110 transition`,
                                    children: listening ? "🎙️ Stop" : "🎤 Speak"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/quacking/page.js",
                                    lineNumber: 211,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: input,
                                    onChange: (e)=>setInput(e.target.value),
                                    onKeyPress: (e)=>e.key === "Enter" && !e.shiftKey && handleSend(),
                                    placeholder: "Explain a concept...",
                                    disabled: isLoading,
                                    className: "flex-1 px-6 py-4 bg-gray-800 border-2 border-amber-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600 disabled:opacity-50 text-lg"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/quacking/page.js",
                                    lineNumber: 233,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSend,
                                    disabled: !input.trim() || isLoading,
                                    className: "px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg border-2 border-amber-800",
                                    children: "→"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/quacking/page.js",
                                    lineNumber: 244,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/quacking/page.js",
                            lineNumber: 209,
                            columnNumber: 11
                        }, this),
                        sttError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-red-400 text-sm mt-2",
                            children: String(sttError)
                        }, void 0, false, {
                            fileName: "[project]/src/app/quacking/page.js",
                            lineNumber: 253,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/quacking/page.js",
                    lineNumber: 208,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/quacking/page.js",
                lineNumber: 207,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/quacking/page.js",
        lineNumber: 128,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__62763942._.js.map