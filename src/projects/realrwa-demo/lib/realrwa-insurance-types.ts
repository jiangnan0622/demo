export const INSURANCE_COVERAGE_OPTIONS = [50, 40, 30, 20, 10] as const;
export type InsuranceCoverageOption = (typeof INSURANCE_COVERAGE_OPTIONS)[number];

export const INSURANCE_POLICY_STATUSES = [
  "not_insured",
  "pending_activation",
  "covering",
  "payout_triggered",
  "partial_payout",
  "payout_completed",
  "expired",
  "invalid",
] as const;
export type InsurancePolicyStatus = (typeof INSURANCE_POLICY_STATUSES)[number];

export const INSURANCE_POLICY_STATUS_FLOW = [
  "pending_activation",
  "covering",
  "payout_triggered",
  "partial_payout",
  "payout_completed",
  "expired",
  "invalid",
] as const;

export const DEMO_PAYOUT_SCENARIOS = [
  "normal",
  "payout_triggered",
  "partial_payout",
  "payout_completed",
] as const;
export type DemoPayoutScenario = (typeof DEMO_PAYOUT_SCENARIOS)[number];

export type AssetProject = {
  assetSymbol: string;
  assetNameCn: string;
  assetNameEn: string;
  issuerCn: string;
  issuerEn: string;
  iconUrl: string;
  unitPriceUsd1: number;
  availableStakeUnits: number;
  rwaBaseApr: number;
  realValueApr: number;
  apr: number;
  minStakeUnits: number;
  maturityDate: string;
};

export type InsuranceProjectConfig = {
  id: string;
  assetSymbol: string;
  assetNameCn: string;
  assetNameEn: string;
  bondCredentialCn: string;
  bondCredentialEn: string;
  rating: string;
  riskLevelCn: string;
  riskLevelEn: string;
  coverageOptions: InsuranceCoverageOption[];
  premiumRateMap: Record<InsuranceCoverageOption, number>;
  defaultCoverageRatio: InsuranceCoverageOption;
  remainingCoverageAmount: number;
  poolAvailableAmount: number;
  priorityDescriptionCn: string;
  priorityDescriptionEn: string;
  insurancePoolDescriptionCn: string;
  insurancePoolDescriptionEn: string;
  riskNoticeCn: string;
  riskNoticeEn: string;
  insurable: boolean;
  expireAt: string;
};

export type InsurancePool = {
  poolId: string;
  assetSymbol: string;
  totalAmount: number;
  usedAmount: number;
  remainingAmount: number;
};

export type StakingPosition = {
  positionId: string;
  assetSymbol: string;
  assetName: string;
  stakedUnits: number;
  stakedValue: number;
  status: "active" | "completed" | "expired";
  createdAt: string;
  hasInsurance: boolean;
};

export type InsurancePolicy = {
  policyId: string;
  positionId: string;
  assetSymbol: string;
  assetName: string;
  insuredUnits: number;
  coverageRatio: InsuranceCoverageOption;
  coverageAmount: number;
  premiumPaid: number;
  policyStatus: InsurancePolicyStatus;
  effectiveAt: string;
  expireAt: string;
};

export type DefaultEvent = {
  eventId: string;
  assetSymbol: string;
  policyId: string;
  scenario: DemoPayoutScenario;
  triggeredAt: string;
  noteCn: string;
  noteEn: string;
};

export type InsuranceProjectSnapshot = InsuranceProjectConfig & {
  currentStatus: InsurancePolicyStatus;
  latestPolicyId?: string;
};
