# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Solmate is a social impact platform using AI and Web3/blockchain to address two problems: vacant house revitalization (빈집 재생) and AI emotional companionship for isolated individuals (독거인 감성 케어). The repo root contains docs and configuration; all app code lives in `web/`.

## Commands

루트에서 Turborepo로 실행 (권장):

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # ESLint check
npm run start    # Start production server
```

또는 `web/` 디렉터리에서 직접 실행 가능:

```bash
cd web && npm run dev
```

## Architecture

### Directory Structure

```
solmate/
├── package.json                   # Turborepo 루트 (workspaces: ["web"])
├── turbo.json                     # Turborepo 태스크 설정
├── docs/                          # Project documentation
│   ├── 01_Concept_Design/         # Vision, lean canvas, product specs
│   └── 03_Technical_Specs/        # Development principles
├── web/                           # Next.js app (App Router)
│   └── src/
│       ├── app/                   # Next.js App Router pages
│       ├── components/
│       │   ├── ui/                # shadcn/ui base components
│       │   └── features/          # Page-level feature sections
│       └── lib/                   # Utilities (utils.ts, mockData.ts)
```

### Tech Stack

- **Next.js 16** with App Router, React 19
- **Tailwind CSS v4** + shadcn/ui components
- **Zustand** for client-side state
- **Framer Motion** for animations
- **Package manager**: npm

### Planned Features (MVP)

1. Landing page (`/`) — Hero, Mission/Tech, Projects Showcase, Team/Contact
2. AI Companion Chatbot (`/chat`) — OpenAI API integration with empathetic persona
3. Empty House Projects Showcase — Card UI with funding progress
4. Web3 Transparency Tracking — blockchain money flow visualization

## Coding Standards

From `docs/03_Technical_Specs/00_DEVELOPMENT_PRINCIPLES.md`:

- **Server Components by default** — only add `'use client'` when hooks, event listeners, or client-only state are needed
- **TypeScript strict mode** — no `any`; define explicit interfaces for Props and API responses
- **Tailwind utility classes** — no custom CSS classes; use shadcn/ui for reusable interactive components
- **Mock data** goes in `lib/mockData.ts` to isolate UI from backend during development
- **Validation**: Zod for schema/type validation; Luxon for date/time
- **`NEXT_PUBLIC_` prefix**: only for env vars that must be exposed to the browser; keep secrets server-side

## Commit Convention

Format: `type(scope): subject` — description in Korean, minimum 3 lines explaining reason and impact.

Example: `feat(ui): 랜딩페이지 Hero 섹션 퍼블리싱`
