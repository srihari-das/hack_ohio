module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
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
"[project]/src/app/lib/api.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
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
"[project]/src/app/listen/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ListenPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$stt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/stt.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/api.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$tts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/tts.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function ListenPage() {
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>setMounted(true), []);
    const { listening, interim, finalText, error, start, stop, reset } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$stt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSpeechToText"])({
        lang: "en-US",
        continuous: true,
        interimResults: true
    });
    if (!mounted) return null; // avoid SSR/client mismatch
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$stt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sttSupported"]) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 24
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    children: "Listen"
                }, void 0, false, {
                    fileName: "[project]/src/app/listen/page.js",
                    lineNumber: 24,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Your browser does not support the Web Speech Recognition API."
                }, void 0, false, {
                    fileName: "[project]/src/app/listen/page.js",
                    lineNumber: 25,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Try Chrome or Edge on desktop."
                }, void 0, false, {
                    fileName: "[project]/src/app/listen/page.js",
                    lineNumber: 26,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/listen/page.js",
            lineNumber: 23,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: 24,
            maxWidth: 900,
            margin: "0 auto"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                children: "Listen (Speech to Text)"
            }, void 0, false, {
                fileName: "[project]/src/app/listen/page.js",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 8,
                    marginBottom: 12
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: start,
                        disabled: listening,
                        children: "Start"
                    }, void 0, false, {
                        fileName: "[project]/src/app/listen/page.js",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: stop,
                        disabled: !listening,
                        children: "Stop"
                    }, void 0, false, {
                        fileName: "[project]/src/app/listen/page.js",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: reset,
                        children: "Reset"
                    }, void 0, false, {
                        fileName: "[project]/src/app/listen/page.js",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: async ()=>{
                            const prompt = (finalText + (interim ? " " + interim : "")).trim();
                            if (!prompt) return;
                            try {
                                const { text } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["askGemini"])(prompt);
                                if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$tts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supported"]) {
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$tts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cancel"])();
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$tts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["speak"])({
                                        text
                                    });
                                }
                                // Optionally append the response into the transcript area
                                // setFinalText((prev) => (prev ? prev + "\n\n" : "") + text);
                                alert(text);
                            } catch (e) {
                                alert("Gemini error: " + (e?.message || String(e)));
                            }
                        },
                        children: "Ask Gemini"
                    }, void 0, false, {
                        fileName: "[project]/src/app/listen/page.js",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/listen/page.js",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    color: "#b00020",
                    marginBottom: 12
                },
                children: [
                    "Error: ",
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/listen/page.js",
                lineNumber: 64,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: 12,
                    minHeight: 180,
                    background: "#fafafa"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            whiteSpace: "pre-wrap"
                        },
                        children: finalText
                    }, void 0, false, {
                        fileName: "[project]/src/app/listen/page.js",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this),
                    interim && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            opacity: 0.6,
                            whiteSpace: "pre-wrap"
                        },
                        children: interim
                    }, void 0, false, {
                        fileName: "[project]/src/app/listen/page.js",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/listen/page.js",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    marginTop: 12,
                    fontSize: 12,
                    color: "#6b7280"
                },
                children: [
                    "Status: ",
                    listening ? "Listening…" : "Idle",
                    " • Language: en-US • Interim: on • Continuous: on"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/listen/page.js",
                lineNumber: 80,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/listen/page.js",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1c1f9485._.js.map