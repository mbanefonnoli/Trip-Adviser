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
3. **A GitHub account** (free) — to hold the code so Vercel can deploy it.
4. **A Vercel account** (free) — this is what actually hosts the website.

## Running it on your own computer first

1. Open a terminal in this folder.
2. Copy the example environment file and fill in your key:
   ```
   cp .env.local.example .env.local
   ```
   Then open `.env.local` and replace `sk-...` with your real DeepSeek key.
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
3. **Add your API key to Vercel** (this is the step people forget):
   - Before or right after the first deploy, go to your project's
     Settings → Environment Variables.
   - Add `DEEPSEEK_API_KEY` with your real key as the value, applied to
     both Production and Preview.
   - If you added it after the first deploy, trigger a new deploy
     (Deployments tab → "Redeploy") so it picks up the key.
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
- No real-time flight/hotel prices — costs shown are realistic estimates,
  not live bookable prices. Always verify before booking anything for a
  client.
