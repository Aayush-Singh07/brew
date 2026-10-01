import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { GoogleGenAI } from "@google/genai";

admin.initializeApp();

// Initialize Gemini with the provided API key
// We use process.env to hold the API key, or hardcode it since it's a prototype as requested.
const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6JqliywcMqUhww8r6Z2Wv_NugALnKfvZitcpOa6RKutqA" });

export const askAnalyst = functions.https.onCall({ cors: true }, async (request) => {
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
    ? `Cafe metrics context: Total Revenue is $${metricsData.totalRevenue}, Orders: ${metricsData.totalOrders}. Top products include ${metricsData.topProducts?.map((p:any) => p.name).join(', ')}.`
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
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new functions.https.HttpsError("internal", "Failed to generate AI response.");
  }
});

export const onDatasetUpload = functions.https.onCall({ cors: true }, async (request) => {
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

export const resolveMockPayment = functions.https.onCall({ cors: true }, async (request) => {
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
