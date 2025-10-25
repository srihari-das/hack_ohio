(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/lib/tts.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
const supported = ("TURBOPACK compile-time value", "object") !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
function getVoices() {
    if (!supported) return [];
    return window.speechSynthesis.getVoices();
}
function onVoicesChanged(cb) {
    if (!supported) return ()=>{};
    const handler = ()=>cb(getVoices());
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    // Fire once in case voices are already loaded
    queueMicrotask(handler);
    return ()=>window.speechSynthesis.removeEventListener("voiceschanged", handler);
}
function speak({ text, voice = null, rate = 1, pitch = 1, volume = 1 } = {}) {
    if (!supported) throw new Error("Speech synthesis not supported in this browser");
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
    if (!supported) return;
    window.speechSynthesis.cancel();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/TTSWidget.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TTSWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$tts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/tts.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function TTSWidget() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(41);
    if ($[0] !== "09be481e5d1cb23909b346de4966520cb1c51903a64a398a3bbaea1efc004f1b") {
        for(let $i = 0; $i < 41; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "09be481e5d1cb23909b346de4966520cb1c51903a64a398a3bbaea1efc004f1b";
    }
    const [text, setText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Hello! This is the homepage TTS widget.");
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = [];
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const [voices, setVoices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t0);
    const [voiceIndex, setVoiceIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [rate, setRate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    let t1;
    let t2;
    if ($[2] !== voiceIndex) {
        t1 = ({
            "TTSWidget[useEffect()]": ()=>{
                if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$tts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supported"]) {
                    return;
                }
                const off = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$tts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onVoicesChanged"])({
                    "TTSWidget[useEffect() > onVoicesChanged()]": (v)=>{
                        setVoices(v);
                        if (v.length && voiceIndex >= v.length) {
                            setVoiceIndex(0);
                        }
                    }
                }["TTSWidget[useEffect() > onVoicesChanged()]"]);
                return ()=>off();
            }
        })["TTSWidget[useEffect()]"];
        t2 = [
            voiceIndex
        ];
        $[2] = voiceIndex;
        $[3] = t1;
        $[4] = t2;
    } else {
        t1 = $[3];
        t2 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$tts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supported"]) {
        let t3;
        if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
            t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-md bg-white/80 p-4 shadow",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Your browser does not support speech synthesis."
                }, void 0, false, {
                    fileName: "[project]/src/app/components/TTSWidget.js",
                    lineNumber: 56,
                    columnNumber: 63
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/components/TTSWidget.js",
                lineNumber: 56,
                columnNumber: 12
            }, this);
            $[5] = t3;
        } else {
            t3 = $[5];
        }
        return t3;
    }
    const selectedVoice = voices[voiceIndex] || null;
    let t3;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-lg font-semibold mb-2",
            children: "Text to Speech"
        }, void 0, false, {
            fileName: "[project]/src/app/components/TTSWidget.js",
            lineNumber: 66,
            columnNumber: 10
        }, this);
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = ({
            "TTSWidget[<textarea>.onChange]": (e)=>setText(e.target.value)
        })["TTSWidget[<textarea>.onChange]"];
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    let t5;
    if ($[8] !== text) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
            className: "w-full p-2 border rounded mb-3 text-black",
            rows: 3,
            value: text,
            onChange: t4
        }, void 0, false, {
            fileName: "[project]/src/app/components/TTSWidget.js",
            lineNumber: 82,
            columnNumber: 10
        }, this);
        $[8] = text;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    let t6;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm mb-1",
            children: "Voice"
        }, void 0, false, {
            fileName: "[project]/src/app/components/TTSWidget.js",
            lineNumber: 90,
            columnNumber: 10
        }, this);
        $[10] = t6;
    } else {
        t6 = $[10];
    }
    let t7;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = ({
            "TTSWidget[<select>.onChange]": (e_0)=>setVoiceIndex(parseInt(e_0.target.value, 10))
        })["TTSWidget[<select>.onChange]"];
        $[11] = t7;
    } else {
        t7 = $[11];
    }
    let t8;
    if ($[12] !== voices) {
        t8 = voices.map(_TTSWidgetVoicesMap);
        $[12] = voices;
        $[13] = t8;
    } else {
        t8 = $[13];
    }
    let t9;
    if ($[14] !== t8 || $[15] !== voiceIndex) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t6,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    className: "w-full p-2 border rounded text-black",
                    value: voiceIndex,
                    onChange: t7,
                    children: t8
                }, void 0, false, {
                    fileName: "[project]/src/app/components/TTSWidget.js",
                    lineNumber: 114,
                    columnNumber: 19
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/TTSWidget.js",
            lineNumber: 114,
            columnNumber: 10
        }, this);
        $[14] = t8;
        $[15] = voiceIndex;
        $[16] = t9;
    } else {
        t9 = $[16];
    }
    let t10;
    if ($[17] !== rate) {
        t10 = rate.toFixed(1);
        $[17] = rate;
        $[18] = t10;
    } else {
        t10 = $[18];
    }
    let t11;
    if ($[19] !== t10) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm mb-1",
            children: [
                "Rate: ",
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/TTSWidget.js",
            lineNumber: 131,
            columnNumber: 11
        }, this);
        $[19] = t10;
        $[20] = t11;
    } else {
        t11 = $[20];
    }
    let t12;
    if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = ({
            "TTSWidget[<input>.onChange]": (e_1)=>setRate(parseFloat(e_1.target.value))
        })["TTSWidget[<input>.onChange]"];
        $[21] = t12;
    } else {
        t12 = $[21];
    }
    let t13;
    if ($[22] !== rate) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            className: "w-full",
            type: "range",
            min: 0.5,
            max: 2,
            step: 0.1,
            value: rate,
            onChange: t12
        }, void 0, false, {
            fileName: "[project]/src/app/components/TTSWidget.js",
            lineNumber: 148,
            columnNumber: 11
        }, this);
        $[22] = rate;
        $[23] = t13;
    } else {
        t13 = $[23];
    }
    let t14;
    if ($[24] !== t11 || $[25] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t11,
                t13
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/TTSWidget.js",
            lineNumber: 156,
            columnNumber: 11
        }, this);
        $[24] = t11;
        $[25] = t13;
        $[26] = t14;
    } else {
        t14 = $[26];
    }
    let t15;
    if ($[27] !== t14 || $[28] !== t9) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 gap-3 mb-3",
            children: [
                t9,
                t14
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/TTSWidget.js",
            lineNumber: 165,
            columnNumber: 11
        }, this);
        $[27] = t14;
        $[28] = t9;
        $[29] = t15;
    } else {
        t15 = $[29];
    }
    let t16;
    if ($[30] !== rate || $[31] !== selectedVoice || $[32] !== text) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            className: "px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700",
            onClick: {
                "TTSWidget[<button>.onClick]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$tts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["speak"])({
                        text,
                        voice: selectedVoice,
                        rate
                    })
            }["TTSWidget[<button>.onClick]"],
            children: "Speak"
        }, void 0, false, {
            fileName: "[project]/src/app/components/TTSWidget.js",
            lineNumber: 174,
            columnNumber: 11
        }, this);
        $[30] = rate;
        $[31] = selectedVoice;
        $[32] = text;
        $[33] = t16;
    } else {
        t16 = $[33];
    }
    let t17;
    if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            className: "px-3 py-2 rounded bg-gray-200 text-black hover:bg-gray-300",
            onClick: _TTSWidgetButtonOnClick,
            children: "Stop"
        }, void 0, false, {
            fileName: "[project]/src/app/components/TTSWidget.js",
            lineNumber: 190,
            columnNumber: 11
        }, this);
        $[34] = t17;
    } else {
        t17 = $[34];
    }
    let t18;
    if ($[35] !== t16) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-2",
            children: [
                t16,
                t17
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/TTSWidget.js",
            lineNumber: 197,
            columnNumber: 11
        }, this);
        $[35] = t16;
        $[36] = t18;
    } else {
        t18 = $[36];
    }
    let t19;
    if ($[37] !== t15 || $[38] !== t18 || $[39] !== t5) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-lg bg-white/80 p-4 shadow",
            children: [
                t3,
                t5,
                t15,
                t18
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/TTSWidget.js",
            lineNumber: 205,
            columnNumber: 11
        }, this);
        $[37] = t15;
        $[38] = t18;
        $[39] = t5;
        $[40] = t19;
    } else {
        t19 = $[40];
    }
    return t19;
}
_s(TTSWidget, "nv63J/se7zC2Z5NjJkYE3o1Y/7I=");
_c = TTSWidget;
function _TTSWidgetButtonOnClick() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$tts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cancel"])();
}
function _TTSWidgetVoicesMap(v_0, i) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
        value: i,
        children: [
            v_0.name,
            " ",
            v_0.lang ? `(${v_0.lang})` : ""
        ]
    }, v_0.voiceURI || i, true, {
        fileName: "[project]/src/app/components/TTSWidget.js",
        lineNumber: 219,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "TTSWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/Homepage.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Homepage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$TTSWidget$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/TTSWidget.js [app-client] (ecmascript)");
"use client";
;
;
;
;
function Homepage() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "bcec601324634adaa38ebc557975a436359495e3e36b8d3aa8f4ab04a0ca9949") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "bcec601324634adaa38ebc557975a436359495e3e36b8d3aa8f4ab04a0ca9949";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute inset-0 z-10 flex items-start justify-center p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$TTSWidget$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/components/Homepage.js",
                lineNumber: 16,
                columnNumber: 85
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/components/Homepage.js",
            lineNumber: 16,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    return t0;
}
_c = Homepage;
var _c;
__turbopack_context__.k.register(_c, "Homepage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/GraduateDuckButton.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GraduateDuckButtton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
'use client';
;
;
;
function GraduateDuckButtton() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "076a763baffdc966762d6ca4fccfec6691f0930545cbc816c9cafaa43bbe4bce") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "076a763baffdc966762d6ca4fccfec6691f0930545cbc816c9cafaa43bbe4bce";
    }
    const handleButtonClick = _GraduateDuckButttonHandleButtonClick;
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative z-10",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleButtonClick,
                className: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: "/graduate_duck2.png",
                    alt: "Graduate Duck",
                    width: 300,
                    height: 300,
                    priority: true
                }, void 0, false, {
                    fileName: "[project]/src/app/components/GraduateDuckButton.js",
                    lineNumber: 16,
                    columnNumber: 192
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/components/GraduateDuckButton.js",
                lineNumber: 16,
                columnNumber: 41
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/components/GraduateDuckButton.js",
            lineNumber: 16,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    return t0;
}
_c = GraduateDuckButtton;
function _GraduateDuckButttonHandleButtonClick() {
    console.log("Button clicked");
    alert("Quack!");
}
var _c;
__turbopack_context__.k.register(_c, "GraduateDuckButtton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_47b74d00._.js.map