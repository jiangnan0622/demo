import type { Lang } from "@/projects/realrwa-demo/lib/realrwa-i18n";
import {
  INSURANCE_COVERAGE_OPTIONS,
  INSURANCE_POLICY_STATUS_FLOW,
  type InsuranceCoverageOption,
  type InsurancePolicyStatus,
} from "@/projects/realrwa-demo/lib/realrwa-insurance-types";

export { INSURANCE_COVERAGE_OPTIONS as INSURANCE_RATIO_LEVELS, INSURANCE_POLICY_STATUS_FLOW };
export type { InsuranceCoverageOption as InsuranceRatioLevel, InsurancePolicyStatus };

type InsuranceStatusCopy = {
  labelCn: string;
  labelEn: string;
  descriptionCn: string;
  descriptionEn: string;
  toneClass: string;
};

export const INSURANCE_STATUS_COPY: Record<InsurancePolicyStatus, InsuranceStatusCopy> = {
  not_insured: {
    labelCn: "未投保",
    labelEn: "Not Insured",
    descriptionCn: "当前尚未建立保险保单，仅保留资产持仓或质押头寸。",
    descriptionEn: "No insurance policy is attached to the current position yet.",
    toneClass: "text-zinc-400 border-white/12 bg-white/[0.03]",
  },
  pending_activation: {
    labelCn: "未生效",
    labelEn: "Pending Activation",
    descriptionCn: "质押与投保已提交，保单将在下一结算周期后生效。",
    descriptionEn: "Stake plus insurance is submitted and will activate in the next settlement cycle.",
    toneClass: "text-amber-200 border-amber-300/25 bg-amber-500/10",
  },
  covering: {
    labelCn: "保障中",
    labelEn: "Covering",
    descriptionCn: "保障已生效，当前覆盖底层债券/债权违约风险。",
    descriptionEn: "Coverage is active for bond-credit default risk.",
    toneClass: "text-sky-300 border-sky-400/30 bg-sky-500/10",
  },
  payout_triggered: {
    labelCn: "已触发赔付",
    labelEn: "Payout Triggered",
    descriptionCn: "已收到违约触发信号，保单进入赔付队列等待处理。",
    descriptionEn: "A default event has been triggered and the policy is queued for payout.",
    toneClass: "text-amber-300 border-amber-400/30 bg-amber-500/10",
  },
  partial_payout: {
    labelCn: "部分赔付中",
    labelEn: "Partial Payout",
    descriptionCn: "保险池正在按赔付优先级执行分批赔付。",
    descriptionEn: "The insurance pool is processing partial payout by priority.",
    toneClass: "text-orange-300 border-orange-400/30 bg-orange-500/10",
  },
  payout_completed: {
    labelCn: "已完成赔付",
    labelEn: "Payout Completed",
    descriptionCn: "赔付已完成，保单进入结案阶段。",
    descriptionEn: "Payout has completed and the policy is settled.",
    toneClass: "text-teal-300 border-teal-400/30 bg-teal-500/10",
  },
  expired: {
    labelCn: "已到期",
    labelEn: "Expired",
    descriptionCn: "保障周期已结束，后续不再继续提供保险覆盖。",
    descriptionEn: "Coverage period ended and no further protection applies.",
    toneClass: "text-zinc-300 border-zinc-500/35 bg-zinc-800/60",
  },
  invalid: {
    labelCn: "已失效",
    labelEn: "Invalid",
    descriptionCn: "当前项目未开放保险服务或保单已失效。",
    descriptionEn: "Insurance is unavailable for this asset or the policy became invalid.",
    toneClass: "text-zinc-300 border-zinc-500/35 bg-zinc-800/60",
  },
};

export const INSURANCE_FAQ_ITEMS = [
  {
    questionCn: "保险池资金从哪里来？",
    questionEn: "Where does the insurance capital come from?",
    answerCn:
      "保险池展示为由协议储备、历史保费与储备策略收益共同构成；具体资金结构、承保范围与清结算规则以正式市场条款为准。",
    answerEn:
      "The pool is shown as funded by protocol reserve, historical premiums, and reserve yield. Final capital structure, coverage scope, and settlement rules are subject to market terms.",
  },
  {
    questionCn: "什么情况下会看到赔付状态变化？",
    questionEn: "When do payout states change?",
    answerCn:
      "保单状态会根据违约触发、赔付处理中、赔付完成等阶段更新，用于呈现保障流程中的关键节点。",
    answerEn:
      "Policy status updates across default triggered, partial payout, and payout completed stages to show key points in the coverage flow.",
  },
  {
    questionCn: "保险保障的风险范围是什么？",
    questionEn: "What risk does the coverage protect against?",
    answerCn:
      "保险模块聚焦底层债券/债权违约风险保障，不覆盖市场价格波动，也不构成保本承诺。",
    answerEn:
      "The insurance module focuses on bond-credit default risk coverage only. It does not cover market price volatility or promise principal protection.",
  },
  {
    questionCn: "为什么不同项目的保险参数不同？",
    questionEn: "Why do insurance parameters differ by asset?",
    answerCn:
      "每个资产都有独立的保险配置，包括评级、风险等级、剩余承保额度和赔付优先级，页面会按具体项目展示对应参数。",
    answerEn:
      "Each asset has its own insurance configuration, including rating, risk level, remaining quota, and payout priority. The page displays parameters by asset.",
  },
] as const;

export function getInsuranceStatusText(status: InsurancePolicyStatus, lang: Lang) {
  const copy = INSURANCE_STATUS_COPY[status];
  return {
    label: lang === "cn" ? copy.labelCn : copy.labelEn,
    description: lang === "cn" ? copy.descriptionCn : copy.descriptionEn,
    toneClass: copy.toneClass,
  };
}

export function formatCoverageRatioLabel(ratio: InsuranceCoverageOption) {
  return `${ratio}%`;
}
