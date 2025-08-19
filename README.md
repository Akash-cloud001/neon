# Neon

Neon is a modern, extensible UI prototyping project built with Next.js, React, TypeScript, Tailwind CSS, and Radix UI. It features a modular sidebar system, custom theming, and a scalable component architecture inspired by shadcn/ui.

## Tech Stack
- **Framework:** Next.js 15.4.7
- **UI Library:** React 19, Radix UI, shadcn/ui
- **Styling:** Tailwind CSS 4, custom CSS variables, PostCSS
- **Language:** TypeScript
- **Icons:** lucide-react

## Features
- **Modular Sidebar System:**
  - Highly configurable, supports expanded/collapsed states, keyboard shortcuts, and mobile sheet mode.
  - Group and menu structures for organizing navigation or actions.
  - Theming support (light/dark) via CSS variables and Tailwind.
- **Responsive Design:**
  - Mobile detection via custom hooks (`useIsMobile`).
  - Sidebar adapts to mobile/desktop layouts.
- **Component Organization:**
  - Uses aliases for clean imports (see `components.json`).
  - UI primitives in `src/components/ui/`, app-specific components in `src/components/`.
- **Utilities:**
  - `cn` utility for class merging (Tailwind + clsx).

## Project Structure
```
/ (root)
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with sidebar
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Tailwind & custom CSS variables
│   ├── components/
│   │   ├── app-sidebar.tsx # Sidebar composition
│   │   └── ui/             # Sidebar primitives & UI components
│   ├── hooks/
│   │   └── use-mobile.ts   # Mobile detection hook
│   └── lib/
│       └── utils.ts        # Utility functions (e.g., cn)
├── components.json         # shadcn/ui config & aliases
├── package.json            # Dependencies & scripts
└── ...
```

## Usage
1. **Install dependencies:**
   ```bash
   npm install
   # or yarn, pnpm, bun
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

3. **Edit pages/components:**
   - Main entry: `src/app/page.tsx`
   - Sidebar: `src/components/app-sidebar.tsx` and `src/components/ui/sidebar.tsx`

## Theming & Customization
- Edit `src/app/globals.css` for color variables and Tailwind layers.
- Sidebar and UI primitives are designed for easy extension and theming.

## Conventions
- Follows shadcn/ui and Radix UI best practices for accessibility and composability.
- Uses TypeScript for type safety and maintainability.

## License
MIT (or specify your license here)
