"use client";

import { useState } from "react";
import { IntakeForm } from "@/app/components/intake/IntakeForm";
import { GeneratingScreen } from "@/app/components/generating/GeneratingScreen";
import { ItineraryResult } from "@/app/components/itinerary/ItineraryResult";
import { mockItinerary } from "@/lib/mockItinerary";
import type { ItineraryResponse, TripFormData } from "@/lib/types";

type Step = "intake" | "generating" | "result";

const DEFAULT_FORM_DATA: TripFormData = {
  destination: "",
  days: 5,
  budgetPerDay: 200,
  currency: "USD",
  pace: "Balanced",
  vibe: "Mix",
  interests: [],
  groupType: "Couple",
  notes: "",
  avoid: "",
};

export default function Home() {
  const [step, setStep] = useState<Step>("intake");
  const [formData, setFormData] = useState<TripFormData>(DEFAULT_FORM_DATA);
  const [result, setResult] = useState<ItineraryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setStep("generating");
    try {
      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong — try again.");
        setStep("intake");
        return;
      }
      setResult(data as ItineraryResponse);
      setStep("result");
    } catch {
      setError("Couldn't reach the server — check your connection and try again.");
      setStep("intake");
    }
  };

  const handleStartOver = () => {
    setResult(null);
    setError(null);
    setStep("intake");
  };

  return (
    <main className="min-h-screen bg-surface px-4">
      {error && (
        <div className="max-w-2xl mx-auto pt-4 no-print">
          <div className="bg-amber-bg text-amber-ink text-sm rounded-lg px-4 py-3">{error}</div>
        </div>
      )}
      {step === "intake" && (
        <div className="pb-28">
          <IntakeForm formData={formData} onChange={setFormData} onSubmit={handleSubmit} />
          {process.env.NODE_ENV === "development" && (
            <div className="max-w-2xl mx-auto pt-4 text-center no-print">
              <button
                type="button"
                onClick={() => {
                  setResult(mockItinerary);
                  setStep("result");
                }}
                className="text-xs font-mono text-ink-muted underline"
              >
                Dev only: preview with sample itinerary
              </button>
            </div>
          )}
        </div>
      )}
      {step === "generating" && <GeneratingScreen formData={formData} />}
      {step === "result" && result && (
        <ItineraryResult itinerary={result} onStartOver={handleStartOver} />
      )}
    </main>
  );
}
