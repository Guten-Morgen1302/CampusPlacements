import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json();
  const type = String(body?.type ?? "").trim();
  const role = String(body?.role ?? "").trim();
  const level = String(body?.level ?? "").trim();
  const userId = String(
    body?.userId ?? body?.userid ?? body?.user_id ?? ""
  ).trim();
  const amount = Number(body?.amount ?? 0);

  const techstackRaw = body?.techstack ?? "";
  const techstack = Array.isArray(techstackRaw)
    ? techstackRaw.map((tech) => String(tech).trim()).filter(Boolean)
    : String(techstackRaw)
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean);

  if (!type || !role || !level || !userId || techstack.length === 0) {
    return Response.json(
      { success: false, error: "Missing required interview details." },
      { status: 400 }
    );
  }

  const questionCount = Number.isFinite(amount) && amount > 0 ? amount : 5;

  try {
    const { object } = await generateObject({
      model: groq("llama-3.1-8b-instant"),
      schema: z.object({
        questions: z.array(z.string().min(1)).min(1),
      }),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack.join(", ")}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${questionCount}.
        Please return only the questions in JSON.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this: {"questions": ["Question 1", "Question 2", "Question 3"]}
        
        Thank you! <3
    `,
    });

    const questions = object.questions
      .map((question) => question.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .slice(0, questionCount);

    if (!questions.length) {
      return Response.json(
        { success: false, error: "No interview questions generated." },
        { status: 500 }
      );
    }

    const interview = {
      role,
      type,
      level,
      techstack,
      questions,
      userId,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    const interviewRef = await db.collection("interviews").add(interview);

    return Response.json(
      { success: true, interviewId: interviewRef.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { success: false, error: "Interview generation failed." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
