/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Sparkles, Rocket, Timer, Settings2, Loader2, Plus } from "lucide-react";
import type {
  AgentRequest,
  AudienceSegment,
  CampaignBlueprint,
  ContentChannel,
  PersonaTone
} from "@/lib/types";
import { cn } from "@/lib/utils";

const toneOptions: { key: PersonaTone; label: string; description: string }[] = [
  { key: "visionary", label: "Visionary", description: "Futurist, expansive, inspiring." },
  { key: "playful", label: "Playful", description: "Light, pop-culture fluent, kinetic." },
  { key: "mentor", label: "Mentor", description: "Guiding, empathetic, steady." },
  { key: "analyst", label: "Analyst", description: "Proof-driven, precise, data-led." },
  { key: "rebel", label: "Rebel", description: "Provocative, disruptive, uncompromising." }
];

const channelOptions: { key: ContentChannel; label: string; subtitle: string }[] = [
  { key: "instagram", label: "Instagram", subtitle: "Carousel + Reels" },
  { key: "tiktok", label: "TikTok", subtitle: "Shortform energy" },
  { key: "linkedin", label: "LinkedIn", subtitle: "Thought leadership" },
  { key: "x", label: "X / Twitter", subtitle: "High velocity threads" },
  { key: "youtube", label: "YouTube", subtitle: "Flagship narratives" },
  { key: "blog", label: "Blog", subtitle: "Longform playbooks" }
];

interface FormState {
  persona: {
    brandName: string;
    brandPromise: string;
    differentiator: string;
    voice: PersonaTone[];
  };
  objective: {
    goal: string;
    keyMessage: string;
    callToAction: string;
    successMetric: string;
    priorityChannels: ContentChannel[];
  };
  audience: AudienceSegment[];
  cadence: number;
  includeCalendar: boolean;
}

const starterAudience: AudienceSegment = {
  name: "Growth Operators",
  description: "Marketing leaders running automation-first teams.",
  painPoints: [
    "Inconsistent content velocity across channels.",
    "AI tools feel disconnected from human brand voice."
  ],
  desires: [
    "Unified AI + human workflows with visibility.",
    "Momentum loops that compound audience growth."
  ]
};

const baseState: FormState = {
  persona: {
    brandName: "Nebula Syndicate",
    brandPromise: "The AI-native partner that crafts digital twins for unstoppable content engines.",
    differentiator: "Deep automation orchestration interlaced with on-demand human-guided storycraft.",
    voice: ["visionary", "analyst"]
  },
  objective: {
    goal: "Launch an AI digital twin concierge for social management suites",
    keyMessage: "The twin co-creates content, calibrates voice, and optimizes every channel in real-time",
    callToAction: "Book a twin activation sprint",
    successMetric: "30% lift in engagement velocity",
    priorityChannels: ["linkedin", "tiktok", "x"]
  },
  audience: [starterAudience],
  cadence: 5,
  includeCalendar: true
};

export default function Page() {
  const [form, setForm] = useState<FormState>(baseState);
  const [blueprint, setBlueprint] = useState<CampaignBlueprint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const payload: AgentRequest = {
        persona: form.persona,
        objective: form.objective,
        audience: form.audience,
        cadence: form.cadence,
        includeCalendar: form.includeCalendar
      };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to generate blueprint");
      }

      const data = await res.json();
      setBlueprint(data.blueprint as CampaignBlueprint);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const diagnostics = useMemo(() => {
    if (!blueprint) return [];
    return [
      {
        label: "Channels orchestrated",
        value: blueprint.content.length,
        descriptor: blueprint.content.map((item) => item.channel.toUpperCase()).join(" • ")
      },
      {
        label: "Narrative beats",
        value: blueprint.narrativeArc.length,
        descriptor: "Arc length"
      },
      {
        label: "Cadence",
        value: form.cadence,
        descriptor: blueprint.calendar?.sprint ?? "Custom cadence"
      }
    ];
  }, [blueprint, form.cadence]);

  function updateVoice(tone: PersonaTone) {
    setForm((prev) => {
      const voice = prev.persona.voice.includes(tone)
        ? prev.persona.voice.filter((item) => item !== tone)
        : [...prev.persona.voice, tone];
      return { ...prev, persona: { ...prev.persona, voice } };
    });
  }

  function updateChannel(channel: ContentChannel) {
    setForm((prev) => {
      const channels = prev.objective.priorityChannels.includes(channel)
        ? prev.objective.priorityChannels.filter((item) => item !== channel)
        : [...prev.objective.priorityChannels, channel];
      return { ...prev, objective: { ...prev.objective, priorityChannels: channels } };
    });
  }

  function updateAudience(index: number, fragment: Partial<AudienceSegment>) {
    setForm((prev) => {
      const next = [...prev.audience];
      next[index] = { ...next[index], ...fragment };
      return { ...prev, audience: next };
    });
  }

  function addAudience() {
    setForm((prev) => ({
      ...prev,
      audience: [
        ...prev.audience,
        {
          name: "New Segment",
          description: "Describe who this twin speaks to.",
          painPoints: ["Define their tension."],
          desires: ["Define their aspiration."]
        }
      ]
    }));
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 pt-16 md:pt-24">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
            <Sparkles className="h-4 w-4" />
            Nebula Agent Studio
          </div>
          <h1 className="font-display text-4xl leading-tight text-white md:text-6xl">
            Deploy AI twins that architect your omnichannel social content in real-time.
          </h1>
          <p className="max-w-2xl text-lg text-white/70 md:text-xl">
            Calibrate brand voice, convert audience data into intelligent prompts, and ship
            production-ready content systems for social management platforms – in one control room.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
              <Rocket className="h-4 w-4" />
              Digital Twin Launch Protocol
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
              <Timer className="h-4 w-4" />
              30s to blueprint
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
              <Settings2 className="h-4 w-4" />
              Live agent orchestration
            </span>
          </div>
        </div>
        <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur md:grid-cols-3 md:p-8">
          <div className="md:col-span-2">
            <div className="flex flex-col gap-6">
              <section>
                <h2 className="font-display text-lg text-white">Persona DNA</h2>
                <p className="text-sm text-white/50">
                  Position the twin as your voice double. Infuse differentiators and tone codes.
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Brand name"
                    value={form.persona.brandName}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        persona: { ...prev.persona, brandName: event.target.value }
                      }))
                    }
                  />
                  <Input
                    placeholder="Differentiator"
                    value={form.persona.differentiator}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        persona: { ...prev.persona, differentiator: event.target.value }
                      }))
                    }
                  />
                </div>
                <div className="mt-4">
                  <Textarea
                    placeholder="Brand promise"
                    value={form.persona.brandPromise}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        persona: { ...prev.persona, brandPromise: event.target.value }
                      }))
                    }
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {toneOptions.map((tone) => (
                    <button
                      key={tone.key}
                      type="button"
                      onClick={() => updateVoice(tone.key)}
                      className={cn(
                        "group w-full rounded-2xl border px-4 py-3 text-left text-sm transition md:w-auto",
                        form.persona.voice.includes(tone.key)
                          ? "border-primary-500 bg-primary-500/20 text-white shadow-brand"
                          : "border-white/10 bg-white/5 text-white/70 hover:border-primary-500/60 hover:text-white"
                      )}
                    >
                      <div className="font-medium">{tone.label}</div>
                      <div className="text-xs text-white/50">{tone.description}</div>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-display text-lg text-white">Campaign Objective</h2>
                <p className="text-sm text-white/50">
                  Define the mission, message, and proof points the agent must deliver.
                </p>
                <div className="mt-4 grid gap-4">
                  <Textarea
                    placeholder="Primary goal"
                    value={form.objective.goal}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        objective: { ...prev.objective, goal: event.target.value }
                      }))
                    }
                  />
                  <Textarea
                    placeholder="Key message"
                    value={form.objective.keyMessage}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        objective: { ...prev.objective, keyMessage: event.target.value }
                      }))
                    }
                  />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Call to action"
                    value={form.objective.callToAction}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        objective: { ...prev.objective, callToAction: event.target.value }
                      }))
                    }
                  />
                  <Input
                    placeholder="Success metric"
                    value={form.objective.successMetric}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        objective: { ...prev.objective, successMetric: event.target.value }
                      }))
                    }
                  />
                </div>
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Channels</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {channelOptions.map((channel) => (
                      <button
                        key={channel.key}
                        type="button"
                        onClick={() => updateChannel(channel.key)}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-left text-sm transition",
                          form.objective.priorityChannels.includes(channel.key)
                            ? "border-primary-500 bg-primary-500/20 text-white shadow-brand"
                            : "border-white/10 bg-white/5 text-white/70 hover:border-primary-500/60 hover:text-white"
                        )}
                      >
                        <div className="font-medium">{channel.label}</div>
                        <div className="text-xs text-white/50">{channel.subtitle}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-lg text-white">Audience Signals</h2>
                    <p className="text-sm text-white/50">
                      Feed the twin with segments, tensions, and desires to tailor narrative arcs.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={addAudience}
                  >
                    <Plus className="h-4 w-4" />
                    Add segment
                  </Button>
                </div>
                <div className="mt-4 flex flex-col gap-6">
                  {form.audience.map((segment, index) => (
                    <div
                      key={index}
                      className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-black/20"
                    >
                      <div className="grid gap-3 md:grid-cols-2">
                        <Input
                          placeholder="Segment name"
                          value={segment.name}
                          onChange={(event) =>
                            updateAudience(index, { name: event.target.value })
                          }
                        />
                        <Input
                          placeholder="Segment descriptor"
                          value={segment.description}
                          onChange={(event) =>
                            updateAudience(index, { description: event.target.value })
                          }
                        />
                      </div>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <Textarea
                          placeholder="Pain points (comma separated)"
                          value={segment.painPoints.join(", ")}
                          onChange={(event) =>
                            updateAudience(index, {
                              painPoints: event.target.value
                                .split(",")
                                .map((item) => item.trim())
                                .filter(Boolean)
                            })
                          }
                        />
                        <Textarea
                          placeholder="Desires (comma separated)"
                          value={segment.desires.join(", ")}
                          onChange={(event) =>
                            updateAudience(index, {
                              desires: event.target.value
                                .split(",")
                                .map((item) => item.trim())
                                .filter(Boolean)
                            })
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="flex flex-col gap-4 rounded-3xl border border-primary-500/40 bg-primary-500/10 p-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-white">Cadence Engine</h3>
                  <p className="text-sm text-white/60">
                    Set sprint length and timeline output. Twin orchestrates channel mix.
                  </p>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <label className="flex w-full flex-col gap-2 text-sm text-white/70 md:flex-row md:items-center md:gap-4">
                    Cadence (days)
                    <input
                      type="range"
                      min={1}
                      max={14}
                      value={form.cadence}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          cadence: Number(event.target.value)
                        }))
                      }
                      className="h-2 w-full cursor-pointer accent-primary-500"
                    />
                    <span className="flex h-10 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 font-mono text-lg text-white">
                      {form.cadence}
                    </span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-white/70">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border border-white/30 bg-transparent accent-primary-500"
                      checked={form.includeCalendar}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          includeCalendar: event.target.checked
                        }))
                      }
                    />
                    Generate delivery calendar
                  </label>
                </div>
              </section>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-white/60">
                  Deploy the agent to produce cross-channel scripts and narrative arcs instantly.
                </div>
                <Button
                  className="gap-2"
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating blueprint...
                    </>
                  ) : (
                    <>
                      Launch agent
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}
            </div>
          </div>
          <aside className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <div className="flex flex-col gap-3">
              <h3 className="font-display text-white">Agent Telemetry</h3>
              <p className="text-sm text-white/60">
                Blueprint metrics update once the twin delivers a campaign package.
              </p>
            </div>
            <div className="grid gap-4">
              {diagnostics.length === 0 && (
                <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/60">
                  Configure inputs and deploy the agent to view campaign telemetry.
                </div>
              )}
              {diagnostics.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4"
                >
                  <div className="text-xs uppercase tracking-[0.25em] text-white/40">
                    {item.label}
                  </div>
                  <div className="mt-2 font-display text-3xl text-white">{item.value}</div>
                  <div className="mt-1 text-sm text-white/60">{item.descriptor}</div>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <h4 className="font-medium text-white">Pipeline preview</h4>
              <p className="mt-1 text-sm text-white/60">
                Content is delivered with hooks, scripts, motion prompts, hashtag stacks, and
                cadence-ready drops engineered for social management suites.
              </p>
            </div>
          </aside>
        </div>
      </header>

      {blueprint && (
        <main className="mx-auto mt-16 flex max-w-6xl flex-col gap-10 px-6">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h2 className="font-display text-3xl text-white">Campaign Blueprint</h2>
                <p className="mt-2 max-w-xl text-sm text-white/60">{blueprint.summary}</p>
              </div>
              <div className="rounded-2xl border border-primary-500/50 bg-primary-500/10 px-4 py-3 text-sm text-primary-50">
                Twin status: <span className="font-semibold text-white">Active</span>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {blueprint.narrativeArc.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-white/70"
                >
                  <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-300">
                    Arc {index + 1}
                  </div>
                  <p className="mt-2 text-white">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-10">
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-2xl text-white">Channel Deployments</h3>
              <p className="text-sm text-white/60">
                Each drop includes hooks, a structured narrative body, hashtags, and asset prompts
                so creative teams or automated pipelines can execute immediately.
              </p>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {blueprint.content.map((item) => (
                <article
                  key={item.channel}
                  className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/70 p-5"
                >
                  <header className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">
                        {item.channel}
                      </div>
                      <h4 className="font-display text-xl text-white">{item.headline}</h4>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/60">
                      {item.format}
                    </span>
                  </header>
                  <div className="space-y-3 text-sm text-white/80">
                    <p>
                      <span className="font-semibold text-white">Hook:</span> {item.hook}
                    </p>
                    <pre className="whitespace-pre-wrap rounded-2xl border border-white/5 bg-white/5 p-3 font-mono text-xs leading-relaxed text-primary-100">
                      {item.body}
                    </pre>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-primary-500/40 bg-primary-500/10 px-3 py-1 text-xs text-primary-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                    <div className="text-xs uppercase tracking-[0.3em] text-white/40">
                      Asset prompts
                    </div>
                    <ul className="mt-2 space-y-2 text-sm text-white/70">
                      {item.assetPrompts.map((prompt, index) => (
                        <li key={index} className="leading-relaxed">
                          {prompt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {blueprint.calendar && (
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-10">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-display text-2xl text-white">Delivery Calendar</h3>
                  <p className="text-sm text-white/60">
                    Sprint timeline for digital twin deployment across channels and dayparts.
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/50">
                  {blueprint.calendar.sprint}
                </span>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {blueprint.calendar.entries.map((entry, index) => (
                  <div
                    key={`${entry.day}-${index}`}
                    className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg text-white">{entry.day}</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
                        {entry.slot}
                      </span>
                    </div>
                    <div className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-primary-300">
                      {entry.channel}
                    </div>
                    <p className="mt-2 text-sm text-white/70">{entry.focus}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      )}

      <footer className="mx-auto mt-20 max-w-6xl px-6 pb-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/50">
          Nebula Agent Studio is engineered for AI digital twins powering social management
          software. Connect agent payloads into scheduling suites, reporting dashboards, or
          real-time orchestration layers.
        </div>
      </footer>
    </div>
  );
}
