import type {
  AssetProject,
  DefaultEvent,
  DemoPayoutScenario,
  InsuranceCoverageOption,
  InsurancePolicy,
  InsurancePolicyStatus,
  InsurancePool,
  InsuranceProjectConfig,
  StakingPosition,
} from "@/projects/realrwa-demo/lib/realrwa-insurance-types";
import {
  calculateAssetTotalApr,
  getAssetYieldComposition,
} from "@/projects/realrwa-demo/lib/realrwa-staking-yield";

const BASE_PREMIUM_RATE_MAP: Record<InsuranceCoverageOption, number> = {
  50: 0.029,
  40: 0.024,
  30: 0.019,
  20: 0.014,
  10: 0.009,
};

export const REALRWA_ASSET_PROJECTS_MOCK: AssetProject[] = [
  {
    assetSymbol: "rSDCT",
    assetNameCn: "商都城投债券凭证",
    assetNameEn: "Shangdu Urban Bond Note",
    issuerCn: "商都城投",
    issuerEn: "Shangdu Urban Investment",
    iconUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rSDCT.png",
    unitPriceUsd1: 1,
    availableStakeUnits: 12,
    rwaBaseApr: getAssetYieldComposition("rSDCT")?.rwaBaseApr ?? 0,
    realValueApr: getAssetYieldComposition("rSDCT")?.realValueApr ?? 0,
    apr: calculateAssetTotalApr("rSDCT"),
    minStakeUnits: 1,
    maturityDate: "2026-08-11",
  },
  {
    assetSymbol: "rXWCT",
    assetNameCn: "兴财城投债券凭证",
    assetNameEn: "Xingcai Urban Bond Note",
    issuerCn: "兴财城投",
    issuerEn: "Xingcai Urban Investment",
    iconUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rXWCT.png",
    unitPriceUsd1: 1,
    availableStakeUnits: 18.4,
    rwaBaseApr: getAssetYieldComposition("rXWCT")?.rwaBaseApr ?? 0,
    realValueApr: getAssetYieldComposition("rXWCT")?.realValueApr ?? 0,
    apr: calculateAssetTotalApr("rXWCT"),
    minStakeUnits: 1,
    maturityDate: "2026-11-13",
  },
  {
    assetSymbol: "rFUIDL",
    assetNameCn: "复星财富美元流动性凭证",
    assetNameEn: "Fosun USD Liquidity Note",
    issuerCn: "复星财富控股",
    issuerEn: "Fosun Wealth Holdings",
    iconUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rFUIDL.png",
    unitPriceUsd1: 1,
    availableStakeUnits: 32,
    rwaBaseApr: getAssetYieldComposition("rFUIDL")?.rwaBaseApr ?? 0,
    realValueApr: getAssetYieldComposition("rFUIDL")?.realValueApr ?? 0,
    apr: calculateAssetTotalApr("rFUIDL"),
    minStakeUnits: 1,
    maturityDate: "开放式",
  },
];

export const REALRWA_INSURANCE_CONFIGS_MOCK: InsuranceProjectConfig[] = [
  {
    id: "ins-rsdct-001",
    assetSymbol: "rSDCT",
    assetNameCn: "商都城投债券凭证",
    assetNameEn: "Shangdu Urban Bond Note",
    bondCredentialCn: "SDCT-2025-A / 标准企业债底层债权凭证",
    bondCredentialEn: "SDCT-2025-A / Corporate bond receivable certificate",
    rating: "AA-",
    riskLevelCn: "中低风险",
    riskLevelEn: "Medium-Low",
    coverageOptions: [50, 40, 30, 20, 10],
    premiumRateMap: BASE_PREMIUM_RATE_MAP,
    defaultCoverageRatio: 40,
    remainingCoverageAmount: 4800,
    poolAvailableAmount: 6200,
    priorityDescriptionCn: "优先级 A：先本金后收益，按违约确认时间顺序进入赔付队列。",
    priorityDescriptionEn: "Priority A: principal first, then yield in confirmed default order.",
    insurancePoolDescriptionCn: "保险池由协议储备、已收保费和储备策略收益共同构成，用于违约风险保障。",
    insurancePoolDescriptionEn: "Pool is backed by protocol reserve, collected premium, and reserve strategy income.",
    riskNoticeCn: "该保障仅覆盖底层债券/债权违约风险，不覆盖市场价格波动，也不构成保本承诺。",
    riskNoticeEn: "Coverage addresses bond-credit default risk only and does not insure market price volatility.",
    insurable: true,
    expireAt: "2026-12-31",
  },
  {
    id: "ins-rxwct-001",
    assetSymbol: "rXWCT",
    assetNameCn: "兴财城投债券凭证",
    assetNameEn: "Xingcai Urban Bond Note",
    bondCredentialCn: "XWCT-2025-B / 城投债底层债权凭证",
    bondCredentialEn: "XWCT-2025-B / Urban investment receivable certificate",
    rating: "A+",
    riskLevelCn: "中风险",
    riskLevelEn: "Medium",
    coverageOptions: [50, 40, 30, 20, 10],
    premiumRateMap: BASE_PREMIUM_RATE_MAP,
    defaultCoverageRatio: 30,
    remainingCoverageAmount: 3600,
    poolAvailableAmount: 4200,
    priorityDescriptionCn: "优先级 B：按保单生效先后顺序分批赔付，赔付总额受保险池剩余额度约束。",
    priorityDescriptionEn: "Priority B: batched payout in policy-effective order, capped by remaining pool quota.",
    insurancePoolDescriptionCn: "保险池流动性会随已承保规模动态调整，超额部分仅作展示，不代表真实承保承诺。",
    insurancePoolDescriptionEn: "Pool liquidity adjusts with insured size; excess demand remains subject to final coverage approval.",
    riskNoticeCn: "请结合项目评级、风险等级和保险池剩余额度判断是否投保，保险并非无限兜底。",
    riskNoticeEn: "Evaluate rating, risk level, and remaining quota before insuring; coverage is not unlimited.",
    insurable: true,
    expireAt: "2026-10-31",
  },
  {
    id: "ins-rfuidl-001",
    assetSymbol: "rFUIDL",
    assetNameCn: "复星财富美元流动性凭证",
    assetNameEn: "Fosun USD Liquidity Note",
    bondCredentialCn: "FUIDL-OPEN / 开放式美元流动性底层凭证",
    bondCredentialEn: "FUIDL-OPEN / Open-ended USD liquidity certificate",
    rating: "AAA",
    riskLevelCn: "低风险",
    riskLevelEn: "Low",
    coverageOptions: [50, 40, 30, 20, 10],
    premiumRateMap: BASE_PREMIUM_RATE_MAP,
    defaultCoverageRatio: 20,
    remainingCoverageAmount: 0,
    poolAvailableAmount: 0,
    priorityDescriptionCn: "当前暂未开放该项目投保。",
    priorityDescriptionEn: "Insurance is not open for this asset yet.",
    insurancePoolDescriptionCn: "该项目当前未接入保险池。",
    insurancePoolDescriptionEn: "This asset is not connected to the insurance pool yet.",
    riskNoticeCn: "当前项目暂不可投保，请关注后续承保开放公告。",
    riskNoticeEn: "Insurance is unavailable for this asset.",
    insurable: false,
    expireAt: "2026-12-31",
  },
];

export const REALRWA_INSURANCE_POOLS_MOCK: InsurancePool[] = [
  {
    poolId: "pool-rsdct",
    assetSymbol: "rSDCT",
    totalAmount: 9000,
    usedAmount: 4200,
    remainingAmount: 4800,
  },
  {
    poolId: "pool-rxwct",
    assetSymbol: "rXWCT",
    totalAmount: 7600,
    usedAmount: 4000,
    remainingAmount: 3600,
  },
  {
    poolId: "pool-rfuidl",
    assetSymbol: "rFUIDL",
    totalAmount: 0,
    usedAmount: 0,
    remainingAmount: 0,
  },
];

export const REALRWA_INITIAL_STAKING_POSITIONS_MOCK: StakingPosition[] = [
  {
    positionId: "pos_rfi_001",
    assetSymbol: "rXWCT",
    assetName: "兴财城投债券凭证",
    stakedUnits: 4.42,
    stakedValue: 4.42,
    status: "active",
    createdAt: "2026-04-02 13:51:00",
    hasInsurance: true,
  },
  {
    positionId: "pos_rfi_002",
    assetSymbol: "rSDCT",
    assetName: "商都城投债券凭证",
    stakedUnits: 2,
    stakedValue: 2,
    status: "active",
    createdAt: "2026-04-01 10:18:42",
    hasInsurance: false,
  },
];

export const REALRWA_INITIAL_INSURANCE_POLICIES_MOCK: InsurancePolicy[] = [
  {
    policyId: "pol_rfi_001",
    positionId: "pos_rfi_001",
    assetSymbol: "rXWCT",
    assetName: "兴财城投债券凭证",
    insuredUnits: 4.42,
    coverageRatio: 30,
    coverageAmount: 1.33,
    premiumPaid: 0.03,
    policyStatus: "covering",
    effectiveAt: "2026-04-02 13:52:00",
    expireAt: "2026-10-31",
  },
];

export const REALRWA_INITIAL_DEFAULT_EVENTS_MOCK: DefaultEvent[] = [];

export function getScenarioStatus(scenario: DemoPayoutScenario): InsurancePolicyStatus {
  switch (scenario) {
    case "payout_triggered":
      return "payout_triggered";
    case "partial_payout":
      return "partial_payout";
    case "payout_completed":
      return "payout_completed";
    case "normal":
    default:
      return "covering";
  }
}
