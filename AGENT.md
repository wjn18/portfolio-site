# Project: Personal Website Auto-Update System

## Overview
This project is a personal website hosted on Cloudflare.

The website content is derived from a single source:
- `resume.pdf` located at: `portfolio-site/public/resume.pdf`

The system is **resume-driven**:
> Any update to `resume.pdf` MUST propagate to website content, GitHub, and deployment.

---

## Design System Authority (CRITICAL)

All UI and styling MUST strictly follow:
- `DESIGN.md` :contentReference[oaicite:0]{index=0}

### Rules:
- DESIGN.md is the **single source of truth for UI/UX**
- DO NOT invent new styles, colors, spacing, or typography
- ALWAYS reuse tokens:
  - colors
  - typography
  - spacing
  - components
- Maintain Airbnb-style design language:
  - clean white canvas
  - minimal accent usage (primary color only when necessary)
  - soft rounded UI (no hard edges)
  - typography is NOT heavy; rely on spacing & layout

### Forbidden:
- ❌ No random Tailwind values (e.g. `p-13`, `text-[17px]`)
- ❌ No new colors outside DESIGN.md
- ❌ No changing layout density arbitrarily
- ❌ No adding shadows beyond defined elevation system

---

## Core Workflow

### Source of Truth
- `resume.pdf` is the ONLY source of resume content

---

### Update Pipeline (MANDATORY)

Whenever `resume.pdf` changes, the agent MUST:

1. Parse and extract structured content from `resume.pdf`
2. Transform into structured format:
   - JSON / Markdown / component props
3. Update website content:
   - About page
   - Resume page
   - Project sections (if applicable)

4. Apply DESIGN.md styling rules:
   - typography tokens
   - spacing system
   - component patterns

5. Replace hosted resume file
6. Commit changes
7. Push to GitHub
8. Trigger Cloudflare deployment

---

## File Responsibilities

- `/public/resume.pdf`
  - Source of truth

- `/assets/` or `/data/`
  - Parsed structured content

- `/pages/`
  - UI rendering

- `/components/`
  - MUST follow DESIGN.md component definitions

---

## Agent Behavior Rules

### DO
- Always treat resume as latest truth
- Keep content and UI synchronized
- Follow DESIGN.md strictly
- Keep changes minimal and scoped
- Use structured data when possible

---

### DO NOT
- Do NOT hallucinate resume content
- Do NOT redesign UI
- Do NOT break existing layout
- Do NOT introduce new design systems
- Do NOT modify deployment config unless necessary

---

## Content Transformation Rules

When converting resume → website:

### Structure:
- Education
- Experience
- Projects
- Skills

### Style:
- Concise
- Professional
- Slight improvement allowed for clarity

### IMPORTANT:
Agent MAY:
- Improve wording for clarity and professionalism

Agent MUST NOT:
- Change factual meaning
- Add unverified information

---

## UI Consistency Rules (VERY IMPORTANT)

When updating UI:

- Use existing components whenever possible
- If new UI is required:
  - Compose from existing DESIGN.md tokens
  - Do NOT invent new component styles

### Example:
Instead of: