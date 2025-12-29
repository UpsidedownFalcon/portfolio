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
├── public/                      # static media assets  
│   ├── images/
│   ├── videos/
│   └── Curriculum Vitae_BhavyM.pdf
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

```


## 1) Rendering + Routing

- `index.html` contains the `<div id="root"></div>` mount point.
- `src/main.tsx` bootstraps React and mounts `<App />`.
- `src/App.tsx` defines the top-level layout and routing.
- `src/pages/Index.tsx` is the main page composition (Hero → About → Skills → Portfolio → Contact → Footer).
- `src/pages/NotFound.tsx` handles unknown routes.

---

## 2) Sections

Each section is a standalone component under `src/components/`: 

- `ConstellationBackground.tsx` - interactive constellation background 
- `Navbar.tsx` - navigation bar at the top of the page 
- `NavLink.tsx` - nicer `<NavLink />` component
- `HeroSection.tsx` - landing hero + CTA button + “scroll” chevrons  
- `AboutSection.tsx` - image + bio + skills grid  
- `HonoursAwardsSection.tsx` - patents + publications + media + awards 
- `PortfolioSection.tsx` - some projects 
- `ContactSection.tsx` - contact CTA buttons   
- `Footer.tsx` — footer 

---

## 3) UI System (`src/components/ui`)

This folder contains the **shadcn/ui** primitives that power styling + accessibility.

---

## 4) Animation

Using **Framer Motion** for:

- entrance animations on scroll (`whileInView`)
- staggered card reveals
- subtle looping effects (e.g., scroll chevrons, background effects)

## 5) Styling 

- Using **Tailwind** configured in `tailwind.config.ts` 
- Global styles in `src/index.css` 
