export const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "Other"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const PACE_OPTIONS = ["Relaxed", "Balanced", "Packed"] as const;
export type Pace = (typeof PACE_OPTIONS)[number];

export const VIBE_OPTIONS = ["Local favorites", "Mix", "Popular sights"] as const;
export type Vibe = (typeof VIBE_OPTIONS)[number];

export const INTEREST_OPTIONS = [
  "Food",
  "Museums & Culture",
  "Nature & Outdoors",
  "Nightlife",
  "Shopping",
  "History",
] as const;
export type Interest = (typeof INTEREST_OPTIONS)[number];

export const GROUP_OPTIONS = ["Solo", "Couple", "Family", "Friends"] as const;
export type GroupType = (typeof GROUP_OPTIONS)[number];

export interface TripFormData {
  destination: string;
  days: number; // 1-21
  budgetPerDay: number;
  currency: Currency;
  customCurrency?: string;
  pace: Pace;
  vibe: Vibe;
  interests: Interest[];
  groupType: GroupType;
  notes?: string;
  avoid?: string;
}

export interface DayPlan {
  dayNumber: number;
  theme: string;
  stay: string;
  morning: string;
  afternoon: string;
  evening: string;
  eveningBookInAdvance: boolean;
  eat: string;
  transitNotes: string;
  estimatedCost: number;
  budgetStatus: "under" | "on-target" | "over";
}

export interface BookingItem {
  label: string;
  dayNumber: number;
  timeSlot?: string;
}

export interface ItineraryResponse {
  destination: string;
  days: number;
  nights: number;
  budgetPerDay: number;
  currency: string;
  dayPlans: DayPlan[];
  bookingChecklist: BookingItem[];
  curatorNote: string;
}

export function resolveCurrencySymbol(currency: string): string {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "CAD":
      return "CA$";
    case "AUD":
      return "AU$";
    case "JPY":
      return "¥";
    default:
      return currency;
  }
}
