# Trip Draft

An internal tool for drafting client travel itineraries fast. Fill in a
destination, budget, and travel style; get back a structured day-by-day
draft you review and adjust before it goes to a client. Nothing is saved
on a server — each visit starts fresh.

## What you need before you start

1. **Node.js** installed on your computer (18 or newer).
2. **A DeepSeek API key** — this is what actually writes the itinerary.
   - Go to https://platform.deepseek.com and sign up.
   - Go to "API Keys" and create a new key. Copy it somewhere safe — you
     won't be able to see it again after you close that page.
   - Cost: DeepSeek is pay-as-you-go and very cheap for this — typically a
     small fraction of a cent to a few cents per generated itinerary.
3. **A Tavily API key** (optional but recommended) — this lets the app do a
   real web search for current hotels, restaurants, and activities before
   writing the itinerary, instead of relying only on the AI's trained
   knowledge (which has a cutoff date and can be out of date).
   - Go to https://tavily.com and sign up.
   - Copy your API key from the dashboard (starts with `tvly-`).
   - Free tier covers roughly 1,000 searches/month (2 searches per generated
     itinerary), which is plenty for an internal tool.
   - If you skip this, the app still works exactly as before — it just
     won't have live search results to draw on.
4. **A GitHub account** (free) — to hold the code so Vercel can deploy it.
5. **A Vercel account** (free) — this is what actually hosts the website.

## Running it on your own computer first

1. Open a terminal in this folder.
2. Copy the example environment file and fill in your key:
   ```
   cp .env.local.example .env.local
   ```
   Then open `.env.local` and replace `sk-...` with your real DeepSeek key,
   and `tvly-...` with your real Tavily key (or leave that line out if you
   skipped Tavily).
3. Install everything the app needs:
   ```
   npm install
   ```
4. Start it:
   ```
   npm run dev
   ```
5. Open http://localhost:3000 in your browser. Fill in a trip and click
   "Generate Draft Itinerary."

If something goes wrong, the app shows a plain-language error banner
instead of crashing — read that message first.

## Putting it online with Vercel

The easiest path is connecting Vercel directly to GitHub, so every time
you save a change and push it, the live site updates itself automatically.

1. **Push this project to GitHub:**
   ```
   git init
   git add .
   git commit -m "Initial version of Trip Draft"
   ```
   Then create a new empty repository on https://github.com/new, and follow
   the "push an existing repository" instructions it shows you.
2. **Import it into Vercel:**
   - Go to https://vercel.com and sign in (you can sign in with your GitHub
     account).
   - Click "Add New Project," pick the repository you just pushed.
   - Vercel will detect it's a Next.js app automatically — you don't need
     to change any build settings.
3. **Add your API keys to Vercel** (this is the step people forget):
   - Before or right after the first deploy, go to your project's
     Settings → Environment Variables.
   - Add `DEEPSEEK_API_KEY` with your real key as the value, applied to
     both Production and Preview.
   - Add `TAVILY_API_KEY` the same way, if you're using live search.
   - If you added them after the first deploy, trigger a new deploy
     (Deployments tab → "Redeploy") so the site picks them up.
4. Open the live URL Vercel gives you and test it end to end.

## If something breaks on the live site

Go to your Vercel project → Deployments → click the deployment → Functions
tab. That's where the real error messages show up (the website itself only
ever shows a friendly, vague message on purpose, so a client or colleague
never sees a raw error).

Common causes:
- **"Server isn't configured correctly"** — the `DEEPSEEK_API_KEY`
  environment variable is missing or wrong in Vercel's settings.
- **"Too many requests"** — you've hit DeepSeek's rate limit; wait a
  minute and try again.
- **A trip taking a very long time or failing on a long itinerary** — very
  long trips (close to the 21-day cap) take longer to generate; this is
  expected, just wait for it.

## What this tool intentionally does NOT do (v1)

- No accounts, no login — anyone with the URL can use it, so don't share
  the link publicly unless that changes.
- No saved history — refreshing the page loses the current draft. Copy or
  export anything you want to keep.
- No real-time flight/hotel prices — even with live search enabled, costs
  shown are realistic estimates based on search snippets, not live bookable
  prices. Always verify before booking anything for a client.
- Live search (Tavily) only grounds the AI's suggestions in current, real
  place names — it doesn't fetch exact rates or check availability.
