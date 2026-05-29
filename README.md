# Maya — Voice Benefits Intake Agent

A voice-first benefits triage agent built as a demonstration for [CivicReach](https://civicreach.ai/), whose platform helps social service agencies answer every call, complete screenings, and route residents to the right programs.

**[Live Demo →](https://maya-agent-three.vercel.app/)**  
or call +1 866 250 3536 (Press 1 to bypass disclaimer)
Built by [Kay Langfitt](https://linkedin.com/in/kay-langfitt-4a8942202) as part of an application for the Founding Product Engineer role.

---

## What it does

Maya conducts a spoken intake conversation to help residents identify housing, food (SNAP), and childcare programs they may qualify for. It asks one question at a time, detects crisis signals, and closes with a clear summary of next steps.

The agent is intentionally narrow in scope — a deliberate product decision, not a technical limitation. A benefits intake agent that tries to do everything is an agent that does nothing reliably.

## Architecture

```
Browser mic → ElevenLabs STT → LLM (system prompt) → ElevenLabs TTS → Speaker
```

ElevenLabs Conversational AI handles the full real-time pipeline over WebSocket. The Next.js app is a thin wrapper: it manages UI state, renders the visualizer, and hands off to the ElevenLabs `useConversation` hook for all audio logic.

This architecture was chosen deliberately over a DIY pipeline (Whisper + GPT-4 + TTS) because:
- Latency is lower — no round-trip HTTP calls between STT, LLM, and TTS
- Voice quality is materially better, which matters when users are stressed
- It mirrors how a production system at CivicReach's scale would actually be built

## Design decisions

**Voice-first constraints on the system prompt.** Responses are limited to 1–3 spoken sentences with no markdown. A voice agent that outputs bullet points or bold text is a broken product, not a minor formatting issue. The prompt explicitly prohibits lists, headers, and structured output.

**One question at a time.** Users calling for benefits help are frequently in crisis, may have limited English proficiency, and are not in an optimal cognitive state for multi-part questions. Sequential pacing reduces dropout and builds rapport.

**Crisis detection is a first-class requirement, not a feature.** The agent is explicitly instructed to detect acute signals — no food today, eviction tonight, child in an unsafe situation — and immediately reprioritize toward emergency resources. This is a safety requirement that belongs in the system prompt, not an afterthought in the UI.

**Human handoff is architectural, not cosmetic.** Any production deployment needs a defined escalation path to a live staff member. The agent handles triage; humans handle judgment calls. This distinction matters especially in high-stakes, high-trust contexts like benefits and child welfare.

**Conversation length is bounded.** After 4–6 exchanges, Maya summarizes and closes. This keeps costs predictable, reduces context drift, and respects the user's time.

## Stack

- **Next.js 14** — framework
- **ElevenLabs Conversational AI** — real-time voice pipeline (STT + LLM + TTS)
- **Vercel** — deployment

## Local development

```bash
npm install
npm run dev
```

Requires microphone access. Works best in Chrome.

## Deploy

```bash
npm i -g vercel
vercel
```

Or connect this repo to Vercel for automatic deploys on push. No environment variables required — the Agent ID is public.

## What comes next: evaluation harness

The obvious gap in this prototype is that there's no systematic way to verify the agent behaves correctly. The next build is an evaluation harness: a test suite that runs the agent through scripted personas and scores responses against expected behavior.

Scenarios worth testing:
- First-time caller with no prior benefits experience
- Caller in acute crisis (eviction tonight)
- Caller who gives incomplete or contradictory answers
- Non-English-speaking caller
- Caller who asks questions outside the agent's scope

This is how you maintain quality as the system prompt evolves, the underlying model changes, or new edge cases emerge in production. It's also how you make the case to agency partners that the system is reliable.

---

*Prototype only. Not a real agency. Not legal or benefits advice.*
