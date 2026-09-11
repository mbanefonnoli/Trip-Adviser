export interface SearchResult {
  title: string;
  url: string;
  content: string;
}

export async function searchWeb(query: string, apiKey: string, maxResults = 5): Promise<SearchResult[]> {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      search_depth: "basic",
      max_results: maxResults,
    }),
  });

  if (!res.ok) {
    throw new Error(`Tavily search failed: ${res.status}`);
  }

  const data = await res.json();
  const results = Array.isArray(data.results) ? data.results : [];
  return results.map((r: { title?: string; url?: string; content?: string }) => ({
    title: r.title ?? "",
    url: r.url ?? "",
    content: (r.content ?? "").slice(0, 400),
  }));
}

function formatResults(label: string, results: SearchResult[]): string {
  if (results.length === 0) return "";
  const lines = results.map((r) => `- ${r.title}: ${r.content} (${r.url})`);
  return `${label}:\n${lines.join("\n")}`;
}

export async function buildSearchContext(params: {
  destination: string;
  budgetPerDay: number;
  currency: string;
  groupType: string;
  vibe: string;
  pace: string;
  interests: string[];
  avoid?: string;
  apiKey: string;
}): Promise<string | null> {
  const { destination, budgetPerDay, currency, groupType, vibe, pace, interests, avoid, apiKey } = params;

  const staysQuery = `best places to stay in ${destination} for a ${groupType.toLowerCase()}, ${vibe.toLowerCase()} style, around ${budgetPerDay} ${currency} per day total budget`;
  const activitiesQuery = `things to do and where to eat in ${destination}${
    interests.length > 0 ? ` for ${interests.join(", ")}` : ""
  }, ${pace.toLowerCase()} pace${avoid ? `, avoiding ${avoid}` : ""}`;

  const [staysResult, activitiesResult] = await Promise.allSettled([
    searchWeb(staysQuery, apiKey),
    searchWeb(activitiesQuery, apiKey),
  ]);

  const sections: string[] = [];
  if (staysResult.status === "fulfilled") {
    const formatted = formatResults("STAYS & ACCOMMODATION (current web search)", staysResult.value);
    if (formatted) sections.push(formatted);
  }
  if (activitiesResult.status === "fulfilled") {
    const formatted = formatResults("ACTIVITIES & DINING (current web search)", activitiesResult.value);
    if (formatted) sections.push(formatted);
  }

  return sections.length > 0 ? sections.join("\n\n") : null;
}
