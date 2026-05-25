import type { InsuranceCoverageOption } from "@/projects/realrwa-demo/lib/realrwa-insurance-types";

export function calculateCoverageAmountUsd1(
  insuredUnits: number,
  unitPriceUsd1: number,
  coverageRatio: InsuranceCoverageOption
) {
  // TODO_CONFIRM: 演示口径按“质押数量 * 单价 * 保险档位”计算保障额度。
  return Number((insuredUnits * unitPriceUsd1 * (coverageRatio / 100)).toFixed(2));
}

export function calculatePremiumAmountUsd1(
  coverageAmountUsd1: number,
  premiumRate: number
) {
  // TODO_CONFIRM: 演示口径按“保障额度 * 保费率”计算保费。
  return Number((coverageAmountUsd1 * premiumRate).toFixed(2));
}

export function getPremiumRateByCoverage(
  premiumRateMap: Record<InsuranceCoverageOption, number>,
  coverageRatio: InsuranceCoverageOption
) {
  return premiumRateMap[coverageRatio];
}
