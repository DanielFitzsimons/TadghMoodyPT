import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Minimal server-side validation (keep it simple)
    const required = ["name", "email", "goal", "daysPerWeek", "experience"];
    for (const key of required) {
      if (!body?.[key]) {
        return NextResponse.json({ error: `Missing ${key}` }, { status: 400 });
      }
    }

    await addDoc(collection(db, "leads"), {
      ...body,
      createdAt: serverTimestamp(),
      source: "website-apply",
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
