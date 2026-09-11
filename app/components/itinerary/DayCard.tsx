import { BedDouble, Bus, CalendarClock, Compass, Sun, Sunrise, Sunset, UtensilsCrossed } from "lucide-react";
import type { DayPlan } from "@/lib/types";
import { resolveCurrencySymbol } from "@/lib/types";

interface DayCardProps {
  day: DayPlan;
  currency: string;
  budgetPerDay: number;
}

const GRADIENTS = [
  "from-brand to-amber-ink",
  "from-sage-ink to-brand",
  "from-ink to-brand",
  "from-amber-ink to-sage-ink",
  "from-brand to-ink",
];

const STATUS_STYLES: Record<DayPlan["budgetStatus"], { bg: string; text: string; label: string }> = {
  under: { bg: "bg-sage-bg", text: "text-sage-ink", label: "Under budget" },
  "on-target": { bg: "bg-amber-bg", text: "text-amber-ink", label: "On target" },
  over: { bg: "bg-amber-bg", text: "text-amber-ink", label: "Over budget" },
};

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: string }) {
  return (
    <div className="flex gap-3 py-2.5 border-b border-border last:border-b-0">
      <div className="w-7 h-7 rounded-full bg-container flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-mono text-ink-muted uppercase tracking-wide">{label}</p>
        <p className="text-sm">{children}</p>
      </div>
    </div>
  );
}

export function DayCard({ day, currency, budgetPerDay }: DayCardProps) {
  const symbol = resolveCurrencySymbol(currency);
  const gradient = GRADIENTS[(day.dayNumber - 1) % GRADIENTS.length];
  const status = STATUS_STYLES[day.budgetStatus];

  return (
    <article className="border border-border rounded-xl overflow-hidden bg-container-alt mb-6 break-inside-avoid">
      <div className={`bg-gradient-to-br ${gradient} px-5 py-6 text-white relative`}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[11px] bg-white/20 px-2 py-1 rounded-full">
            Day {day.dayNumber} • {day.theme}
          </span>
          <span className="font-mono text-[11px] bg-white/20 px-2 py-1 rounded-full">
            Est. {symbol}
            {day.estimatedCost}
          </span>
        </div>
        <Compass className="w-6 h-6 opacity-80" />
        <h3 className="font-serif text-xl mt-2">Chapter {day.dayNumber}: {day.theme}</h3>
      </div>

      <div className="px-5">
        <Row icon={<BedDouble className="w-3.5 h-3.5 text-ink-muted" />} label="Stay">
          {day.stay}
        </Row>
        <Row icon={<Sunrise className="w-3.5 h-3.5 text-ink-muted" />} label="Morning">
          {day.morning}
        </Row>
        <Row icon={<Sun className="w-3.5 h-3.5 text-ink-muted" />} label="Afternoon">
          {day.afternoon}
        </Row>
        <Row icon={<Sunset className="w-3.5 h-3.5 text-ink-muted" />} label="Evening">
          {day.evening}
        </Row>
        <Row icon={<UtensilsCrossed className="w-3.5 h-3.5 text-ink-muted" />} label="Eat">
          {day.eat}
        </Row>
        <Row icon={<Bus className="w-3.5 h-3.5 text-ink-muted" />} label="Getting around">
          {day.transitNotes}
        </Row>
      </div>

      <div className="px-5 py-4 flex items-center justify-between gap-2 flex-wrap border-t border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}>
            {status.label}
          </span>
          {day.eveningBookInAdvance && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-bg text-amber-ink flex items-center gap-1">
              <CalendarClock className="w-3 h-3" />
              Book in advance
            </span>
          )}
        </div>
        <span className="text-xs font-mono text-ink-muted">
          Daily total: {symbol}
          {day.estimatedCost} (target {symbol}
          {budgetPerDay})
        </span>
      </div>
    </article>
  );
}
