export type Lang = "cn" | "en";

export const rwaText = {
  cn: {
    nav: ["市场", "交易", "代币化", "质押", "文档", "关于", "邀请"],
    language: "简体中文",
    connectWallet: "连接钱包",
    portfolio: "我的投资组合",
    disconnect: "断开连接",
    tokenBalance: "Token余额",
    myOrders: "我的订单",
    tradeOrders: "交易订单",
    stakeOrders: "质押订单",
    lendingOrders: "借贷订单",
    buy: "购买",
    stake: "质押",
    redeem: "赎回",
    details: "详情",
    cancel: "取消",
    confirm: "确定",
  },
  en: {
    nav: ["Market", "Trade", "Tokenized", "Staking", "Documents", "About", "Referrals"],
    language: "English",
    connectWallet: "Connect Wallet",
    portfolio: "My Portfolio",
    disconnect: "Disconnect",
    tokenBalance: "Token Balance",
    myOrders: "My Orders",
    tradeOrders: "Trade Orders",
    stakeOrders: "Stake Orders",
    lendingOrders: "Lending Orders",
    buy: "Buy",
    stake: "Stake",
    redeem: "Redeem",
    details: "Details",
    cancel: "Cancel",
    confirm: "Confirm",
  },
} as const;

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
