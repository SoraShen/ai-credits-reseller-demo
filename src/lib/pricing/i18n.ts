import { brand } from "@/lib/brand";

export type Lang = "en" | "zh";

function fill(s: string) {
  return s
    .replaceAll("{product}", brand.productName)
    .replaceAll("{name}", brand.name);
}

const COPY_RAW = {
  en: {
    title: "Pricing Studio",
    subtitle:
      "Configure {product} Credits logic, pick a sample template, and sync prices to the storefront.",
    back: "Back to Packages",
    apply: "Apply to storefront",
    applied: "Applied — storefront updated",
    templates: "Sample templates",
    templateA: "Version A · Profit-first",
    templateB: "Version B · Growth-first",
    templateADesc: "r=40%, margins 32–40%, higher entry price",
    templateBDesc: "r=30%, margins 22–35%, lower acquisition price",
    params: "1 · Parameters",
    modelTable: "Huawei Cloud MaaS model costs (USD / 1M tokens)",
    modelSource:
      "Source: Huawei Cloud International MaaS billing docs (updated 2026-07-28). Actual prices subject to console.",
    packages: "2 · Package pricing",
    sensitivity: "3 · Discount sensitivity",
    bonus: "4 · Bonus cost",
    simulator: "5 · Call cost simulator",
    philosophy: "Design philosophy",
    active: "Active on storefront",
    select: "Use this template",
    personal: "Individual",
    business: "Team",
    safety: "Safety (1+r)×d > 1",
    ok: "OK",
    risk: "Below floor",
    loading: "Loading…",
    usdZar: "USD/ZAR rate",
    creditsPerUsd: "1 USD = Credits",
    markupRate: "Markup rate r",
    minDiscount: "Min discount d_min",
    promoDiscount: "Promo discount d",
    promoEnds: "Promo ends at",
    zarCredits: "1 ZAR ≈",
    creditsUnit: "Credits",
    colModel: "Model",
    colTier: "Tier",
    colCoeff: "Coeff",
    colInput: "Input $/MTok",
    colOutput: "Output $/MTok",
    colNote: "Notes",
    colPlan: "Plan",
    colMonthly: "Monthly",
    colYearly: "Yearly",
    colCredits: "Credits",
    colDesignGm: "Design GM",
    promoStack: "Stack the promo on annual plans",
    promoStackHint:
      "Off by default: annual list prices already carry the annual saving, so stacking a launch promo on top can push annual gross margin below zero. Toggle it to see the damage in the Promo GM (annual) column.",
    colPromoGm: "Promo GM (monthly)",
    colYearlyGm: "Promo GM (annual)",
    colUnit: "R / 1M Credits",
    colDiscount: "Discount",
    colBonus: "Bonus",
    colGift: "Gift %",
    colCostUp: "Cost ↑",
    colBonusNote: "Note",
    bonusNote:
      "Revenue unchanged; cost rises with gifted Credits",
    gmExplain:
      "Gross Margin (GM) = planned profit share after estimated MaaS cost. For {name} partner planning only — hide on the consumer storefront.",
    fxPower: "6 · FX & purchasing power",
    simFormula:
      "Credits = (input$/MTok×tokens + output$/MTok×tokens) / 1e6 × tierCoeff × creditsPerUsd",
    simModel: "Model",
    simIn: "Input tokens",
    simOut: "Output tokens",
    simApi: "API cost",
    simCredits: "Credits used",
    simExample: "Reference check (V4-Pro 1k in / 2k out): ~5,257 Credits",
    bonusRows: [
      ["New user +20% Credits", 0.2],
      ["Referral +5% each", 0.05],
      ["Renewal month-4 +10%", 0.1],
      ["Night 50% consumption", 0.5],
    ] as Array<[string, number]>,
  },
  zh: {
    title: "定价工作室",
    subtitle:
      "配置 {product} Credits 定价逻辑，选择样本模板，并同步到前台套餐页。",
    back: "返回套餐页",
    apply: "应用到前台",
    applied: "已应用 — 前台套餐已更新",
    templates: "样本模板",
    templateA: "版本A · 稳健利润版",
    templateB: "版本B · 激进获客版",
    templateADesc: "加价率40%，毛利32–40%，入门价更高",
    templateBDesc: "加价率30%，毛利22–35%，获客价更低",
    params: "1 · 参数配置",
    modelTable: "华为云 MaaS 模型成本（美元 / 百万 Token）",
    modelSource:
      "数据来源：华为云国际站 MaaS 计费文档（更新于 2026-07-28）。实际价格以控制台为准。",
    packages: "2 · 套餐定价",
    sensitivity: "3 · 折扣敏感性",
    bonus: "4 · Bonus 成本",
    simulator: "5 · 调用成本模拟",
    philosophy: "设计理念",
    active: "当前前台生效",
    select: "选用此模板",
    personal: "个人套餐",
    business: "企业套餐",
    safety: "盈利底线 (1+r)×d > 1",
    ok: "安全",
    risk: "低于底线",
    loading: "加载中…",
    usdZar: "USD/ZAR 汇率",
    creditsPerUsd: "1 美元 = Credits",
    markupRate: "加价率 r",
    minDiscount: "最低折扣 d_min",
    promoDiscount: "限时折扣 d",
    promoEnds: "促销结束时间",
    zarCredits: "1 兰特 ≈",
    creditsUnit: "Credits",
    colModel: "模型",
    colTier: "梯级",
    colCoeff: "系数",
    colInput: "输入 $/百万Token",
    colOutput: "输出 $/百万Token",
    colNote: "备注",
    colPlan: "套餐",
    colMonthly: "月费",
    colYearly: "年付",
    colCredits: "Credits",
    colDesignGm: "设计毛利",
    promoStack: "促销折扣叠加到年付套餐",
    promoStackHint:
      "默认关闭：年付标价本身已含年付优惠，再叠加上线促销会把年付毛利压到负数。可以打开开关，在“折后毛利（年付）”列直接看到后果。",
    colPromoGm: "折后毛利（月付）",
    colYearlyGm: "折后毛利（年付）",
    colUnit: "兰特/百万Credits",
    colDiscount: "折扣率",
    colBonus: "Bonus 类型",
    colGift: "赠送比例",
    colCostUp: "成本增加",
    colBonusNote: "说明",
    bonusNote: "收入不变，成本随赠送 Credits 上升",
    gmExplain:
      "毛利率（Gross Margin）= 扣除预估 MaaS 成本后的计划利润占比。仅供 {name} 合作方内部规划，不对终端用户展示。",
    fxPower: "6 · 汇率与购买力",
    simFormula:
      "Credits = (输入价×输入Token + 输出价×输出Token) / 1e6 × 梯级系数 × 每美元Credits",
    simModel: "模型",
    simIn: "输入 Token",
    simOut: "输出 Token",
    simApi: "API 成本",
    simCredits: "消耗 Credits",
    simExample: "校验示例（V4-Pro 输入1k / 输出2k）：约 5,257 Credits",
    bonusRows: [
      ["新用户 +20% Credits", 0.2],
      ["推荐双方各 +5%", 0.05],
      ["连续订阅第4月 +10%", 0.1],
      ["夜间消耗减半", 0.5],
    ] as Array<[string, number]>,
  },
} as const;

function fillLang<T extends Record<string, unknown>>(lang: T): T {
  const out = { ...lang } as Record<string, unknown>;
  for (const [k, v] of Object.entries(lang)) {
    if (typeof v === "string") out[k] = fill(v);
  }
  return out as T;
}

export const COPY = {
  en: fillLang(COPY_RAW.en),
  zh: fillLang(COPY_RAW.zh),
} as typeof COPY_RAW;

export const PHILOSOPHY = {
  zh: [
    {
      t: "以 Credits 为统一计量单位",
      d: "固定锚点 1 USD = 500,000 Credits，屏蔽模型计价与汇率复杂性。",
    },
    {
      t: "模型梯级供应",
      d: "Tier1/2/3 系数 1.0/1.2/1.3，低价套餐限制旗舰模型，成本可控。",
    },
    {
      t: "双轨套餐覆盖全客群",
      d: "个人四档、企业三档席位，每档单价（兰特/百万 Credits）随档位递减；年付按 12 个月额度计价，单价必须优于月付。",
    },
    {
      t: "汇率防火墙（对终端）",
      d: "前台只展示兰特标价与 Credits 额度。汇率红利与风险由谁承担是一个显式选择（见第 6 节），但无论选哪种，用户账单都不随美元跳动。",
    },
    {
      t: "折扣不叠加",
      d: "促销只作用于月付；年付标价本身已含年付优惠。叠加会击穿毛利下限，Bonus 用于留存而不侵蚀标价。",
    },
    {
      t: "利润安全边际",
      d: "坚守 (1+r)×d > 1，实时监控各折扣下毛利率。",
    },
  ],
  en: [
    {
      t: "Credits as unified billing unit",
      d: "Fixed anchor 1 USD = 500,000 Credits hides model pricing & FX complexity.",
    },
    {
      t: "Tiered model access",
      d: "Tier 1/2/3 coeffs 1.0/1.2/1.3. Entry plans restrict flagship models.",
    },
    {
      t: "Dual-track packages",
      d: "Four individual tiers and three team seats, with R / 1M Credits falling as you climb. Annual is priced against 12 monthly quotas, so its unit price must beat monthly.",
    },
    {
      t: "Currency firewall (for end users)",
      d: "Storefront shows Rand prices and Credits only. Who owns the FX upside and downside is an explicit design choice (§6) — either way the subscriber's bill never moves with the dollar.",
    },
    {
      t: "Discounts do not stack",
      d: "Promo applies to monthly; annual list prices already carry the annual saving. Stacking breaks the margin floor. Bonus Credits drive retention without repricing.",
    },
    {
      t: "Profit safety margin",
      d: "Keep (1+r)×d > 1 and monitor margins under every discount scenario.",
    },
  ],
};
