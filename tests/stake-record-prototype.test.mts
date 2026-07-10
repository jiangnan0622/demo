import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { stakeRecordColumns, stakeRecordRows, stakeRecordSummary } from "../src/projects/market-making-demo/data/stake-record-prototype.ts";

test("质押记录原型使用截图中的摘要与字段", () => {
  assert.deepEqual(stakeRecordColumns, ["Staking地址", "邮箱", "Staking币种", "数量", "Hash", "质押时间"]);
  assert.deepEqual(stakeRecordSummary, { total: "120,441.5", unit: "USDC", addressCount: "18" });
  assert.equal(stakeRecordRows.length, 10);
  assert.deepEqual(stakeRecordRows[0], {
    address: "0x7946...1fcC",
    email: "li_...@hotmail.com",
    token: "rFUIDL",
    amount: "6,363",
    hash: "0xccca...287afa",
    stakedAt: "2026-07-06 23:13:45",
  });
});

test("质押记录页面显示筛选文案、统计卡与总条数", () => {
  const pageSource = readFileSync("src/projects/market-making-demo/components/backend-standard-pages.tsx", "utf8");

  for (const label of ["RWA资产", "开始时间", "结束时间", "邮箱", "展开", "Staking总额", "Staking地址数", "共 119 条"]) {
    assert.match(pageSource, new RegExp(label));
  }
});
