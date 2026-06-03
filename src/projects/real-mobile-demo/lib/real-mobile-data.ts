export const realMobileBasePath = "/real-mobile";

export type RealMobileProduct = {
  id: string;
  symbol: string;
  name: string;
  publisher: string;
  tags: string[];
  price: string;
  priceUnit: string;
  apr: string;
  rwaApr: string;
  realApr: string;
  soldAmount: number;
  totalSupply: number;
  soldLabel: string;
  totalLabel: string;
  issueDate: string;
  expireDate: string;
  minimum: string;
  marketCap: string;
  volume24h: string;
  cycle: string;
  bondSize: string;
  liquidity: string;
  managementScale: string;
  compensation: string;
  logoUrl: string;
  status: "selling" | "soldOut" | "presale" | "expired";
  description: string;
};

export type RouteItem = {
  label: string;
  path: string;
  group: "核心页面" | "交易流程" | "账户与邀请" | "Figma 状态";
};

export type TableRow = Record<string, string>;

export const realMobileProducts: RealMobileProduct[] = [
  {
    id: "xwct",
    symbol: "rXWCT",
    name: "标准债券-商家提供回购做市",
    publisher: "兴尉城市建设投资",
    tags: ["质押生息", "每日奖励"],
    price: "1.00",
    priceUnit: "1.00 USDC",
    apr: "10.05",
    rwaApr: "8.05",
    realApr: "2.00",
    soldAmount: 0,
    totalSupply: 3800000,
    soldLabel: "0M",
    totalLabel: "3.80M",
    issueDate: "2024年3月4日",
    expireDate: "2027年3月4日",
    minimum: "10.00 USDC",
    marketCap: "$4.68M",
    volume24h: "$128.60K",
    cycle: "3年",
    bondSize: "RMB 174.5M",
    liquidity: "每日可买卖",
    managementScale: "2亿美元+",
    compensation: "商家提供回购做市",
    logoUrl: "/tokens/eth-circle.svg",
    status: "selling",
    description:
      "标准企业债类 RWA 产品，通过链上凭证承载底层债券权益，并支持交易、质押、赎回和奖励领取等移动端操作。",
  },
  {
    id: "sdct",
    symbol: "rXWCT",
    name: "标准债券-商家提供回购做市",
    publisher: "商都城市建设投资",
    tags: ["质押生息", "每日奖励"],
    price: "1.00",
    priceUnit: "1.00 USDC",
    apr: "10.05",
    rwaApr: "8.05",
    realApr: "2.00",
    soldAmount: 1670000,
    totalSupply: 3800000,
    soldLabel: "1.67M",
    totalLabel: "3.80M",
    issueDate: "2024年3月4日",
    expireDate: "2027年3月4日",
    minimum: "10.00 USDC",
    marketCap: "$4.68M",
    volume24h: "$81.20K",
    cycle: "3年",
    bondSize: "RMB 480M",
    liquidity: "每日可买卖",
    managementScale: "2亿美元+",
    compensation: "商家提供回购做市",
    logoUrl: "/tokens/trx-circle.svg",
    status: "selling",
    description:
      "城投债券映射的链上产品，面向移动端用户展示认购池、发行机构、起购数量、发行日期与到期日期。",
  },
  {
    id: "fuidl",
    symbol: "rFUIDL",
    name: "复星财富控股-补贴iREAL积分",
    publisher: "BNY货币基金",
    tags: ["头部交易所认可抵押物"],
    price: "1.00",
    priceUnit: "1.00 USDC",
    apr: "10.05",
    rwaApr: "8.05",
    realApr: "2.00",
    soldAmount: 3800000,
    totalSupply: 3800000,
    soldLabel: "3.80M",
    totalLabel: "3.80M",
    issueDate: "2024年3月4日",
    expireDate: "2027年3月4日",
    minimum: "10.00 USDC",
    marketCap: "$3.80M",
    volume24h: "$62.80K",
    cycle: "99年",
    bondSize: "USD 20B+",
    liquidity: "每日可买卖",
    managementScale: "200亿美元+",
    compensation: "补贴 iREAL 积分",
    logoUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rFUIDL.png",
    status: "soldOut",
    description:
      "货币基金类 RWA 资产，强调美元流动性、透明度与受限二级流转能力。Figma 移动端稿件中展示为已售罄状态。",
  },
];

export const realMobileRoutes: RouteItem[] = [
  { label: "交易首页", path: "/trade", group: "核心页面" },
  { label: "市场", path: "/market", group: "核心页面" },
  { label: "订单", path: "/orders", group: "核心页面" },
  { label: "订单详情", path: "/orders/detail", group: "核心页面" },
  { label: "债券详情", path: "/coinDetail", group: "核心页面" },
  { label: "我的投资组合", path: "/myPortfolio", group: "核心页面" },
  { label: "Portfolio", path: "/portfolio", group: "核心页面" },
  { label: "购买", path: "/buy", group: "交易流程" },
  { label: "卖出", path: "/sell", group: "交易流程" },
  { label: "赎回", path: "/redeem", group: "交易流程" },
  { label: "领取奖励", path: "/claim", group: "交易流程" },
  { label: "质押", path: "/stake", group: "交易流程" },
  { label: "质押详情", path: "/stake/detail", group: "交易流程" },
  { label: "质押操作", path: "/stake/operate", group: "交易流程" },
  { label: "储备金", path: "/reserve", group: "交易流程" },
  { label: "保险", path: "/insurance", group: "交易流程" },
  { label: "借贷", path: "/lending", group: "交易流程" },
  { label: "借贷详情", path: "/lending/corporate-bond", group: "交易流程" },
  { label: "邀请", path: "/invite", group: "账户与邀请" },
  { label: "被邀请人详情", path: "/invite/detail", group: "账户与邀请" },
  { label: "佣金记录", path: "/invite/commission", group: "账户与邀请" },
  { label: "佣金详情", path: "/invite/commission/detail", group: "账户与邀请" },
  { label: "我的 - 未认证", path: "/my", group: "账户与邀请" },
  { label: "我的 - 已认证", path: "/my/verified", group: "账户与邀请" },
  { label: "认证", path: "/kyc", group: "账户与邀请" },
  { label: "预售登记", path: "/register", group: "账户与邀请" },
  { label: "搜索无结果", path: "/search-empty", group: "Figma 状态" },
  { label: "连接钱包", path: "/connect", group: "Figma 状态" },
  { label: "连接 MetaMask", path: "/connect/metamask", group: "Figma 状态" },
  { label: "初始化引导", path: "/onboarding", group: "Figma 状态" },
  { label: "无钱包购买", path: "/onboarding/buy", group: "Figma 状态" },
  { label: "结果页", path: "/result", group: "Figma 状态" },
];

export const realMobileOrders = [
  {
    id: "RF-20250529-001",
    type: "卖出",
    token: "rFUIDL",
    amount: "-100,000.0000",
    price: "1.00228 USDC",
    value: "100,228.00 USDC",
    status: "交易成功",
    time: "2026-05-29 16:24:16",
    address: "0x93A1...7E21",
  },
  {
    id: "RF-20250529-002",
    type: "购买",
    token: "rFUIDL",
    amount: "+210,000.0000",
    price: "1.00228 USDC",
    value: "210,478.80 USDC",
    status: "交易成功",
    time: "2026-05-29 16:19:46",
    address: "0x12F8...B90C",
  },
  {
    id: "RF-20250529-003",
    type: "卖出",
    token: "rFUIDL",
    amount: "-210,000.0000",
    price: "1.00228 USDC",
    value: "210,478.80 USDC",
    status: "交易成功",
    time: "2026-05-29 16:13:09",
    address: "0x8C44...A110",
  },
  {
    id: "RF-20250529-004",
    type: "购买",
    token: "rFUIDL",
    amount: "+210,000.0000",
    price: "1.00228 USDC",
    value: "210,478.80 USDC",
    status: "交易成功",
    time: "2026-05-29 16:12:24",
    address: "0x57A0...E21B",
  },
  {
    id: "RF-20250529-005",
    type: "购买",
    token: "rFUIDL",
    amount: "+210,000.0000",
    price: "1.00228 USDC",
    value: "210,478.80 USDC",
    status: "交易成功",
    time: "2026-05-29 16:06:33",
    address: "0x6BF2...812C",
  },
];

export const portfolioAssets = [
  { token: "rXWCT", balance: "12,420.00", value: "15,318.10 USDC", apr: "10.05%", reward: "128.72 REAL" },
  { token: "srXWCT", balance: "8,000.00", value: "8,000.00 R凭证", apr: "10.05%", reward: "86.44 REAL" },
  { token: "rFUIDL", balance: "1,000.00", value: "1,002.28 USDC", apr: "10.05%", reward: "12.90 iREAL" },
];

export const portfolioOverviewData = {
  totalAssetValue: "1.00M",
  totalAssetApprox: "≈ 1.00M USDC",
  availableAssetValue: "861.19K",
  availableAssetApprox: "≈ 861.37K USDC",
  irealBalance: "0.00",
  irealUnit: "iREAL",
};

export const portfolioHoldingRows = [
  {
    productId: "fuidl",
    token: "rFUIDL",
    subtitle: "rFUIDL",
    amount: "111000.000000",
    approx: "≈ 111000.000000000000 USDC",
    logoUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rFUIDL.png",
    detail: {
      stakingYield: "4.3000%",
      cumulativeReward: "0",
      cumulativeRewardApprox: "≈0.000000 USDC",
      yesterdayReward: "0.000000",
      yesterdayRewardApprox: "≈0.000000 USDC",
      availableBalance: "111000.000000",
      availableApprox: "≈111000.000000000000 USDC",
    },
  },
  {
    productId: "sdct",
    token: "rSDCT",
    subtitle: "rSDCT",
    amount: "27633.000000",
    approx: "≈ 27633.000000000000 USDC",
    logoUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rSDCT.png",
    detail: {
      stakingYield: "4.3000%",
      cumulativeReward: "0",
      cumulativeRewardApprox: "≈0.000000 USDC",
      yesterdayReward: "0.000000",
      yesterdayRewardApprox: "≈0.000000 USDC",
      availableBalance: "27633.000000",
      availableApprox: "≈27633.000000000000 USDC",
    },
  },
];

export const inviteeRows: TableRow[] = [
  { address: "0x93A1...7E21", quantity: "12,000", volume: "14,797.20 USDC", operation: "详情" },
  { address: "0x12F8...B90C", quantity: "8,500", volume: "10,481.35 USDC", operation: "详情" },
  { address: "0x8C44...A110", quantity: "2,200", volume: "2,712.82 USDC", operation: "详情" },
];

export const commissionRows: TableRow[] = [
  { date: "2026-06-01", type: "申购返佣", amount: "68.20 USD1", status: "已完成" },
  { date: "2026-05-30", type: "质押加成", amount: "2.00%", status: "已生效" },
  { date: "2026-05-28", type: "邀请奖励", amount: "42.18 REAL", status: "已完成" },
  { date: "2026-05-24", type: "申购返佣", amount: "58.80 USD1", status: "已完成" },
  { date: "2026-05-21", type: "质押加成", amount: "1.50%", status: "已到期" },
];

export const inviteSteps = [
  {
    title: "获取专属链接",
    desc: "连接钱包，一键生成您的专属邀请链接与多场景推广海报。",
  },
  {
    title: "好友申购资产",
    desc: "受邀好友通过您的链接完成注册，并成功申购 RWA 资产。",
  },
  {
    title: "达成合格门槛",
    desc: "当受邀好友的单人申购额达到合格标准，系统将自动锁定奖励。",
  },
  {
    title: "结算双重奖励",
    desc: "审核完成后，USD1 现金直达钱包，质押 APY 加成同步激活。",
  },
];

export const lendingRows = [
  { asset: "USDC", available: "120,000.00", apr: "6.20%", liquidity: "92%" },
  { asset: "rXWCT", available: "48,000.00", apr: "8.40%", liquidity: "76%" },
  { asset: "rFUIDL", available: "18,500.00", apr: "4.30%", liquidity: "88%" },
];

export const reserveRows = [
  { type: "USDC 储备", value: "1.28M", update: "2026-06-01 10:00" },
  { type: "赎回流动性", value: "640.00K", update: "2026-06-01 10:00" },
  { type: "风险准备金", value: "220.00K", update: "2026-06-01 10:00" },
];
