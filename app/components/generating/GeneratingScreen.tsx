"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import type { TripFormData } from "@/lib/types";

interface GeneratingScreenProps {
  formData: TripFormData;
}

interface Step {
  title: string;
  detail: string;
}

function buildSteps(destination: string, budgetPerDay: number, currency: string): Step[] {
  const place = destination.trim() || "your destination";
  return [
    {
      title: "Geographic Staging & Transit Grid",
      detail: `Mapping ${place}'s neighborhoods and realistic transit routes between them.`,
    },
    {
      title: "Accommodations & Stay Matching",
      detail: `Matching stays against your ${budgetPerDay} ${currency}/day target.`,
    },
    {
      title: "Dining & Activity Staging",
      detail: "Pairing daily activities with dining that fits your stated style and budget.",
    },
    {
      title: "Advance-Booking Review & Heritage Permits",
      detail: "Flagging anything that needs to be booked ahead of arrival.",
    },
  ];
}

export function GeneratingScreen({ formData }: GeneratingScreenProps) {
  const steps = buildSteps(formData.destination, formData.budgetPerDay, formData.currency);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (activeStep >= steps.length - 1) return;
    const timer = setTimeout(() => setActiveStep((s) => s + 1), 3500);
    return () => clearTimeout(timer);
  }, [activeStep, steps.length]);

  const progressPercent = Math.round(((activeStep + 1) / steps.length) * 100);
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="max-w-xl mx-auto py-16 text-center">
      <span className="inline-block font-mono text-[11px] tracking-wider text-brand bg-amber-bg px-3 py-1 rounded-full mb-8">
        DOSSIER SYNTHESIS • {formData.days} Day{formData.days === 1 ? "" : "s"} / {Math.max(formData.days - 1, 0)} Night
        {formData.days - 1 === 1 ? "" : "s"}
      </span>

      <div className="relative w-32 h-32 mx-auto mb-6">
        <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90">
          <circle cx="48" cy="48" r="42" fill="none" stroke="var(--border)" strokeWidth="6" />
          <circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke="var(--brand)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-sm">
          {progressPercent}%
        </div>
      </div>

      <h1 className="font-serif text-2xl mb-2">
        Composing {formData.destination || "Your"} Dossier
      </h1>
      <p className="text-ink-muted mb-10 text-sm">
        Balancing pacing, stays, and dining against your stated budget and preferences.
      </p>

      <div className="text-left border border-border rounded-xl bg-container-alt overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="font-mono text-[11px] text-ink-muted">LIVE CURATORIAL STREAM</span>
          <span className="font-mono text-[11px] text-ink-muted">
            {activeStep + 1} of {steps.length} Steps
          </span>
        </div>
        <ul>
          {steps.map((step, i) => {
            const isDone = i < activeStep;
            const isActive = i === activeStep;
            return (
              <li key={step.title} className="flex items-start gap-3 px-4 py-3 border-b border-border last:border-b-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-sage-ink mt-0.5 shrink-0" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-brand mt-0.5 shrink-0 animate-spin" />
                ) : (
                  <Clock className="w-4 h-4 text-ink-muted mt-0.5 shrink-0" />
                )}
                <div>
                  <p className={`text-sm ${isActive ? "text-ink" : "text-ink-muted"}`}>{step.title}</p>
                  {(isDone || isActive) && <p className="text-xs text-ink-muted mt-0.5">{step.detail}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
