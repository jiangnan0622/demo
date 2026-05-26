"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  calculateCoverageAmountUsd1,
  calculatePremiumAmountUsd1,
  getPremiumRateByCoverage,
} from "@/projects/realrwa-demo/lib/realrwa-insurance-calculations";
import {
  getScenarioStatus,
  REALRWA_ASSET_PROJECTS_MOCK,
  REALRWA_INITIAL_DEFAULT_EVENTS_MOCK,
  REALRWA_INITIAL_INSURANCE_POLICIES_MOCK,
  REALRWA_INITIAL_STAKING_POSITIONS_MOCK,
  REALRWA_INSURANCE_CONFIGS_MOCK,
  REALRWA_INSURANCE_POOLS_MOCK,
} from "@/projects/realrwa-demo/lib/realrwa-insurance-mock";
import type {
  AssetProject,
  DefaultEvent,
  DemoPayoutScenario,
  InsuranceCoverageOption,
  InsurancePolicy,
  InsurancePool,
  InsuranceProjectConfig,
  InsuranceProjectSnapshot,
  StakingPosition,
} from "@/projects/realrwa-demo/lib/realrwa-insurance-types";

type SubmitStakeDemoPayload = {
  assetSymbol: string;
  stakedUnits: number;
  insureEnabled: boolean;
  coverageRatio?: InsuranceCoverageOption;
};

type SubmitStakeDemoResult = {
  position: StakingPosition;
  policy?: InsurancePolicy;
};

type InsuranceDemoContextValue = {
  assetProjects: AssetProject[];
  insuranceConfigs: InsuranceProjectConfig[];
  insuranceProjects: InsuranceProjectSnapshot[];
  insurancePools: InsurancePool[];
  stakingPositions: StakingPosition[];
  insurancePolicies: InsurancePolicy[];
  defaultEvents: DefaultEvent[];
  availableUsd1Balance: number;
  getAssetProject: (assetSymbol: string) => AssetProject | undefined;
  getInsuranceConfig: (assetSymbol: string) => InsuranceProjectConfig | undefined;
  getInsuranceProject: (assetSymbol: string) => InsuranceProjectSnapshot | undefined;
  getAvailableStakeUnits: (assetSymbol: string) => number;
  submitStakeDemo: (payload: SubmitStakeDemoPayload) => Promise<SubmitStakeDemoResult>;
  setPolicyScenario: (policyId: string, scenario: DemoPayoutScenario) => void;
};

const InsuranceDemoContext = createContext<InsuranceDemoContextValue | null>(null);

function formatDateTime(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36).slice(-6)}`;
}

export function InsuranceDemoProvider({ children }: { children: ReactNode }) {
  const [stakingPositions, setStakingPositions] = useState<StakingPosition[]>(REALRWA_INITIAL_STAKING_POSITIONS_MOCK);
  const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>(REALRWA_INITIAL_INSURANCE_POLICIES_MOCK);
  const [insurancePools, setInsurancePools] = useState<InsurancePool[]>(REALRWA_INSURANCE_POOLS_MOCK);
  const [defaultEvents, setDefaultEvents] = useState<DefaultEvent[]>(REALRWA_INITIAL_DEFAULT_EVENTS_MOCK);
  const [availableUsd1Balance, setAvailableUsd1Balance] = useState(36.5);
  const [availableStakeUnitsByAsset, setAvailableStakeUnitsByAsset] = useState<Record<string, number>>(() =>
    Object.fromEntries(REALRWA_ASSET_PROJECTS_MOCK.map((item) => [item.assetSymbol, item.availableStakeUnits]))
  );

  const insuranceProjects = useMemo<InsuranceProjectSnapshot[]>(() => {
    return REALRWA_INSURANCE_CONFIGS_MOCK.map((config) => {
      const pool = insurancePools.find((item) => item.assetSymbol === config.assetSymbol);
      const latestPolicy = [...insurancePolicies]
        .filter((policy) => policy.assetSymbol === config.assetSymbol)
        .sort((left, right) => right.effectiveAt.localeCompare(left.effectiveAt))[0];
      return {
        ...config,
        remainingCoverageAmount: pool?.remainingAmount ?? config.remainingCoverageAmount,
        poolAvailableAmount: pool?.remainingAmount ?? config.poolAvailableAmount,
        currentStatus: config.insurable ? latestPolicy?.policyStatus ?? "not_insured" : "invalid",
        latestPolicyId: latestPolicy?.policyId,
      };
    });
  }, [insurancePolicies, insurancePools]);

  const value = useMemo<InsuranceDemoContextValue>(
    () => ({
      assetProjects: REALRWA_ASSET_PROJECTS_MOCK,
      insuranceConfigs: REALRWA_INSURANCE_CONFIGS_MOCK,
      insuranceProjects,
      insurancePools,
      stakingPositions,
      insurancePolicies,
      defaultEvents,
      availableUsd1Balance,
      getAssetProject: (assetSymbol: string) =>
        REALRWA_ASSET_PROJECTS_MOCK.find((item) => item.assetSymbol === assetSymbol),
      getInsuranceConfig: (assetSymbol: string) =>
        REALRWA_INSURANCE_CONFIGS_MOCK.find((item) => item.assetSymbol === assetSymbol),
      getInsuranceProject: (assetSymbol: string) =>
        insuranceProjects.find((item) => item.assetSymbol === assetSymbol),
      getAvailableStakeUnits: (assetSymbol: string) => availableStakeUnitsByAsset[assetSymbol] ?? 0,
      submitStakeDemo: async ({ assetSymbol, stakedUnits, insureEnabled, coverageRatio }) => {
        const assetProject = REALRWA_ASSET_PROJECTS_MOCK.find((item) => item.assetSymbol === assetSymbol);
        if (!assetProject) {
          throw new Error("ASSET_NOT_FOUND");
        }
        if (!Number.isFinite(stakedUnits) || stakedUnits <= 0) {
          throw new Error("INVALID_STAKE_UNITS");
        }
        const currentAvailableStakeUnits =
          availableStakeUnitsByAsset[assetSymbol] ?? assetProject.availableStakeUnits;
        if (stakedUnits > currentAvailableStakeUnits) {
          throw new Error("STAKE_EXCEEDS_AVAILABLE");
        }

        const delayMs = 800 + Math.floor(Math.random() * 700);
        await new Promise((resolve) => setTimeout(resolve, delayMs));

        const createdAt = formatDateTime(new Date());
        const position: StakingPosition = {
          positionId: createId("pos"),
          assetSymbol,
          assetName: assetProject.assetNameCn,
          stakedUnits: Number(stakedUnits.toFixed(4)),
          stakedValue: Number((stakedUnits * assetProject.unitPriceUsd1).toFixed(2)),
          status: "active",
          createdAt,
          hasInsurance: insureEnabled,
        };

        if (!insureEnabled || !coverageRatio) {
          setStakingPositions((prev) => [position, ...prev]);
          setAvailableStakeUnitsByAsset((prev) => ({
            ...prev,
            [assetSymbol]: Number(Math.max((prev[assetSymbol] ?? 0) - stakedUnits, 0).toFixed(4)),
          }));
          return { position };
        }

        const config = REALRWA_INSURANCE_CONFIGS_MOCK.find((item) => item.assetSymbol === assetSymbol);
        const pool = insurancePools.find((item) => item.assetSymbol === assetSymbol);
        if (!config || !pool || !coverageRatio || !config.insurable) {
          throw new Error("INSURANCE_UNAVAILABLE");
        }

        const premiumRate = getPremiumRateByCoverage(config.premiumRateMap, coverageRatio);
        const coverageAmount = calculateCoverageAmountUsd1(stakedUnits, assetProject.unitPriceUsd1, coverageRatio);
        const premiumPaid = calculatePremiumAmountUsd1(coverageAmount, premiumRate);
        if (coverageAmount > pool.remainingAmount) {
          throw new Error("COVERAGE_QUOTA_EXCEEDED");
        }
        if (premiumPaid > availableUsd1Balance) {
          throw new Error("PREMIUM_BALANCE_INSUFFICIENT");
        }
        const effectiveAt = formatDateTime(addDays(new Date(), 1));
        const policy: InsurancePolicy = {
          policyId: createId("policy"),
          positionId: position.positionId,
          assetSymbol,
          assetName: assetProject.assetNameCn,
          insuredUnits: Number(stakedUnits.toFixed(4)),
          coverageRatio,
          coverageAmount,
          premiumPaid,
          policyStatus: "pending_activation",
          effectiveAt,
          expireAt: config.expireAt,
        };

        setStakingPositions((prev) => [position, ...prev]);
        setAvailableStakeUnitsByAsset((prev) => ({
          ...prev,
          [assetSymbol]: Number(Math.max((prev[assetSymbol] ?? 0) - stakedUnits, 0).toFixed(4)),
        }));
        setInsurancePolicies((prev) => [policy, ...prev]);
        setInsurancePools((prev) =>
          prev.map((item) =>
            item.assetSymbol === assetSymbol
              ? {
                  ...item,
                  usedAmount: Number((item.usedAmount + coverageAmount).toFixed(2)),
                  remainingAmount: Number(Math.max(item.remainingAmount - coverageAmount, 0).toFixed(2)),
                }
              : item
          )
        );
        setAvailableUsd1Balance((prev) => Number(Math.max(prev - premiumPaid, 0).toFixed(2)));
        return { position, policy };
      },
      setPolicyScenario: (policyId: string, scenario: DemoPayoutScenario) => {
        const nextStatus = getScenarioStatus(scenario);
        let targetPolicy: InsurancePolicy | undefined;
        setInsurancePolicies((prev) =>
          prev.map((policy) => {
            if (policy.policyId !== policyId) {
              return policy;
            }
            targetPolicy = { ...policy, policyStatus: nextStatus };
            return targetPolicy;
          })
        );

        if (!targetPolicy) return;

        if (scenario === "normal") {
          setDefaultEvents((prev) => prev.filter((event) => event.policyId !== policyId));
          return;
        }

        const triggeredAt = formatDateTime(new Date());
        const nextEvent: DefaultEvent = {
          eventId: createId("event"),
          assetSymbol: targetPolicy.assetSymbol,
          policyId,
          scenario,
          triggeredAt,
          noteCn:
            scenario === "payout_triggered"
              ? "已收到违约触发信号。"
              : scenario === "partial_payout"
                ? "保险池正在执行部分赔付。"
                : "赔付已完成并进入结案阶段。",
          noteEn:
            scenario === "payout_triggered"
              ? "Default trigger signal captured."
              : scenario === "partial_payout"
                ? "Pool is processing partial payout."
                : "Payout completed and policy settled.",
        };

        setDefaultEvents((prev) => [nextEvent, ...prev.filter((event) => event.policyId !== policyId)]);
      },
    }),
    [availableStakeUnitsByAsset, availableUsd1Balance, defaultEvents, insurancePolicies, insurancePools, insuranceProjects, stakingPositions]
  );

  return <InsuranceDemoContext.Provider value={value}>{children}</InsuranceDemoContext.Provider>;
}

export function useInsuranceDemo() {
  const value = useContext(InsuranceDemoContext);
  if (!value) {
    throw new Error("useInsuranceDemo must be used inside InsuranceDemoProvider");
  }
  return value;
}
