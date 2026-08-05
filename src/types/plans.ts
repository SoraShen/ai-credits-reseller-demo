export type PlanId = "starter" | "standard" | "pro";

export interface TokenPlan {
  id: PlanId;
  name: string;
  price: number;
  currency: string;
  period: string;
  tokensMillion: number;
  tokensBonusMillion: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}
