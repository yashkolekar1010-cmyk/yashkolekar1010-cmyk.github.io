# Yash Kolekar — portfolio (source)

Source for **https://yashkolekar1010-cmyk.github.io**.

This branch (`source`) holds the Vite project. The `main` branch holds the
**built output**, because GitHub user sites serve files straight from the root of
`main`.

---

## Stack

| Library | Why it is here |
|---|---|
| **React 19 + TypeScript** | component model and type-checked content |
| **Vite 8** | dev server and production build |
| **Tailwind CSS 4** (`@tailwindcss/vite`) | layout and spacing utilities |
| **three.js + @react-three/fiber** | the hero's neural-network scene |
| **framer-motion** | scroll reveals, experience accordion, project modal |
| **lucide-react** | UI icons (brand marks are inlined — lucide v1 dropped them) |

No GSAP: Framer Motion's `useInView` covers every effect here, and three.js is
already the heavy dependency.

## Layout

```
src/
  data/profile.ts          <-- SINGLE SOURCE OF TRUTH. All copy lives here.
  three/NeuralScene.tsx        R3F scene, lazy-loaded
  components/
    Nav  Hero  About  Skills  Experience  Projects
    HowIWork  Education  Contact  ui  BrandIcons
  hooks/
    useTheme  useReducedMotion  useActiveSection
  index.css                    design tokens + base styles
```

### `src/data/profile.ts` is the important file

Every claim on the site comes from the résumé PDF and lives in that one module.
Components import from it and hard-code no copy, so "did we invent anything?" is
answered by reviewing a single file. Rules it encodes:

- **"2+ years"**, never "3+" — the first role started Feb 2024.
- **No invented metrics.** CGPA 9.02 is the only number on the site.
- **Skill tiers are load-bearing** — `(basic)` must stay visible on Flask,
  Node.js, MLflow and Kubernetes.
- **No certification carries a status tag** such as "(In Progress)".
- **`repo` is set only where the repository actually has code.** QuantScan PRO
  and AI-agent- are empty repos, so those cards show no GitHub button.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the built output
```

## Contact form

Posts to **Web3Forms** — real delivery, no backend of our own.

```bash
cp .env.example .env
# then set:
VITE_WEB3FORMS_KEY=your-access-key-from-web3forms.com
```

Get the key at [web3forms.com](https://web3forms.com): enter the destination
email, they send back an access key. The key is publishable by design — it only
permits submissions to the address that created it.

Without a key the form **says so** and points at the email button instead of
faking a success state. `.env` is gitignored.

## Deploy

GitHub user sites serve `main` at the domain root, so the build output is
committed there:

```bash
npm run build
cp -r dist/* /e/portfolio/          # /e/portfolio is a clone on `main`
cd /e/portfolio && git add -A && git commit && git push
```

`public/.nojekyll` ships with the build — this repo's Pages pipeline runs Jekyll
over the branch and would otherwise interfere with asset paths.

### Why there is no `manualChunks`

An earlier config named a vendor chunk for three/r3f. That makes the chunk a
**static** dependency of the entry, which flattens the `React.lazy` dynamic
import and `modulepreload`s ~900 kB before first paint. Leaving the automatic
splitting alone keeps three.js inside the scene's own dynamic chunk:

```
index-*.js        411 kB   entry — zero three.js
NeuralScene-*.js  924 kB   fetched only when the hero mounts the scene
```

### Deploying to Vercel instead

`vercel --prod` from this directory works as-is (framework preset Vite, build
`npm run build`, output `dist`). The résumé PDF prints the github.io URL, so that
one needs to keep working either way.

## Scene notes

Three things in `NeuralScene.tsx` are deliberate, each a bug fixed the hard way:

1. `PointsMaterial` with no `map` rasterises **squares** — the pulses carry a
   generated radial sprite.
2. Additive blending adds toward white and erases the scene on a pale
   background — the light theme switches to normal blending, a lower alpha and
   thinner fog.
3. With `prefers-reduced-motion` there is no rAF loop, so the single rendered
   frame is cleared from the drawing buffer before compositing — that path sets
   `preserveDrawingBuffer`.

Phones and low-core machines get a lighter scene (620 nodes, no pulses, DPR 1)
rather than no scene at all.
