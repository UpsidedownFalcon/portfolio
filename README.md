# Portfolio 

My component portfolio with **Vite**, **React**, **TypeScript**, **Tailwind CSS**, **shadcn/ui** and **Framer Motion**.  


---

## Tech Stack

- **Vite** — fast local dev + optimized production builds
- **React + TypeScript** — component-driven UI with type safety
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — prebuilt accessible UI primitives (buttons, cards, dialogs, etc.)
- **Framer Motion** — scroll + entrance animations
- **lucide-react** — icon set

---

## Project Structure

```txt
.
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/
│   ├── components/
│   │   ├── ui/                  # shadcn/ui primitives (buttons, cards, dialogs, etc.)
│   │   ├── AboutSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── ConstellationBackground.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Navbar.tsx
│   │   ├── NavLink.tsx
│   │   ├── PortfolioSection.tsx
│   │   └── SkillsSection.tsx
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx       # responsive helpers
│   │   └── use-toast.ts         # toast hook (shadcn/ui)
│   │
│   ├── lib/
│   │   └── utils.ts             # utility helpers (cn(), etc.)
│   │
│   ├── pages/
│   │   ├── Index.tsx            # main routed page
│   │   └── NotFound.tsx         # fallback page
│   │
│   ├── App.tsx                  # app shell (routes/layout)
│   ├── main.tsx                 # React entrypoint
│   ├── App.css
│   ├── index.css
│   └── vite-env.d.ts
│
├── index.html                   # Vite HTML template (meta tags, root div)
├── package.json
├── tailwind.config.ts
├── postcss.config.js
├── vite.config.ts
└── components.json              # shadcn/ui generator config
