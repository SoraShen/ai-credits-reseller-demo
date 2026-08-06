/**
 * Audit every customer-visible price derivation against independent arithmetic.
 * Run: node scripts/verify-pricing.ts
 */
import { DEFAULT_STATE } from "../src/lib/pricing/templates";
import { toStorefrontPlans } from "../src/lib/pricing/storage";
import {
  annualSaving,
  breakevenDiscount,
  marginAtDiscount,
  planPricing,
} from "../src/lib/pricing/formulas";
import type { Audience, Billing } from "../src/lib/pricing/types";

const state = DEFAULT_STATE;
const d = state.params.promoDiscount;
let failures = 0;

function check(name: string, actual: unknown, expected: unknown) {
  const ok =
    typeof actual === "number" && typeof expected === "number"
      ? Math.abs(actual - expected) < 0.01
      : actual === expected;
  if (!ok) {
    failures += 1;
    console.log(`  FAIL ${name}: got ${String(actual)}, want ${String(expected)}`);
  }
}

for (const audience of ["personal", "business"] as Audience[]) {
  for (const billing of ["monthly", "yearly"] as Billing[]) {
    const plans = toStorefrontPlans(state, audience, billing);
    console.log(`\n== ${audience} / ${billing} ==`);
    for (const plan of plans) {
      const pkg = state.packages.find((p) => p.id === plan.id)!;
      const months = billing === "yearly" ? 12 : 1;
      const yearly = billing === "yearly";
      const promoOn = yearly ? state.params.promoStacksOnAnnual === true : true;
      const list = yearly ? pkg.yearlyPrice : pkg.monthlyPrice;
      const pay = Math.round(list * (promoOn ? d : 1));
      const credits = pkg.credits * months;
      const unit = (pay / credits) * 1e6;

      check(`${plan.name} price`, plan.price, pay);
      check(`${plan.name} list`, plan.priceOriginal, list);
      check(`${plan.name} periodCredits`, plan.periodCredits, credits);

      const shownUnit = Number(/^R([\d.,]+)/.exec(plan.unitPriceLabel)![1].replace(/,/g, ""));
      check(
        `${plan.name} unit label`,
        shownUnit,
        Number(unit.toFixed(unit >= 100 ? 0 : unit >= 10 ? 1 : 2))
      );

      const effMargin = 1 - pkg.monthlyPrice * (1 - pkg.designMargin) / (pay / months);
      check(`${plan.name} eff margin`, plan.effectiveMargin, effMargin);
      if (plan.effectiveMargin < 0) {
        failures += 1;
        console.log(`  FAIL ${plan.name}: negative gross margin on the shelf`);
      }

      check(
        `${plan.name} discount badge`,
        plan.discountLabel,
        promoOn ? "15% Off" : undefined
      );

      if (yearly) {
        const totalOff = 1 - pay / (pkg.monthlyPrice * 12);
        check(
          `${plan.name} savings label`,
          plan.savingsLabel,
          `Save ${(totalOff * 100).toFixed(0)}% vs monthly`
        );
        check(
          `${plan.name} monthly equivalent`,
          plan.monthlyEquivalentLabel,
          `≈ R${Math.round(pay / 12).toLocaleString("en-ZA")} / month`
        );
      } else {
        check(`${plan.name} savings label`, plan.savingsLabel, undefined);
      }

      // Yearly must never be worse value per credit than monthly.
      const m = planPricing(pkg, "monthly", d, {
        promoStacksOnAnnual: state.params.promoStacksOnAnnual === true,
      });
      const yr = planPricing(pkg, "yearly", d, {
        promoStacksOnAnnual: state.params.promoStacksOnAnnual === true,
      });
      if (yr.unitPer1M > m.unitPer1M) {
        failures += 1;
        console.log(`  FAIL ${plan.name}: yearly unit price worse than monthly`);
      }

      console.log(
        `  ${plan.name.padEnd(10)} ${plan.price.toString().padStart(6)} ` +
          `${plan.unitPriceLabel.padEnd(18)} eff.GM ${(plan.effectiveMargin * 100).toFixed(1).padStart(6)}% ` +
          `${plan.savingsLabel ?? ""}`
      );
    }
  }
}

console.log("\n== annual saving vs monthly (list) ==");
for (const p of state.packages) {
  const monthlyGm = marginAtDiscount(p, d).margin;
  const yearlyGm = planPricing(p, "yearly", d).effectiveMargin;
  console.log(
    `  ${p.name.padEnd(10)} annual −${(annualSaving(p) * 100).toFixed(1)}% ` +
      `| promo GM m/y ${(monthlyGm * 100).toFixed(1)}% / ${(yearlyGm * 100).toFixed(1)}% ` +
      `| breakeven discount ${(breakevenDiscount(p) * 100).toFixed(1)}%`
  );
}

console.log(failures ? `\n${failures} FAILURES` : "\nAll price assertions passed");
process.exit(failures ? 1 : 0);
