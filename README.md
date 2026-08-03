# app-template

A minimal **TypeScript + Hono** API template used as the starting point for every new startup in our AI SDLC pipeline. Clone, rename, push, connect to a deploy provider — done.

---

## 1. What this is

A reusable skeleton, not a product. Every new startup in the pipeline begins from this repo so that:

- The CI pipeline (lint / typecheck / test / build) is identical across projects.
- Deploy integrations (Railway, Cloudflare, etc.) attach to a known shape.
- Secrets, env, and DB conventions are already wired up.

The only runtime dependency is **Hono**. There is no framework lock-in beyond that and no client UI — pair it with whatever frontend you build (Next.js, Astro, a separate app, etc.).

---

## 2. The pipeline

The intended lifecycle of every change in this template:

1. **AI writes code** in a feature branch (or directly on a PR branch).
2. **PR is opened** against `main`.
3. **CI runs** — lint, typecheck, tests, build. Anything red blocks the PR.
4. **AI review** the diff for correctness, security, and style.
5. **Human approval** is required to merge. AI output is **never** auto-merged.
6. **Merge to `main`** triggers the platform's auto-deploy:
   - A **test / preview** environment is rebuilt for that PR (or a fresh one for `main`).
   - The **prod** environment redeploys on every merge to `main`.

Deploys are handled by the platform's GitHub integration (Railway, Cloudflare Pages, etc.) — **not** by a deploy workflow file in this repo. CI only proves the code is correct to build and run.

---

## 3. Environments

| Env       | Trigger               | Database                            | URL                          |
| --------- | --------------------- | ----------------------------------- | ---------------------------- |
| `test`    | PR opened / updated   | Neon **branch** (auto-created)      | Preview URL (per PR)         |
| `prod`    | Merge to `main`       | Neon **main** branch                | Production URL               |

Use Neon's database branching to give every PR an isolated DB. Reset the branch when the PR closes.

---

## 4. Deploy provider options (2026)

Pick **one** and connect the repo via its GitHub App. No deploy YAML is committed to this repo.

| Provider                | Free tier                                         | PR previews | Commercial use | Notes                                                                                        |
| ----------------------- | ------------------------------------------------- | ----------- | -------------- | -------------------------------------------------------------------------------------------- |
| **Railway**             | $5 trial credit, then usage-based (~$1–5/mo small) | ✅ auto     | ✅             | Best DX, Nixpacks auto-detects this template, built-in DBs. Recommended default.            |
| **Cloudflare Pages + Workers** | $0                                          | ✅ via Pages| ✅             | Zero cold starts, but **10 ms CPU per invocation** — fine for small APIs, not for heavy work. |
| **Render**              | $0 (512 MB RAM)                                   | ✅          | ✅             | Free services **spin down after ~15 min idle** (~1 min cold start) — fine for test, avoid for prod APIs. |
| **Vercel Hobby**        | $0                                                | ✅          | ❌ **NON-COMMERCIAL** | Do **not** use for any revenue product. Upgrade to Pro ($20/mo) before charging customers.    |

Rule of thumb: **Railway for prod APIs**, **Cloudflare Pages + Workers** for ultra-cheap or edge-only workloads, **Render free** for disposable test environments.

---

## 5. Secrets

- Secrets live in **GitHub Environments** (`test`, `prod`) with environment-specific values.
- The `.env.example` file is the **template** — copy it to `.env` locally and fill in real values. **Never commit `.env`.**
- The CI workflow does **not** have access to production secrets. Only the deploy provider does, and only for the matching environment.

---

## 6. Starting a new startup repo

1. **Copy this folder** (or click "Use this template" on GitHub).
2. **Rename** the project: edit `name` in `package.json`, the `service` field in `src/index.ts`, and the README.
3. **Create a Neon project** at [neon.tech](https://neon.tech) and grab the pooled `DATABASE_URL`. Drop the dev branch URL into your local `.env`.
4. **Connect the repo** to a deploy provider (Railway recommended) and grant it access to the `test` and `prod` GitHub environments.
5. **Add secrets** (`DATABASE_URL`, etc.) to each GitHub Environment.
6. Push to a branch, open a PR, watch CI go green, get a preview URL, then merge.

---

## 7. Free tier limits reminder

| Service             | Free tier                                                          |
| ------------------- | ------------------------------------------------------------------ |
| GitHub Actions      | 2,000 minutes / month (private repos); unlimited for public       |
| Neon Postgres       | 0.5 GB storage, unlimited branches, 191.9 compute-hours/mo         |
| Railway             | $5 trial credit, then pay-as-you-go                                |
| Cloudflare Workers  | 100,000 requests / day                                             |
| Render              | 750 hours / month, services sleep after 15 min idle                |

Watch the GitHub Actions minutes first — they are the most common thing to run out of on private repos.

---

## Local development

```bash
nvm use            # picks up .nvmrc (Node 24)
npm install
npm run dev        # tsx watch — hot reload on save
```

Other scripts:

```bash
npm test           # vitest run
npm run lint       # eslint .
npm run typecheck  # tsc --noEmit
npm run build      # tsc → dist/
npm start          # node dist/index.js (after build)
```

## Docker

```bash
docker build -t app-template .
docker run --rm -p 3000:3000 --env-file .env app-template
```

The image runs as a non-root user on `node:24-alpine`.
