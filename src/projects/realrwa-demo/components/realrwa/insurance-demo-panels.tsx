"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useInsuranceDemo } from "@/projects/realrwa-demo/components/realrwa/insurance-demo-provider";
import { useRwaAppState } from "@/projects/realrwa-demo/components/realrwa/app-state-provider";
import {
  DEMO_PAYOUT_SCENARIOS,
  type DefaultEvent,
  type DemoPayoutScenario,
  type InsurancePolicy,
  type StakingPosition,
} from "@/projects/realrwa-demo/lib/realrwa-insurance-types";
import { getInsuranceStatusText } from "@/projects/realrwa-demo/lib/realrwa-insurance";

type InsuranceDemoPanelsProps = {
  className?: string;
};

const DEMO_SCENARIO_LABELS: Record<DemoPayoutScenario, { cn: string; en: string }> = {
  normal: { cn: "正常", en: "Normal" },
  payout_triggered: { cn: "已触发赔付", en: "Triggered" },
  partial_payout: { cn: "部分赔付中", en: "Partial" },
  payout_completed: { cn: "已完成赔付", en: "Completed" },
};

export function InsuranceDemoPanels({ className = "" }: InsuranceDemoPanelsProps) {
  const { lang } = useRwaAppState();
  const [showAllStakingOnMobile, setShowAllStakingOnMobile] = useState(false);
  const [showAllPoliciesOnMobile, setShowAllPoliciesOnMobile] = useState(false);
  const {
    stakingPositions,
    insurancePolicies,
    defaultEvents,
    setPolicyScenario,
  } = useInsuranceDemo();

  const eventMap = useMemo(() => {
    return Object.fromEntries(defaultEvents.map((item) => [item.policyId, item]));
  }, [defaultEvents]);
  const mobileVisibleStakingPositions = showAllStakingOnMobile
    ? stakingPositions
    : stakingPositions.slice(0, 1);
  const mobileVisiblePolicies = showAllPoliciesOnMobile
    ? insurancePolicies
    : insurancePolicies.slice(0, 1);
  const hiddenStakingCount = Math.max(stakingPositions.length - mobileVisibleStakingPositions.length, 0);
  const hiddenPolicyCount = Math.max(insurancePolicies.length - mobileVisiblePolicies.length, 0);

  return (
    <section className={className}>
      <div className="rounded-[18px] border border-[#d4aa4b]/18 bg-[linear-gradient(180deg,rgba(32,26,18,0.92),rgba(12,12,13,0.96))] px-5 py-4 text-[13px] text-zinc-300 md:px-6">
        <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#d5a14e]">INSURANCE COVERAGE</p>
        <p className="mt-3 leading-7 text-zinc-300">
          {lang === "cn"
            ? "质押、投保、保单生成与赔付状态管理在同一页面完成，具体承保、清结算与链上执行以正式市场规则为准。"
            : "Staking, insurance selection, policy creation, and payout status management are handled in one flow. Coverage, settlement, and on-chain execution are subject to final market rules."}
        </p>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.02fr_1.18fr]">
        <section className="overflow-hidden rounded-[18px] border border-white/8 bg-[#0d0d0e]">
          <div className="flex items-center justify-between gap-4 border-b border-white/8 px-5 py-4 md:px-6">
            <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-white md:text-[22px]">
              {lang === "cn" ? "我的质押记录" : "My Staking Positions"}
            </h3>
            <span className="inline-flex shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[12px] text-zinc-400">
              {stakingPositions.length}
            </span>
          </div>
          <div className="space-y-3 px-5 py-5 md:hidden">
            {stakingPositions.length === 0 ? (
              <div className="rounded-[14px] border border-white/8 bg-white/[0.02] px-4 py-6 text-sm text-zinc-500">
                {lang === "cn" ? "暂无质押记录" : "No staking positions yet."}
              </div>
            ) : (
              <>
                {mobileVisibleStakingPositions.map((position) => (
                  <StakingPositionCard key={position.positionId} lang={lang} position={position} />
                ))}
                {hiddenStakingCount > 0 ? (
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.03] px-4 py-3 text-[13px] font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.05]"
                    onClick={() => setShowAllStakingOnMobile((prev) => !prev)}
                  >
                    <span>
                      {showAllStakingOnMobile
                        ? lang === "cn"
                          ? "收起记录"
                          : "Collapse"
                        : lang === "cn"
                          ? `展开其余 ${hiddenStakingCount} 条`
                          : `Show ${hiddenStakingCount} More`}
                    </span>
                    <ChevronDown
                      className={`size-4 transition-transform ${showAllStakingOnMobile ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : null}
              </>
            )}
          </div>
          <div className="hidden space-y-3 px-6 py-5 md:block">
            {stakingPositions.length === 0 ? (
              <div className="rounded-[14px] border border-white/8 bg-white/[0.02] px-4 py-6 text-sm text-zinc-500">
                {lang === "cn" ? "暂无质押记录" : "No staking positions yet."}
              </div>
            ) : (
              stakingPositions.map((position) => (
                <StakingPositionCard key={position.positionId} lang={lang} position={position} />
              ))
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-[18px] border border-white/8 bg-[#0d0d0e]">
          <div className="flex items-center justify-between gap-4 border-b border-white/8 px-5 py-4 md:px-6">
            <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-white md:text-[22px]">
              {lang === "cn" ? "我的保单记录" : "My Insurance Policies"}
            </h3>
            <span className="inline-flex shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[12px] text-zinc-400">
              {insurancePolicies.length}
            </span>
          </div>
          <div className="space-y-4 px-5 py-5 md:hidden">
            {insurancePolicies.length === 0 ? (
              <div className="rounded-[14px] border border-white/8 bg-white/[0.02] px-4 py-6 text-sm text-zinc-500">
                {lang === "cn" ? "暂无保单记录" : "No insurance policies yet."}
              </div>
            ) : (
              <>
                {mobileVisiblePolicies.map((policy) => (
                  <PolicyCard
                    key={policy.policyId}
                    lang={lang}
                    policy={policy}
                    event={eventMap[policy.policyId]}
                    onScenarioChange={setPolicyScenario}
                  />
                ))}
                {hiddenPolicyCount > 0 ? (
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.03] px-4 py-3 text-[13px] font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.05]"
                    onClick={() => setShowAllPoliciesOnMobile((prev) => !prev)}
                  >
                    <span>
                      {showAllPoliciesOnMobile
                        ? lang === "cn"
                          ? "收起保单"
                          : "Collapse"
                        : lang === "cn"
                          ? `展开其余 ${hiddenPolicyCount} 条`
                          : `Show ${hiddenPolicyCount} More`}
                    </span>
                    <ChevronDown
                      className={`size-4 transition-transform ${showAllPoliciesOnMobile ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : null}
              </>
            )}
          </div>
          <div className="hidden space-y-4 px-6 py-5 md:block">
            {insurancePolicies.length === 0 ? (
              <div className="rounded-[14px] border border-white/8 bg-white/[0.02] px-4 py-6 text-sm text-zinc-500">
                {lang === "cn" ? "暂无保单记录" : "No insurance policies yet."}
              </div>
            ) : (
              insurancePolicies.map((policy) => {
                return (
                  <PolicyCard
                    key={policy.policyId}
                    lang={lang}
                    policy={policy}
                    event={eventMap[policy.policyId]}
                    onScenarioChange={setPolicyScenario}
                  />
                );
              })
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

function StakingPositionCard({
  lang,
  position,
}: {
  lang: "cn" | "en";
  position: StakingPosition;
}) {
  return (
    <article className="rounded-[16px] border border-white/8 bg-[#121213] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] uppercase tracking-[0.14em] text-zinc-500">
            {formatDemoId(position.positionId)}
          </p>
          <h4 className="mt-2 text-[18px] font-semibold tracking-[-0.03em] text-white md:text-[20px]">
            {position.assetSymbol}
          </h4>
          <p className="mt-1 text-[13px] text-zinc-500">{position.assetName}</p>
        </div>
        <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[12px] text-zinc-300">
          {position.hasInsurance
            ? lang === "cn"
              ? "已质押 / 已投保"
              : "Staked / Insured"
            : lang === "cn"
              ? "已质押"
              : "Staked"}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <MetricItem
          label={lang === "cn" ? "质押数量" : "Units"}
          value={position.stakedUnits.toFixed(4)}
        />
        <MetricItem
          label={lang === "cn" ? "质押价值" : "Value"}
          value={`$ ${position.stakedValue.toFixed(2)}`}
        />
      </div>

      <div className="mt-4 rounded-[12px] border border-white/8 bg-black/20 px-3 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[12px] text-zinc-500">
            {lang === "cn" ? "创建时间" : "Created"}
          </span>
          <span className="text-[12px] text-zinc-400">{position.createdAt}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[12px] text-zinc-500">
            {lang === "cn" ? "仓位编号" : "Position ID"}
          </span>
          <span
            className="max-w-full truncate font-mono text-[12px] text-zinc-400"
            title={position.positionId}
          >
            {position.positionId}
          </span>
        </div>
      </div>
    </article>
  );
}

function PolicyCard({
  lang,
  policy,
  event,
  onScenarioChange,
}: {
  lang: "cn" | "en";
  policy: InsurancePolicy;
  event?: DefaultEvent;
  onScenarioChange: (policyId: string, scenario: DemoPayoutScenario) => void;
}) {
  const statusCopy = getInsuranceStatusText(policy.policyStatus, lang);

  return (
    <article className="rounded-[16px] border border-white/8 bg-[#121213] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] uppercase tracking-[0.14em] text-zinc-500">
            {formatDemoId(policy.policyId)}
          </p>
          <h4 className="mt-2 text-[18px] font-semibold tracking-[-0.03em] text-white md:text-[20px]">
            {policy.assetSymbol}
          </h4>
          <p className="mt-1 truncate text-[13px] text-zinc-500" title={policy.positionId}>
            {lang === "cn" ? `关联质押仓位：${policy.positionId}` : `Position: ${policy.positionId}`}
          </p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[12px] ${statusCopy.toneClass}`}>
          {statusCopy.label}
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-[13px] text-zinc-300 sm:grid-cols-2 xl:grid-cols-3">
        <MetricItem label={lang === "cn" ? "投保数量" : "Insured Units"} value={policy.insuredUnits.toFixed(4)} />
        <MetricItem label={lang === "cn" ? "保险档位" : "Coverage Ratio"} value={`${policy.coverageRatio}%`} />
        <MetricItem label={lang === "cn" ? "保障额度" : "Coverage Amount"} value={`$ ${policy.coverageAmount.toFixed(2)}`} />
        <MetricItem label={lang === "cn" ? "已付保费" : "Premium Paid"} value={`$ ${policy.premiumPaid.toFixed(2)}`} />
        <MetricItem label={lang === "cn" ? "生效时间" : "Effective At"} value={policy.effectiveAt} />
        <MetricItem label={lang === "cn" ? "到期时间" : "Expire At"} value={policy.expireAt} />
      </div>

      <div className="mt-4 rounded-[14px] border border-white/8 bg-black/20 px-4 py-3">
        <p className="text-[12px] uppercase tracking-[0.14em] text-zinc-500">
          {lang === "cn" ? "赔付状态管理" : "Payout Status"}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {DEMO_PAYOUT_SCENARIOS.map((scenario) => {
            const active =
              scenario === "normal"
                ? policy.policyStatus === "covering" || policy.policyStatus === "pending_activation"
                : policy.policyStatus === scenario;
            return (
              <button
                key={`${policy.policyId}-${scenario}`}
                type="button"
                className={`rounded-full border px-3 py-1.5 text-center text-[12px] transition ${
                  active
                    ? "border-[#dcb254] bg-[#dcb254]/14 text-[#f1cf82]"
                    : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20"
                }`}
                onClick={() => onScenarioChange(policy.policyId, scenario)}
              >
                {lang === "cn" ? DEMO_SCENARIO_LABELS[scenario].cn : DEMO_SCENARIO_LABELS[scenario].en}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[12px] leading-6 text-zinc-500">
          {event
            ? lang === "cn"
              ? `${event.noteCn} (${event.triggeredAt})`
              : `${event.noteEn} (${event.triggeredAt})`
            : lang === "cn"
              ? "当前处于正常保障状态，可切换上方按钮查看不同赔付阶段。"
              : "Policy is in normal coverage status. Switch the buttons above to review payout stages."}
        </p>
      </div>
    </article>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-2.5">
      <p className="text-zinc-500">{label}</p>
      <p className="mt-1 text-[14px] font-medium text-white">{value}</p>
    </div>
  );
}

function formatDemoId(id: string) {
  if (id.length <= 18) return id;
  return `${id.slice(0, 10)}...${id.slice(-6)}`;
}
