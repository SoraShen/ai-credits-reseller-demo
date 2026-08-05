# Huawei Cloud MaaS price check

Source: [Huawei Cloud International — MaaS Text Generation Models](https://support.huaweicloud.com/intl/en-us/price-maas/price-maas-0002.html) (updated 2026-07-28). Unit: **USD / 1M tokens**.

| Model | Our studio (primary) | Huawei doc | Status |
|-------|----------------------|------------|--------|
| DeepSeek-V4-Flash | 0.135 / 0.27 | 0.135 / 0.27 | Match |
| DeepSeek-V4-Pro | 1.617 / 3.235 | 1.617 / 3.235 | Match |
| DeepSeek-V3.2 | 0.27 / 0.404 | 0.27 / 0.404 | Match |
| DeepSeek-V3 | 0.27 / 1.078 | 0.27 / 1.078 | Match |
| DeepSeek-R1-0528 | 0.539 / 2.156 | 0.539 / 2.156 | Added (was missing) |
| GLM-5 | 0.539 / 2.426 (<32K) | 0.539 / 2.426; ≥32K 0.809 / 2.965 | Fixed (was wrongly 0.135 input = cache hit) |
| GLM-5.1 | 0.809 / 3.235 (<32K) | 0.809 / 3.235; ≥32K 1.078 / 3.774 | Fixed (draft ranges were wrong) |
| GLM-5.2 | 1.4 / 4.4 | 1.4 / 4.4; cache hit 0.26 | Match |

Notes:
- China-site CNY table (¥/千Tokens) converts consistently (e.g. V4-Pro ¥0.012/千 = $1.617/百万 at ~7.42 FX), but **studio uses International USD table**.
- Simulator default band uses `<32K` prices for GLM-5 / GLM-5.1.
- Actual billing always subject to MaaS console.
