# AI Council

A small multi-perspective AI decision-making application for the bonus assignment.

## What it demonstrates

- Role-based prompting
- Multiple specialized AI perspectives
- A final synthesis/decision agent
- Structured AI output
- Interactive UI
- Deployment on Vercel

## Agents

1. Advocate — strongest case in favor
2. Critic — strongest case against
3. Analyst — uncertainty, assumptions and consequences
4. Stakeholder — affected groups and impacts
5. Chairperson — synthesizes the perspectives and makes a recommendation

## Run locally

1. Install Node.js.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Copy `.env.local.example` to `.env.local`.
5. Put your OpenAI API key in `.env.local`.
6. Run `npm run dev`.
7. Open http://localhost:3000.

## Deploy to Vercel

Push this project to GitHub and import the repository into Vercel.

In Vercel Project Settings → Environment Variables, add:

`OPENAI_API_KEY`

Then redeploy.

Do not put your API key in frontend code or commit `.env.local`.
