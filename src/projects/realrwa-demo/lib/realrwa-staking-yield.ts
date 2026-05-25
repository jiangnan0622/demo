export type AssetYieldComposition = {
  assetSymbol: string;
  rwaBaseApr: number;
  realValueApr: number;
};

export const REALRWA_STAKING_YIELD_MAP: Record<string, AssetYieldComposition> = {
  rSDCT: {
    assetSymbol: "rSDCT",
    rwaBaseApr: 6,
    realValueApr: 1.9,
  },
  rXWCT: {
    assetSymbol: "rXWCT",
    rwaBaseApr: 6,
    realValueApr: 2,
  },
  rFUIDL: {
    assetSymbol: "rFUIDL",
    rwaBaseApr: 3.8,
    realValueApr: 0.1,
  },
};

export function getAssetYieldComposition(assetSymbol: string) {
  return REALRWA_STAKING_YIELD_MAP[assetSymbol];
}

export function calculateTotalAprFromComposition(composition: AssetYieldComposition) {
  return Number((composition.rwaBaseApr + composition.realValueApr).toFixed(2));
}

export function calculateAssetTotalApr(assetSymbol: string) {
  const composition = getAssetYieldComposition(assetSymbol);
  if (!composition) return 0;
  return calculateTotalAprFromComposition(composition);
}

export function calculateMonthlyRewardBreakdown(
  stakedUnits: number,
  unitPriceUsd1: number,
  assetSymbol: string
) {
  const composition = getAssetYieldComposition(assetSymbol);
  if (!composition) {
    return {
      rwaMonthlyReward: 0,
      realValueMonthlyReward: 0,
      totalMonthlyReward: 0,
    };
  }

  const stakeValueUsd1 = stakedUnits * unitPriceUsd1;
  const rwaMonthlyReward = Number(((stakeValueUsd1 * composition.rwaBaseApr) / 100 / 12).toFixed(6));
  const realValueMonthlyReward = Number(((stakeValueUsd1 * composition.realValueApr) / 100 / 12).toFixed(6));

  return {
    rwaMonthlyReward,
    realValueMonthlyReward,
    totalMonthlyReward: Number((rwaMonthlyReward + realValueMonthlyReward).toFixed(6)),
  };
}
