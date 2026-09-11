"use client";

import { useState } from "react";
import { CheckSquare, Square } from "lucide-react";
import type { BookingItem } from "@/lib/types";

interface BookingChecklistProps {
  items: BookingItem[];
}

export function BookingChecklist({ items }: BookingChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const markAllDone = () => setChecked(new Set(items.map((_, i) => i)));

  if (items.length === 0) return null;

  return (
    <section className="border border-border rounded-xl bg-container-alt overflow-hidden mb-6">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="font-serif text-lg">Before You Go</h2>
        <span className="font-mono text-[11px] text-ink-muted">
          {checked.size} of {items.length} items checked
        </span>
      </div>
      <ul>
        {items.map((item, i) => {
          const isChecked = checked.has(i);
          return (
            <li key={`${item.label}-${i}`}>
              <button
                type="button"
                onClick={() => toggle(i)}
                className="w-full flex items-start gap-3 px-5 py-3 border-b border-border last:border-b-0 text-left hover:bg-container transition-colors"
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-sage-ink mt-0.5 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-ink-muted mt-0.5 shrink-0" />
                )}
                <span className={`text-sm ${isChecked ? "line-through text-ink-muted" : ""}`}>
                  {item.label}
                  <span className="text-ink-muted"> — Day {item.dayNumber}{item.timeSlot ? `, ${item.timeSlot}` : ""}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="px-5 py-3 no-print">
        <button
          type="button"
          onClick={markAllDone}
          className="text-xs font-mono text-brand hover:text-brand-hover"
        >
          Mark all done
        </button>
      </div>
    </section>
  );
}
