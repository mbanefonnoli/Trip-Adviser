"use client";

import { MapPin, Minus, Plus, Sparkles, UserCircle2 } from "lucide-react";
import {
  CURRENCIES,
  GROUP_OPTIONS,
  INTEREST_OPTIONS,
  PACE_OPTIONS,
  VIBE_OPTIONS,
  type Interest,
  type TripFormData,
} from "@/lib/types";

interface IntakeFormProps {
  formData: TripFormData;
  onChange: (data: TripFormData) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

function SectionBadge({ children }: { children: string }) {
  return (
    <span className="font-mono text-[11px] tracking-wider text-brand bg-amber-bg px-2 py-1 rounded-full">
      {children}
    </span>
  );
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  disabled,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex rounded-lg border border-border overflow-hidden">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          onClick={() => onChange(option)}
          className={`flex-1 px-3 py-2 text-sm transition-colors ${
            value === option
              ? "bg-ink text-white"
              : "bg-container-alt text-ink-muted hover:bg-container"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function IntakeForm({ formData, onChange, onSubmit, disabled }: IntakeFormProps) {
  const update = <K extends keyof TripFormData>(key: K, value: TripFormData[K]) =>
    onChange({ ...formData, [key]: value });

  const toggleInterest = (interest: Interest) => {
    const has = formData.interests.includes(interest);
    update(
      "interests",
      has ? formData.interests.filter((i) => i !== interest) : [...formData.interests, interest]
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-brand flex items-center justify-center text-white font-serif text-sm">
            T
          </div>
          <span className="font-serif text-lg tracking-tight">TRIP DRAFT</span>
          <span className="w-px h-4 bg-border" />
          <span className="font-mono text-[11px] text-ink-muted">ADVISER STUDIO / SYS.01</span>
        </div>
        <UserCircle2 className="w-7 h-7 text-ink-muted" />
      </header>

      <div className="flex items-center gap-3 text-[11px] font-mono text-ink-muted mb-2">
        <span>FORM-ID #2025-TD</span>
        <span>•</span>
        <span>EST. CRAFT ~45s</span>
      </div>
      <h1 className="font-serif text-3xl mb-2">New Trip Draft</h1>
      <p className="text-ink-muted mb-8">
        Configure precision travel parameters to synthesize a client itinerary.
      </p>

      <div className="space-y-8">
        <section className="bg-container-alt border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg">Destination &amp; Timeline</h2>
            <SectionBadge>LOC.COORDINATE</SectionBadge>
          </div>
          <label className="block text-sm text-ink-muted mb-1">
            Primary destination <span className="text-brand">REQUIRED</span>
          </label>
          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 mb-4">
            <MapPin className="w-4 h-4 text-ink-muted shrink-0" />
            <input
              type="text"
              required
              disabled={disabled}
              value={formData.destination}
              onChange={(e) => update("destination", e.target.value)}
              placeholder="e.g. Lisbon, Portugal"
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
          <label className="block text-sm text-ink-muted mb-1">Number of days</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={disabled || formData.days <= 1}
              onClick={() => update("days", Math.max(1, formData.days - 1))}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center disabled:opacity-40"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono text-sm min-w-[10rem] text-center">
              VAL: {formData.days} DAYS SCHEDULED
            </span>
            <button
              type="button"
              disabled={disabled || formData.days >= 21}
              onClick={() => update("days", Math.min(21, formData.days + 1))}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </section>

        <section className="bg-container-alt border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg">Budget Allocation</h2>
            <SectionBadge>FIN.TARGET</SectionBadge>
          </div>
          <label className="block text-sm text-ink-muted mb-1">Budget per day (including accommodation)</label>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              disabled={disabled}
              value={formData.budgetPerDay}
              onChange={(e) => update("budgetPerDay", Number(e.target.value))}
              className="flex-1 border border-border rounded-lg px-3 py-2 text-sm outline-none"
            />
            <select
              disabled={disabled}
              value={formData.currency}
              onChange={(e) => update("currency", e.target.value as TripFormData["currency"])}
              className="border border-border rounded-lg px-3 py-2 text-sm outline-none bg-container-alt"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          {formData.currency === "Other" && (
            <input
              type="text"
              disabled={disabled}
              value={formData.customCurrency ?? ""}
              onChange={(e) => update("customCurrency", e.target.value)}
              placeholder="Currency code, e.g. CHF"
              className="mt-2 w-full border border-border rounded-lg px-3 py-2 text-sm outline-none"
            />
          )}
        </section>

        <section className="bg-container-alt border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg">Travel Style &amp; Mood</h2>
            <SectionBadge>PARAM.SYNTH</SectionBadge>
          </div>

          <label className="block text-sm text-ink-muted mb-1">Pace</label>
          <div className="mb-4">
            <SegmentedControl
              options={PACE_OPTIONS}
              value={formData.pace}
              onChange={(v) => update("pace", v)}
              disabled={disabled}
            />
          </div>

          <label className="block text-sm text-ink-muted mb-1">Vibe</label>
          <div className="mb-4">
            <SegmentedControl
              options={VIBE_OPTIONS}
              value={formData.vibe}
              onChange={(v) => update("vibe", v)}
              disabled={disabled}
            />
          </div>

          <label className="block text-sm text-ink-muted mb-2">Key interests</label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => {
              const selected = formData.interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selected
                      ? "bg-sage-bg border-sage-ink text-sage-ink"
                      : "border-border text-ink-muted hover:bg-container"
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </section>

        <section className="bg-container-alt border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg">Client Context &amp; Notes</h2>
            <SectionBadge>DISCRETIONARY</SectionBadge>
          </div>

          <label className="block text-sm text-ink-muted mb-1">Who&apos;s traveling</label>
          <select
            disabled={disabled}
            value={formData.groupType}
            onChange={(e) => update("groupType", e.target.value as TripFormData["groupType"])}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none bg-container-alt mb-4"
          >
            {GROUP_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <label className="block text-sm text-ink-muted mb-1">Advisory notes</label>
          <input
            type="text"
            disabled={disabled}
            value={formData.notes ?? ""}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="10th anniversary trip, prefers boutique hotels..."
            className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none mb-4"
          />

          <label className="block text-sm text-ink-muted mb-1">Things to avoid</label>
          <textarea
            disabled={disabled}
            value={formData.avoid ?? ""}
            onChange={(e) => update("avoid", e.target.value)}
            placeholder="crowds, tourist traps, expensive restaurants, long transport times..."
            rows={3}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none resize-none"
          />
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur border-t border-border p-4 no-print">
        <div className="max-w-2xl mx-auto">
          <button
            type="button"
            disabled={disabled || !formData.destination.trim()}
            onClick={onSubmit}
            className="w-full bg-brand hover:bg-brand-hover disabled:opacity-50 text-white rounded-lg py-3 flex items-center justify-center gap-2 font-medium transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Generate Draft Itinerary
          </button>
          <p className="text-center text-[11px] font-mono text-ink-muted mt-2">
            CURATED VIA TRIP DRAFT SYNTHESIS ENGINE
          </p>
        </div>
      </div>
    </div>
  );
}
