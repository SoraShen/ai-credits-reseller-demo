# Vodacom AI Credits Demo

Huawei Cloud–provided **frontend demo** for Vodacom customer reference.  
Not an official Vodacom product. No payment or backend integration.

## What’s included

- **Packages storefront** (`/`, `/packages`) — Individual & Team Credits plans, monthly/yearly, limited-time countdown (Alibaba-style)
- **Pricing Studio** (`/pricing-studio`) — EN/中文, Version A (profit) / Version B (growth) templates, editable Huawei MaaS costs, margin sensitivity, call simulator; syncs to storefront via `localStorage`
- Branding: Vodacom red `#E60000`, Credits anchor `1 USD = 500,000 Credits`

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm run start   # production
```

Requires **Node.js 24+**.

## Deploy (Huawei Cloud AF-Johannesburg ECS)

Pure frontend (Next.js). No GPU, no DB, no Redis.

| Use case | Spec (example) | Notes |
|----------|----------------|--------|
| Demo / PoC | **1–2 vCPU · 2 GB** (e.g. `s6.medium.2`) | Fine for a few concurrent viewers |
| Safer demo | **2 vCPU · 4 GB** (e.g. `s6.large.2`) | Recommended if you build on the box or expect more traffic |
| Disk | **40 GB** SSD | Node + `node_modules` + build cache |
| OS | Ubuntu 22.04 | Open **22 / 80 / 443** in security group |
| Bandwidth | **5–10 Mbit/s** | Static site traffic is small |

**Do not** pick GPU / Ascend / high-memory flavours for this demo.

```bash
# on ECS
sudo apt update && sudo apt install -y nginx
# install Node 24 via nvm or nodesource, then:
npm ci
npm run build
npm run start   # :3000 — put Nginx reverse-proxy + HTTPS in front
# or: docker compose up -d --build
```

## Key paths

| Path | Purpose |
|------|---------|
| `src/lib/pricing/` | Templates A/B, Huawei MaaS prices, formulas, storage |
| `src/components/packages/` | Storefront UI |
| `src/components/pricing-studio/` | Pricing calculator UI |
| `docs/research/HUAWEI_MAAS_PRICE_CHECK.md` | Price verification vs Huawei docs |

## Disclaimer

This environment is provided by **Huawei Cloud** for demonstration. Designs and pricing are for **Vodacom customer reference only**.
