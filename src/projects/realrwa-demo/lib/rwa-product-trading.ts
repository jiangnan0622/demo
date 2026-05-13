export type RwaTradeAction = "BUY" | "SELL";

export type RwaTradingRepeatRule = "NONE" | "MONTHLY_DAY" | "WEEKLY";

export type RwaTradingWindow = {
  year: string;
  month: string;
  weekday: string;
  day: string;
  startTime: string;
  endTime: string;
  repeatRule: RwaTradingRepeatRule;
};

export type RwaProductTradingConfig = {
  productId: string;
  productName: string;
  assetSymbol: string;
  timezone: string;
  timezoneLabel: string;
  buyCutoffTime: string;
  sellCutoffTime: string;
  tradingWindow: RwaTradingWindow;
  emergencyClosed: boolean;
  emergencyMessage: string;
  updatedAt: string;
};

export type RwaTradeTimingNotice = {
  kind: "AFTER_CUTOFF" | "OUTSIDE_TRADING_WINDOW" | "EMERGENCY_CLOSED";
  title: string;
  message: string;
  canContinue: boolean;
};

const STORAGE_KEY = "realrwa-demo-product-trading-config";

export const MELLON_RWA_PRODUCT_ID = "mellon-money-market-rbond";

export const DEFAULT_RWA_PRODUCT_TRADING_CONFIG: RwaProductTradingConfig = {
  productId: MELLON_RWA_PRODUCT_ID,
  productName: "梅陇货币基金 RWA（rFUIDL）",
  assetSymbol: "rFUIDL",
  timezone: "Europe/Luxembourg",
  timezoneLabel: "卢森堡时间（Europe/Luxembourg）",
  buyCutoffTime: "11:00",
  sellCutoffTime: "12:00",
  tradingWindow: {
    year: "2026",
    month: "05",
    weekday: "工作日",
    day: "06",
    startTime: "09:00",
    endTime: "16:00",
    repeatRule: "WEEKLY",
  },
  emergencyClosed: false,
  emergencyMessage: "当前产品已开启紧急休市，申购/赎回服务暂不可用。请关注后台恢复交易时段后再操作。",
  updatedAt: "2026-05-06 16:00:00",
};

export const RWA_TRADING_REPEAT_RULE_LABELS: Record<RwaTradingRepeatRule, string> = {
  NONE: "不重复",
  MONTHLY_DAY: "按每月当前日重复",
  WEEKLY: "按当前星期重复",
};

function formatDateTime(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function normalizeConfig(input: Partial<RwaProductTradingConfig> | null): RwaProductTradingConfig {
  const nextConfig = {
    ...DEFAULT_RWA_PRODUCT_TRADING_CONFIG,
    ...(input ?? {}),
    tradingWindow: {
      ...DEFAULT_RWA_PRODUCT_TRADING_CONFIG.tradingWindow,
      ...(input?.tradingWindow ?? {}),
    },
  };

  return {
    ...nextConfig,
    productId: MELLON_RWA_PRODUCT_ID,
    productName: DEFAULT_RWA_PRODUCT_TRADING_CONFIG.productName,
    assetSymbol: DEFAULT_RWA_PRODUCT_TRADING_CONFIG.assetSymbol,
    timezone: DEFAULT_RWA_PRODUCT_TRADING_CONFIG.timezone,
    timezoneLabel: DEFAULT_RWA_PRODUCT_TRADING_CONFIG.timezoneLabel,
  };
}

export function getRwaProductTradingConfig(): RwaProductTradingConfig {
  if (typeof window === "undefined") {
    return DEFAULT_RWA_PRODUCT_TRADING_CONFIG;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RWA_PRODUCT_TRADING_CONFIG));
    return DEFAULT_RWA_PRODUCT_TRADING_CONFIG;
  }

  try {
    return normalizeConfig(JSON.parse(raw) as Partial<RwaProductTradingConfig>);
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RWA_PRODUCT_TRADING_CONFIG));
    return DEFAULT_RWA_PRODUCT_TRADING_CONFIG;
  }
}

export function saveRwaProductTradingConfig(config: RwaProductTradingConfig): RwaProductTradingConfig {
  const nextConfig = normalizeConfig({
    ...config,
    updatedAt: formatDateTime(),
  });

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextConfig));
  }

  return nextConfig;
}

export function resetRwaProductTradingConfig() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RWA_PRODUCT_TRADING_CONFIG));
  }

  return DEFAULT_RWA_PRODUCT_TRADING_CONFIG;
}

function getLuxembourgTimeParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(date);

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  return { hour, minute };
}

function getLuxembourgTimezoneCopy(config: RwaProductTradingConfig, date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: config.timezone,
    timeZoneName: "shortOffset",
  }).formatToParts(date);
  const offset = parts.find((part) => part.type === "timeZoneName")?.value;
  return offset ? `卢森堡时间（${offset}）` : config.timezoneLabel;
}

function timeToMinutes(value: string) {
  const [hour = "0", minute = "0"] = value.split(":");
  return Number(hour) * 60 + Number(minute);
}

function isAfterCutoff(config: RwaProductTradingConfig, action: RwaTradeAction, date: Date) {
  const { hour, minute } = getLuxembourgTimeParts(date, config.timezone);
  const currentMinutes = hour * 60 + minute;
  const cutoffMinutes = timeToMinutes(action === "BUY" ? config.buyCutoffTime : config.sellCutoffTime);
  return currentMinutes > cutoffMinutes;
}

function isOutsideTradingWindow(config: RwaProductTradingConfig, date: Date) {
  const { hour, minute } = getLuxembourgTimeParts(date, config.timezone);
  const currentMinutes = hour * 60 + minute;
  const startMinutes = timeToMinutes(config.tradingWindow.startTime);
  const endMinutes = timeToMinutes(config.tradingWindow.endTime);
  return currentMinutes < startMinutes || currentMinutes > endMinutes;
}

export function evaluateRwaTradeTiming(
  config: RwaProductTradingConfig,
  action: RwaTradeAction,
  date = new Date()
): RwaTradeTimingNotice | null {
  if (config.emergencyClosed) {
    return {
      kind: "EMERGENCY_CLOSED",
      title: "提示",
      message: config.emergencyMessage,
      canContinue: false,
    };
  }

  if (isAfterCutoff(config, action, date)) {
    const cutoff = action === "BUY" ? config.buyCutoffTime : config.sellCutoffTime;
    const timezoneCopy = getLuxembourgTimezoneCopy(config, date);
    return {
      kind: "AFTER_CUTOFF",
      title: "提示",
      message:
        action === "BUY"
          ? `当前已过当日结算截点（${cutoff} ${timezoneCopy}）。您的申购订单将于下个工作日（T+1）完成结算并起息，预计 rBOND 凭证将于明日发放至您的账户。`
          : `当前已过当日赎回截点（${cutoff} ${timezoneCopy}）。您的申请已受理，稳定币预计将于下个工作日（T+1）到账。请注意：本笔资产从今日起将停止计算利息。`,
      canContinue: true,
    };
  }

  if (isOutsideTradingWindow(config, date)) {
    return {
      kind: "OUTSIDE_TRADING_WINDOW",
      title: "提示",
      message: `当前不在产品常规交易时段（${config.tradingWindow.startTime}-${config.tradingWindow.endTime} ${config.timezoneLabel}）。您的指令将进入待结算队列，后台恢复交易后按顺序处理。`,
      canContinue: true,
    };
  }

  return null;
}
