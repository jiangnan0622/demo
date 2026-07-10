export type StakeRecordRow = {
  address: string;
  email: string;
  token: string;
  amount: string;
  hash: string;
  stakedAt: string;
};

export const stakeRecordColumns = ["Staking地址", "邮箱", "Staking币种", "数量", "Hash", "质押时间"] as const;

export const stakeRecordSummary = {
  total: "120,441.5",
  unit: "USDC",
  addressCount: "18",
} as const;

export const stakeRecordRows: readonly StakeRecordRow[] = [
  { address: "0x7946...1fcC", email: "li_...@hotmail.com", token: "rFUIDL", amount: "6,363", hash: "0xccca...287afa", stakedAt: "2026-07-06 23:13:45" },
  { address: "0x7946...1fcC", email: "li_...@hotmail.com", token: "rFUIDL", amount: "35,000", hash: "0xac3f...3d75b8", stakedAt: "2026-07-06 16:08:34" },
  { address: "0x31ad...f7b5", email: "744...@qq.com", token: "rFUIDL", amount: "2", hash: "0xbb7b...0da7f1", stakedAt: "2026-07-01 14:01:39" },
  { address: "0xa6d5...9db0", email: "220...@qq.com", token: "rSDCT", amount: "1", hash: "0xb726...3c9b49", stakedAt: "2026-06-26 14:06:41" },
  { address: "0xa6d5...9db0", email: "220...@qq.com", token: "rSDCT", amount: "1", hash: "0x034d...ce6b07", stakedAt: "2026-06-26 14:05:54" },
  { address: "0xa6d5...9db0", email: "220...@qq.com", token: "rSDCT", amount: "1", hash: "0x9433...0015f6", stakedAt: "2026-06-26 14:02:25" },
  { address: "0xa6d5...9db0", email: "220...@qq.com", token: "rSDCT", amount: "1", hash: "0xb9b8...f28d1f", stakedAt: "2026-06-26 14:01:40" },
  { address: "0xa6d5...9db0", email: "220...@qq.com", token: "rSDCT", amount: "1", hash: "0x2598...d0374b", stakedAt: "2026-06-26 13:59:28" },
  { address: "0xa6d5...9db0", email: "220...@qq.com", token: "rSDCT", amount: "1", hash: "0xcf2e...fa3c77", stakedAt: "2026-06-26 13:57:49" },
  { address: "0xa6d5...9db0", email: "220...@qq.com", token: "rSDCT", amount: "1", hash: "0x1c36...21372d", stakedAt: "2026-06-26 13:57:22" },
];
