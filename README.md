# Maya — Voice Benefits Intake Agent

A voice-first benefits triage agent for social service agencies. Maya conducts warm, conversational intake to help residents find housing, food (SNAP), and childcare programs they may qualify for.

**[Live Demo →]()**

---

## What it does

Residents call or visit and speak naturally with Maya. Maya asks one question at a time, listens carefully, detects urgent needs, and after a short conversation summarizes which programs the resident likely qualifies for and what their next step should be.

Designed for the reality of social services: users are often stressed, may have limited literacy or tech comfort, and need a system that is patient, clear, and reliable.

## Design decisions

**Voice-first, not text-with-voice bolted on.** Responses are constrained to 1–3 spoken sentences with no markdown or lists. A system that says "asterisk asterisk housing asterisk asterisk" in a real call is a broken system.

**One question at a time.** Overwhelming someone already in crisis with a multi-part intake form — even a spoken one — increases dropout. Conversational pacing builds trust.

**Crisis detection is first-class.** The agent is explicitly instructed to detect acute crisis signals (no food today, eviction tonight, child unsafe) and immediately shift to emergency routing. This isn't a nice-to-have; it's a core safety requirement.

**Human handoff is always available.** Any production deployment of this agent should include a clear escalation path to a live staff member. The agent is not a replacement for human judgment in complex or crisis situations.

**Short conversation history.** After a natural conclusion (usually 4–6 exchanges), Maya summarizes and closes. This keeps costs predictable and avoids context drift.

## Stack

- **Next.js 14** — framework
- **ElevenLabs Conversational AI** — voice agent (STT + LLM + TTS pipeline)
- **Vercel** — deployment

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Requires microphone access. Works best in Chrome.

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or connect the GitHub repo to Vercel for automatic deploys on push.

## Extending this

The natural next step is an **evaluation harness** — a test suite that runs the agent through scripted scenarios (first-time caller, crisis caller, non-English speaker, caller who gives incomplete answers) and scores its responses against expected behavior. This is how you maintain quality as the agent's prompt or underlying model changes.

---

*Built as a demonstration of voice AI product thinking for social service contexts. Not a real agency. Not legal or benefits advice.*
