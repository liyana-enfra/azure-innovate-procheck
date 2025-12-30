
import { GoogleGenAI } from "@google/genai";
import { Tenant } from "../types";

export const getHealthSummary = async (tenant: Tenant): Promise<string> => {
  // Check if API key is configured in the environment
  if (!process.env.API_KEY) return "Operational Intelligence: Summary offline. Please configure the ProCheck API Bridge for AI-driven insights.";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: You are an Azure Managed Services Architect.
      System: Azure Innovate ProCheck v4 Multi-Tenant Dashboard.
      Task: Provide a high-density health diagnostic for ${tenant.name}.
      Current Status: ${tenant.status}.
      Infrastructure: ${tenant.location}, Subscription ID ${tenant.subscriptionId}.

      If Status is NOT Healthy, respond ONLY with:
      - A 1-sentence executive summary of the primary risk.
      - A bulleted list of 2-3 specific technical remediation actions based on Azure best practices (e.g., "Check MFA policies", "Analyze Log Analytics Workspace for CMP-101 errors", "Scale VM SKU").

      If Status IS Healthy, respond ONLY with:
      - A 1-sentence confirmation of stability and a proactive maintenance tip.

      Keep response under 80 words. No narrative filler.`,
    });

    return response.text || "Diagnostic engine failed to provide a text response.";
  } catch (error) {
    console.error("ProCheck AI Error:", error);
    return "The AI Diagnostic Bridge experienced a timeout. Falling back to rule-based summary.";
  }
};
