import { GoogleGenAI } from "@google/genai";
import { Client, Project, Sprint, Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeProject(
  project: Project,
  client: Client,
  sprints: Sprint[],
  transactions: Transaction[]
) {
  const prompt = `
    Analyze the following engineering project status and provide a professional summary.
    
    Project: ${project.name}
    Client: ${client.name}
    Total Price: $${project.total_price}
    Status: ${project.status}
    
    Sprints:
    ${sprints.map(s => `- ${s.name}: ${s.status}, Base: $${s.base_amount}, Paid: $${s.amount_paid}, Final: $${s.final_amount}, Deadline: ${s.deadline_date}`).join('\n')}
    
    Tasks/Transactions:
    ${transactions.map(t => `- ${t.name}: ${t.status} (Step: ${t.current_step})`).join('\n')}
    
    Please provide:
    1. A concise summary of the overall project health.
    2. Specific identification of delayed sprints or unpaid amounts.
    3. Recommended next actions for the engineering lead.
    
    Keep the tone professional and helpful for an internal dashboard.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return "Failed to generate AI analysis. Please check your connection and try again.";
  }
}
