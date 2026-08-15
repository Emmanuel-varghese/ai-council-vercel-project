import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-3.7-flash";

const responseSchema = {
  type: "object",
  properties: {
    forArgument: {
      type: "string"
    },
    againstArgument: {
      type: "string"
    },
    uncertainties: {
      type: "string"
    },
    stakeholderImpacts: {
      type: "string"
    },
    agreement: {
      type: "string"
    },
    disagreement: {
      type: "string"
    },
    implications: {
      type: "string"
    },
    recommendation: {
      type: "string"
    },
    reasoning: {
      type: "string"
    },
    conditions: {
      type: "string"
    }
  },
  required: [
    "forArgument",
    "againstArgument",
    "uncertainties",
    "stakeholderImpacts",
    "agreement",
    "disagreement",
    "implications",
    "recommendation",
    "reasoning",
    "conditions"
  ]
};

function buildPrompt(question) {
  return `
You are the Chairperson of an AI Council.

The user has submitted this question or policy:

"${question}"

Your job is to simulate a small council of specialized AI agents.

AGENT 1 — ADVOCATE
Goal: Build the strongest reasonable argument IN FAVOR of the proposal.

AGENT 2 — CRITIC
Goal: Build the strongest reasonable argument AGAINST the proposal.

AGENT 3 — ANALYST
Goal: Identify assumptions, uncertainty, trade-offs, risks, and possible consequences.

AGENT 4 — STAKEHOLDER
Goal: Consider how different groups of people could be affected by the decision.

After considering these independent perspectives, act as the CHAIRPERSON.

The Chairperson must:
- Identify areas where the perspectives agree.
- Identify areas where they disagree.
- Identify important uncertainties.
- Explain the major implications.
- Make a balanced recommendation.
- Explain why that recommendation was made.
- State the conditions under which the recommendation might change.

IMPORTANT:
- Do not simply choose the majority opinion.
- Consider both benefits and disadvantages.
- Be balanced and practical.
- Do not invent statistics, studies, laws, or citations.
- If information is uncertain, clearly say so.
- The recommendation can be conditional.
- Keep responses concise and easy to understand.
- This is an educational decision-analysis tool.

Return ONLY valid JSON matching the requested structure.
`;
}

export async function POST(request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is missing. Make sure it is set in your .env.local file."
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const question =
      typeof body.question === "string"
        ? body.question.trim()
        : "";

    if (!question) {
      return NextResponse.json(
        {
          error: "Please enter a question."
        },
        { status: 400 }
      );
    }

    if (question.length > 1000) {
      return NextResponse.json(
        {
          error: "Please keep the question under 1000 characters."
        },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: buildPrompt(question),
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema
      }
    });

    const text = response.text;

    if (!text) {
      return NextResponse.json(
        {
          error: "Gemini returned an empty response. Please try again."
        },
        { status: 502 }
      );
    }

    let report;

    try {
      report = JSON.parse(text);
    } catch (parseError) {
      console.error("Could not parse Gemini response:", text);

      return NextResponse.json(
        {
          error:
            "The AI returned an invalid response. Please try the question again."
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      question,
      ...report
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Something went wrong while convening the council."
      },
      { status: 500 }
    );
  }
}