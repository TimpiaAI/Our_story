# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Povestea Noastră" (Our Story) is a romantic pixel-art themed interactive web application built as a personal gift. It presents a game-like experience with multiple levels that progress through a couple's story.

## Commands

```bash
npm run dev      # Start development server on port 3000
npm run build    # Build for production
npm run preview  # Preview production build
```

## Architecture

**Game Flow State Machine**: The app uses a single `GameLevel` enum to manage progression through levels:
1. HERO → MEETING → TIMELINE → MEMORY → QUIZ → BOSS → LETTER

**Component Structure**:
- `App.tsx` - Main state machine controller, renders current level component
- Each level is a self-contained component in `components/` that receives an `onComplete` callback
- `constants.ts` - All game content (quiz questions, timeline events, memory cards, battle moves)
- `types.ts` - TypeScript enums and interfaces

**Styling**:
- Tailwind CSS loaded via CDN in `index.html`
- Custom pixel theme colors: `pixel-red`, `pixel-pink`, `pixel-gold`, `parchment`
- Pixel font: "Press Start 2P" via `font-pixel` class
- Handwriting font: "Great Vibes" via `font-handwriting` class

**External Dependencies**:
- `canvas-confetti` loaded via CDN for celebration effects (accessed via `window.confetti`)
- `lucide-react` for icons

## Key Patterns

- All content customization happens in `constants.ts` (partner name, dates, quiz questions, timeline events)
- Components use `PixelCard` wrapper for consistent retro styling
- Path alias `@/*` maps to project root
