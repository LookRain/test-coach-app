# Momentum — Your Procrastination Coach

An empathetic AI chatbot that helps you overcome procrastination, manage ADHD challenges, and break through task paralysis. One small step at a time.

## Features

- **Empathetic AI Coaching** — Momentum acts as a warm, non-judgmental coach that understands executive dysfunction is real
- **Micro-Step Breakdown** — When you're stuck, Momentum breaks tasks into the smallest possible steps to help you get started
- **Todo Management** — The AI can create and manage todos for you during the conversation
- **Done List** — Completed tasks are celebrated and tracked so you can see your wins
- **Single Actionable Advice** — No overwhelming lists of options — just one clear next step

## Tech Stack

- [Next.js](https://nextjs.org/) — React framework
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) — Styling and components
- [Vercel AI SDK](https://sdk.vercel.ai/) — AI streaming and tool calling
- [OpenAI](https://openai.com/) — GPT-4o-mini for the AI coach

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.local.example` to `.env.local` and add your OpenAI API key:

```bash
cp .env.local.example .env.local
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
| --- | --- |
| `OPENAI_API_KEY` | Your OpenAI API key |
