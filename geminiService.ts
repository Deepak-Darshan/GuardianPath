
import { GoogleGenAI, Type } from "@google/genai";
import { ChildProfile, Alert, TimeRequest } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartInsights = async (child: ChildProfile, alerts: Alert[]) => {
  try {
    const prompt = `
      Analyze activity for ${child.name} (Age: ${child.age}).
      - Screen Time: ${Math.round(child.totalScreenTimeMinutes / 60)}h ${child.totalScreenTimeMinutes % 60}m
      - Current Health Score: ${child.healthScore}/100
      - Alerts: ${alerts.map(a => a.message).join(', ')}
      Format as JSON: { "summary": string, "concerns": string[], "recommendations": string[] }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    return { summary: "Offline", concerns: [], recommendations: [] };
  }
};

export const simulateParentDecision = async (child: ChildProfile, request: TimeRequest) => {
  try {
    const prompt = `
      You are a wise, caring parent. Your child ${child.name} (Age: ${child.age}) is asking for ${request.requestedMinutes} more minutes on ${request.appName || 'the tablet'}.
      Reason: "${request.reason}"
      Current today usage: ${child.totalScreenTimeMinutes} mins.
      
      Make a decision (approve or deny). Be encouraging. If they have a good reason (like finishing homework or calling a friend), maybe approve. If they've already used too much time, maybe deny but suggest a non-screen activity.
      
      Format as JSON: { "decision": "approved" | "denied", "message": string }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    return { decision: "denied", message: "Parent is currently busy. Try again later!" };
  }
};
