import type { Lang } from "@/lib/realrwa-i18n";

type BiText = {
  cn: string;
  en: string;
};

const bi = (cn: string, en: string): BiText => ({ cn, en });

export const feedbackCopy = {
  auth: {
    connected: bi("连接成功", "Wallet Connected"),
    signatureRejected: bi("用户取消签名", "Signature rejected"),
    regionBlocked: bi("服务在您所在的地区不可用", "Service unavailable in your region"),
    switchBsc: bi("请切换至 BSC 主网", "Please switch to BSC Mainnet"),
  },
  buy: {
    title: bi("购买", "Buy"),
    price: bi("价格", "Price"),
    amount: bi("数量", "Amount"),
    value: bi("价值", "Value"),
    max: bi("最大", "MAX"),
    available: bi("可用：", "Available: "),
    success: bi("认购成功", "Purchase Successful"),
    stakeNow: bi("立即质押当前资产", "Stake Now"),
    enterAmount: bi("请输入金额", "Enter an amount"),
    invalidNumber: bi("请输入有效数字", "Please enter a valid number"),
    minAmount: bi("最小购买额: 10 USD1", "Minimum purchase amount is 10 USD1"),
    maxDecimals: bi("超过最大精度（允许6位）", "Max decimals exceeded (6 allowed)"),
    insufficientBalance: bi("输入金额超出可用余额", "Amount exceeds available balance"),
  },
  stake: {
    title: bi("质押", "Stake"),
    amount: bi("数量", "Amount"),
    receive: bi("接收", "Receive"),
    summary: bi("接收", "Summary"),
    max: bi("最大", "MAX"),
    approve: bi("授权合约访问资产", "Approve contract to access asset"),
    processing: bi("正在铸造RToken...", "Activating Rewards..."),
    success: bi("质押成功！RToken 已到账", "Staking Successful! RToken Minted"),
    viewDashboard: bi("查看收益", "View Dashboard"),
    enterAmount: bi("请输入金额", "Enter an amount"),
    insufficientAvailable: bi("可用余额不足", "Insufficient available balance"),
  },
  claim: {
    title: bi("奖励", "Claim"),
    viewDashboard: bi("查看收益", "View Dashboard"),
    processing: bi("正在领取收益...", "Claiming Rewards..."),
    success: bi("收益领取成功", "Rewards claimed"),
  },
  redeem: {
    title: bi("赎回", "Redeem"),
    amount: bi("数量", "Amount"),
    receive: bi("接收", "Receive"),
    summary: bi("总结", "Summary"),
    max: bi("最大", "MAX"),
    viewBalance: bi("查看余额", "View Balance"),
    confirmBurn: bi("确认销毁 RToken 赎回本金?", "Confirm burn RToken to redeem?"),
    success: bi("赎回成功，本金已释放", "Redemption Successful"),
    enterAmount: bi("请输入金额", "Enter an amount"),
    insufficientAvailable: bi("可用余额不足", "Insufficient available balance"),
  },
  sell: {
    title: bi("卖出", "Sell"),
    amount: bi("数量", "Amount"),
    max: bi("最大", "MAX"),
    success: bi("卖出成功", "Sell Successful"),
    approve: bi("授权合约访问资产", "Approve contract to access asset"),
    enterAmount: bi("请输入金额", "Enter an amount"),
    invalidNumber: bi("请输入有效数字", "Please enter a valid number"),
    minAmount: bi("最小卖出额: 10 USD1", "Minimum sell amount is 10 USD1"),
    insufficientAvailable: bi("可用余额不足", "Insufficient available balance"),
  },
  withdraw: {
    title: bi("提现", "Withdraw"),
    max: bi("最大", "MAX"),
    confirmWithdraw: bi("确定提现", "Confirm"),
    minAmount: bi("最小提现额: 20 USD1", "Min withdrawal: 20 USD1"),
    riskWarning: bi("提现将停止产生收益，确定吗?", "Withdrawal stops yield generation."),
    success: bi("提现已汇出", "Withdrawal Sent"),
  },
  common: {
    cancel: bi("取消", "Cancel"),
    done: bi("完成", "Done"),
    thinkAgain: bi("再想想", "Back"),
    confirm: bi("确认", "Confirm"),
    viewPortfolio: bi("查看投资组合", "View Portfolio"),
    guide: bi("引导", "Guide"),
  },
} as const;

export function copyOf(lang: Lang, value: BiText) {
  return value[lang];
}
