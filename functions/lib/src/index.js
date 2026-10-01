"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMockPayment = exports.onDatasetUpload = exports.askAnalyst = void 0;
const functions = __importStar(require("firebase-functions/v2"));
const admin = __importStar(require("firebase-admin"));
const genai_1 = require("@google/genai");
admin.initializeApp();
// Initialize Gemini with the provided API key
// We use process.env to hold the API key, or hardcode it since it's a prototype as requested.
const ai = new genai_1.GoogleGenAI({ apiKey: "AQ.Ab8RN6JqliywcMqUhww8r6Z2Wv_NugALnKfvZitcpOa6RKutqA" });
exports.askAnalyst = functions.https.onCall({ cors: true }, async (request) => {
    var _a;
    if (!request.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    const { cafeId, message } = request.data;
    if (!cafeId || !message) {
        throw new functions.https.HttpsError("invalid-argument", "Missing cafeId or message");
    }
    // 1. Fetch some metrics from Firestore to provide context to Gemini
    const metricsDoc = await admin.firestore().collection("metrics").doc(cafeId).get();
    const metricsData = metricsDoc.data();
    const contextText = metricsData
        ? `Cafe metrics context: Total Revenue is $${metricsData.totalRevenue}, Orders: ${metricsData.totalOrders}. Top products include ${(_a = metricsData.topProducts) === null || _a === void 0 ? void 0 : _a.map((p) => p.name).join(', ')}.`
        : "No metrics available for this cafe yet.";
    // 2. Query Gemini
    try {
        const prompt = `You are Brewlytics AI Copilot, a data analyst assistant for cafe owners. 
Keep your answer short and professional. 
Context: ${contextText}
User question: ${message}`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        const aiText = response.text || "I'm sorry, I couldn't generate a response.";
        // 3. Write both user message and AI response to chats/{cafeId}/messages
        const messagesRef = admin.firestore().collection(`chats/${cafeId}/messages`);
        // User message
        await messagesRef.add({
            role: "user",
            content: message,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        // AI message
        await messagesRef.add({
            role: "assistant",
            content: aiText,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        return { response: aiText };
    }
    catch (error) {
        console.error("Gemini API error:", error);
        throw new functions.https.HttpsError("internal", "Failed to generate AI response.");
    }
});
exports.onDatasetUpload = functions.https.onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    const { cafeId, fileName } = request.data;
    if (!cafeId) {
        throw new functions.https.HttpsError("invalid-argument", "Missing cafeId");
    }
    // Mock processing a dataset
    // In a real app, this might be triggered by Storage onFinalize
    // We'll update the metrics document to reflect "new" data
    const metricsRef = admin.firestore().collection("metrics").doc(cafeId);
    await metricsRef.set({
        totalRevenue: 50000 + Math.floor(Math.random() * 10000),
        totalOrders: 6000 + Math.floor(Math.random() * 1000),
        averageOrderValue: 8.5,
        topProducts: [
            { name: "Vanilla Sweet Cream Cold Brew", revenue: 15000, units: 2000 },
            { name: "Avocado Toast", revenue: 12000, units: 1000 },
            { name: "Matcha Latte", revenue: 8000, units: 1200 },
        ],
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastDataset: fileName || "Unknown dataset"
    }, { merge: true });
    return { status: "success", message: "Dataset processed successfully." };
});
exports.resolveMockPayment = functions.https.onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    const { cafeId, requestedPlan } = request.data;
    // Set payment to approved
    await admin.firestore().collection("payments").doc(cafeId).set({
        status: "approved",
        requestedPlan,
        resolvedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    // Update user's plan
    await admin.firestore().collection("users").doc(request.auth.uid).update({
        plan: requestedPlan
    });
    return { status: "success" };
});
//# sourceMappingURL=index.js.map