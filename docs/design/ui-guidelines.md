# UI Guidelines

This document defines how Nexo looks and behaves. Every screen and component should follow it. When a new pattern is needed, add it here first.

## 1. Principles

1. **Every number has context.** Never show a bare value. Pair it with a target, a comparison or a trend: "5 of 8 tasks done · yesterday 6", not "5".
2. **Proactive, not passive.** Nexo should surface what matters today without being asked: an event in two hours, a task overdue, a trip tomorrow.
3. **Mobile first.** Primary use is an iPhone (installed as a PWA). Design for a 390 px wide screen, then scale up to tablet and desktop.
4. **Glanceable.** The "Today" screen must answer "what do I need to know right now?" in under five seconds.
5. **Calm.** Few colours used with intent, generous spacing, subtle motion. No visual noise.

## 2. Visual system

### Theme
- Dark theme by default; light theme supported. Theme follows the system setting and can be toggled.
- Implement colours as design tokens (CSS variables via the shadcn/ui theme), never as hard-coded values in components.

### Colour by domain
Each life area has one accent colour, used consistently for its cards, icons and charts:

| Domain | Accent (suggested) |
|---|---|
| Agenda | Blue |
| Tasks | Amber |
| Mail | Violet |
| Weather | Neutral / slate |
| Habits | Green |
| Money (later) | Teal |
| Plans & goals (later) | Rose |

Accents are muted and warm on dark backgrounds; avoid saturated neon colours. Status colours (success, warning, danger) are separate from domain accents.

**Intensity by theme:** in dark theme, a `MetricCard` carries its domain colour as the card's own background — a muted solid fill with light text on top, no neutral card around it. In light theme the card stays neutral/white, and the domain colour shows as a left accent bar plus a tinted icon and value — restrained, not filled. The card itself is the colour block; don't nest it inside another neutral card.

### Shape and spacing
- Cards with large rounded corners (`rounded-2xl`), soft borders or subtle elevation, no heavy shadows.
- Consistent spacing scale (Tailwind defaults). Cards breathe: ample internal padding.

### Typography hierarchy
- **Metric value:** large and bold — the first thing the eye sees.
- **Label:** small, uppercase or medium weight, above the value.
- **Context line:** small, muted, below the value (comparison, target, date).
- Greeting and section titles are the only other large text on screen.

## 3. Core components

### MetricCard
Label, value and a context line. Optional: progress towards a target, trend arrow, domain accent. See "Intensity by theme" above for how the domain accent behaves per theme.
> Example: `TASKS TODAY` · **5 / 8** · "Yesterday 6 · 2 overdue"

### ContextCard
A highlighted card that appears only when relevant, generated from data (calendar, tasks, weather). Contains a title, a short explanation and an optional checklist.
> Example: "Exam on Friday · 2 days left" with a preparation checklist.

### TaskList
Compact rows with checkbox, title, due-date chip (Today, Overdue, date) and domain tag. Inline "Add task" at the end. Completing a task gives immediate visual feedback.

### WeatherCard
Current temperature and condition, today's high/low and rain probability, compact three-day forecast.

### Skeleton states
Every component that loads data shows a skeleton with the same layout while loading. The deployed backend may take time to wake up, so loading states are a first-class part of the design, not an afterthought.

### Empty and error states
Every list and card has a friendly empty state ("No events today") and a clear error state with a retry action.

## 4. Navigation and layout

- **Mobile:** bottom tab bar with the main sections (Today, Agenda, Tasks, Mail, More). Large touch targets (minimum 44 × 44 px). Respect iPhone safe areas.
- **Desktop:** sidebar navigation; content in a responsive grid of cards.
- One primary action per screen (e.g. "Add task"), easy to reach with the thumb on mobile.

## 5. The "Today" screen

Top to bottom:
1. **Greeting** based on the time of day, with the date.
2. **ContextCards** — only when something relevant exists (upcoming event, overdue tasks, special day).
3. **Weather** card.
4. **Pulse** — a row/grid of MetricCards (tasks done, next event, unread important mail, habit streak).
5. **Today's focus** — the TaskList filtered to today and overdue items, with inline add.
6. **Agenda preview** — the next events of the day.
7. **Mail preview** — important unread messages.

## 6. Motion

- Subtle and purposeful: fade/slide on page transitions, animated count-up for metric values, smooth checkbox completion, animated theme toggle.
- Durations between 150 and 300 ms; no bouncing or long animations.
- Respect `prefers-reduced-motion`: disable non-essential animation when the user requests it.

## 7. Accessibility

- Text contrast meets WCAG AA in both themes.
- Colour is never the only carrier of meaning (pair it with text or icons).
- All interactive elements are keyboard accessible and have visible focus states.

## 8. Future patterns

- **Proactive ContextCards from the calendar:** trips (destination weather, packing checklist), exams and deadlines (countdown, preparation tasks). Start with simple deterministic rules; later, generated by Nexo's own agent.
- **Weekly review ("Plans"):** progress ring for the week, completed vs planned tasks, habits summary, goals split into personal and professional.
- **Weekly charts:** habits, tasks completed and, later, Vinted sales and finances.
