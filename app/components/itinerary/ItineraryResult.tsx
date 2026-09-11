"use client";

import { useState } from "react";
import { Check, Copy, Printer, RotateCcw } from "lucide-react";
import type { ItineraryResponse } from "@/lib/types";
import { resolveCurrencySymbol } from "@/lib/types";
import { DayCard } from "./DayCard";
import { BookingChecklist } from "./BookingChecklist";

interface ItineraryResultProps {
  itinerary: ItineraryResponse;
  onStartOver: () => void;
}

function formatAsText(itinerary: ItineraryResponse): string {
  const symbol = resolveCurrencySymbol(itinerary.currency);
  const lines: string[] = [];
  lines.push(`${itinerary.destination} — ${itinerary.days}-Day Itinerary`);
  lines.push(`Budget target: ${symbol}${itinerary.budgetPerDay}/day\n`);
  for (const day of itinerary.dayPlans) {
    lines.push(`Day ${day.dayNumber} — ${day.theme}`);
    lines.push(`Stay: ${day.stay}`);
    lines.push(`Morning: ${day.morning}`);
    lines.push(`Afternoon: ${day.afternoon}`);
    lines.push(`Evening: ${day.evening}${day.eveningBookInAdvance ? " (book in advance)" : ""}`);
    lines.push(`Eat: ${day.eat}`);
    lines.push(`Getting around: ${day.transitNotes}`);
    lines.push(`Est. daily cost: ${symbol}${day.estimatedCost} (${day.budgetStatus})\n`);
  }
  if (itinerary.bookingChecklist.length > 0) {
    lines.push("Before You Go:");
    for (const item of itinerary.bookingChecklist) {
      lines.push(`- ${item.label} (Day ${item.dayNumber}${item.timeSlot ? `, ${item.timeSlot}` : ""})`);
    }
    lines.push("");
  }
  lines.push(`Curator note: ${itinerary.curatorNote}`);
  return lines.join("\n");
}

export function ItineraryResult({ itinerary, onStartOver }: ItineraryResultProps) {
  const [copied, setCopied] = useState(false);
  const symbol = resolveCurrencySymbol(itinerary.currency);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatAsText(itinerary));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail silently in some browser contexts; nothing to recover here.
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between mb-1 no-print">
        <span className="font-mono text-[11px] text-ink-muted">BESPOKE CLIENT EDITION</span>
        <span className="font-mono text-[11px] text-ink-muted">
          Ref: #TD-{itinerary.days}D-{itinerary.destination.slice(0, 3).toUpperCase()}
        </span>
      </div>
      <h1 className="font-serif text-3xl mb-2">
        {itinerary.destination} — {itinerary.days}-Day Field Guide
      </h1>
      <p className="text-sm text-ink-muted mb-5">
        {itinerary.nights} night{itinerary.nights === 1 ? "" : "s"} • Target {symbol}
        {itinerary.budgetPerDay}/day
      </p>

      <div className="flex items-center gap-2 mb-8 no-print">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-sm border border-border rounded-lg px-3 py-2 hover:bg-container transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-sage-ink" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy Draft"}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 text-sm bg-brand hover:bg-brand-hover text-white rounded-lg px-3 py-2 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Export Guide
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="flex items-center gap-1.5 text-sm border border-border rounded-lg px-3 py-2 hover:bg-container transition-colors ml-auto"
        >
          <RotateCcw className="w-4 h-4" />
          New Draft
        </button>
      </div>

      {itinerary.dayPlans.map((day) => (
        <DayCard key={day.dayNumber} day={day} currency={itinerary.currency} budgetPerDay={itinerary.budgetPerDay} />
      ))}

      <BookingChecklist items={itinerary.bookingChecklist} />

      <div className="border border-border rounded-xl bg-amber-bg p-5">
        <p className="text-[11px] font-mono text-amber-ink uppercase tracking-wide mb-1">Curator Field Note</p>
        <p className="text-sm text-ink">{itinerary.curatorNote}</p>
      </div>

      <p className="text-xs text-ink-muted mt-6 text-center">
        Draft only — verify prices, opening hours, and availability before booking anything for a client.
      </p>
    </div>
  );
}
