"use client";

import { Shield, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  calculateCoverageAmountUsd1,
  calculatePremiumAmountUsd1,
  getPremiumRateByCoverage,
} from "@/projects/realrwa-demo/lib/realrwa-insurance-calculations";
import type { Lang } from "@/projects/realrwa-demo/lib/realrwa-i18n";
import {
  INSURANCE_POLICY_STATUS_FLOW,
  getInsuranceStatusText,
} from "@/projects/realrwa-demo/lib/realrwa-insurance";
import type {
  InsuranceCoverageOption,
  InsurancePolicyStatus,
  InsuranceProjectSnapshot,
} from "@/projects/realrwa-demo/lib/realrwa-insurance-types";

type InsuranceStatusRailProps = {
  lang: Lang;
  activeStatus: InsurancePolicyStatus;
};

type InsuranceProjectCardProps = {
  lang: Lang;
  project: InsuranceProjectSnapshot;
  unitPriceUsd1: number;
  previewUnits?: number;
  previewRatio?: InsuranceCoverageOption;
  actionLabel?: string;
  onAction?: () => void;
  hideAction?: boolean;
  compact?: boolean;
};

export function InsuranceStatusRail({ lang, activeStatus }: InsuranceStatusRailProps) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-[#0c0c0d] p-4 md:p-5">
      <h3 className="text-[18px] font-semibold text-white">
        {lang === "cn" ? "保单状态流程" : "Policy Status Flow"}
      </h3>
      <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {INSURANCE_POLICY_STATUS_FLOW.map((status) => {
          const copy = getInsuranceStatusText(status, lang);
          const isActive = status === activeStatus;
          return (
            <div
              key={status}
              className={`rounded-[12px] border px-3 py-2.5 text-[13px] ${
                isActive
                  ? "border-[#e8c15d] bg-[#e8c15d]/15 text-[#f4d680]"
                  : "border-white/8 bg-white/[0.02] text-zinc-400"
              }`}
            >
              <p className="font-medium">{copy.label}</p>
              <p className="mt-1 text-[12px] leading-5 text-zinc-500">{copy.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function InsuranceProjectCard({
  lang,
  project,
  unitPriceUsd1,
  previewUnits,
  previewRatio,
  actionLabel,
  onAction,
  hideAction = false,
  compact = false,
}: InsuranceProjectCardProps) {
  const insuredUnits = Number.isFinite(previewUnits) && Number(previewUnits) > 0
    ? Number(previewUnits)
    : 1;
  const selectedRatio = previewRatio ?? project.defaultCoverageRatio;
  const premiumRate = getPremiumRateByCoverage(project.premiumRateMap, selectedRatio);
  const coverageAmountUsd1 = calculateCoverageAmountUsd1(insuredUnits, unitPriceUsd1, selectedRatio);
  const premiumUsd1 = calculatePremiumAmountUsd1(coverageAmountUsd1, premiumRate);
  const statusCopy = getInsuranceStatusText(project.currentStatus, lang);

  return (
    <article className="rounded-[24px] border border-white/10 bg-[linear-gradient(130deg,rgba(14,14,14,0.97),rgba(25,21,15,0.92)_62%,rgba(54,42,20,0.25)_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[12px] uppercase tracking-[0.18em] text-zinc-500">{project.assetSymbol}</p>
          <h3 className={`mt-2 font-semibold tracking-[-0.03em] text-white ${compact ? "text-[24px]" : "text-[28px]"}`}>
            {lang === "cn" ? project.assetNameCn : project.assetNameEn}
          </h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[12px] ${statusCopy.toneClass}`}>
          {statusCopy.label}
        </span>
      </div>

      <div className={`mt-4 grid gap-3 ${compact ? "md:grid-cols-2" : "md:grid-cols-4"}`}>
        <InfoCell
          label={lang === "cn" ? "债券凭证信息" : "Bond Credential"}
          value={lang === "cn" ? project.bondCredentialCn : project.bondCredentialEn}
        />
        <InfoCell label={lang === "cn" ? "项目评级" : "Project Rating"} value={project.rating} />
        <InfoCell
          label={lang === "cn" ? "风险等级" : "Risk Level"}
          value={lang === "cn" ? project.riskLevelCn : project.riskLevelEn}
        />
        <InfoCell label={lang === "cn" ? "到期日" : "Expiry"} value={project.expireAt} />
      </div>

      <div className={`mt-4 rounded-[16px] border border-white/10 bg-black/20 p-4 ${compact ? "space-y-3" : "space-y-4"}`}>
        <div className="grid gap-2 text-[13px] text-zinc-300 md:grid-cols-4">
          <MetricCell
            label={lang === "cn" ? "保险档位" : "Coverage Ratio"}
            value={`${selectedRatio}%`}
          />
          <MetricCell
            label={lang === "cn" ? "保障额度" : "Coverage"}
            value={`$ ${coverageAmountUsd1.toFixed(2)}`}
          />
          <MetricCell
            label={lang === "cn" ? "预计保费" : "Premium"}
            value={`$ ${premiumUsd1.toFixed(2)}`}
          />
          <MetricCell
            label={lang === "cn" ? "剩余承保额度" : "Remaining Quota"}
            value={`$ ${project.remainingCoverageAmount.toFixed(2)}`}
          />
        </div>
      </div>

      <div className={`mt-4 grid gap-3 ${compact ? "" : "md:grid-cols-2"}`}>
        <ExplainCell
          title={lang === "cn" ? "赔付优先级说明" : "Payout Priority"}
          content={lang === "cn" ? project.priorityDescriptionCn : project.priorityDescriptionEn}
        />
        <ExplainCell
          title={lang === "cn" ? "保险池说明" : "Insurance Pool"}
          content={lang === "cn" ? project.insurancePoolDescriptionCn : project.insurancePoolDescriptionEn}
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-start gap-2 rounded-[12px] border border-amber-400/25 bg-amber-500/10 px-3 py-2 text-[12px] text-amber-200">
          <TriangleAlert className="mt-[2px] size-4 shrink-0" />
          <span>{lang === "cn" ? project.riskNoticeCn : project.riskNoticeEn}</span>
        </div>
        {hideAction ? null : project.insurable ? (
          <Button className="real-gold-btn h-11 rounded-[12px] px-6 text-[14px] font-semibold" onClick={onAction}>
            <Shield className="mr-2 size-4" />
            {actionLabel ?? (lang === "cn" ? "质押时投保" : "Insure While Staking")}
          </Button>
        ) : (
          <Button
            className="h-11 rounded-[12px] border border-white/14 bg-[#181818] px-6 text-[14px] font-semibold text-zinc-500"
            disabled
          >
            {lang === "cn" ? "当前项目暂不可投保" : "Insurance Unavailable"}
          </Button>
        )}
      </div>
    </article>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2.5">
      <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-1 text-[13px] leading-5 text-zinc-200">{value}</p>
    </div>
  );
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-white/8 bg-white/[0.03] px-3 py-2.5">
      <p className="text-zinc-500">{label}</p>
      <p className="mt-1 text-[16px] font-semibold tracking-[-0.02em] text-white">{value}</p>
    </div>
  );
}

function ExplainCell({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-[14px] border border-white/10 bg-[#121212] px-4 py-3">
      <p className="text-[13px] font-medium text-zinc-200">{title}</p>
      <p className="mt-1 text-[12px] leading-6 text-zinc-400">{content}</p>
    </div>
  );
}
