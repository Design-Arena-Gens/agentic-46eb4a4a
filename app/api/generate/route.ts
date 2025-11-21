import { NextResponse } from "next/server";
import { z } from "zod";
import { generateCampaignBlueprint } from "@/lib/generator";
import { ContentChannel, PersonaTone } from "@/lib/types";

const personaSchema = z.object({
  brandName: z.string().min(2),
  brandPromise: z.string().min(10),
  differentiator: z.string().min(5),
  voice: z.array(z.enum(["visionary", "playful", "mentor", "analyst", "rebel"] as const))
});

const campaignSchema = z.object({
  goal: z.string().min(5),
  keyMessage: z.string().min(5),
  callToAction: z.string().min(5),
  successMetric: z.string().min(3),
  priorityChannels: z.array(
    z.enum(["instagram", "tiktok", "linkedin", "x", "youtube", "blog"] as const)
  )
});

const audienceSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  painPoints: z.array(z.string().min(3)).min(1),
  desires: z.array(z.string().min(3)).min(1)
});

const requestSchema = z.object({
  persona: personaSchema,
  objective: campaignSchema,
  audience: z.array(audienceSchema).min(1).max(4),
  cadence: z.number().min(1).max(14),
  includeCalendar: z.boolean()
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsed = requestSchema.parse(data);

    parsed.persona.voice = parsed.persona.voice as PersonaTone[];
    parsed.objective.priorityChannels =
      parsed.objective.priorityChannels as ContentChannel[];

    const blueprint = generateCampaignBlueprint(parsed);

    return NextResponse.json({ blueprint });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          details: error.flatten()
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Unexpected error generating campaign"
      },
      { status: 500 }
    );
  }
}
