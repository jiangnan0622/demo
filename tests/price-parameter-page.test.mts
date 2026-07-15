import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { priceParameterColumns, priceParameterRecords, priceParameterSummary } from "../src/projects/market-making-demo/data/price-parameter-prototype.ts";

test("价格参数原型保留接口返回的价格记录与汇总", () => {
  assert.deepEqual(priceParameterColumns, ["价格日期", "价格", "币种", "最新价格更新时间", "操作"]);
  assert.deepEqual(priceParameterSummary, {
    latestPrice: "1.0000000000",
    currency: "USD",
    latestPriceDate: "2026-07-14",
    latestUpdateTime: "2026-07-15 09:01:12",
    total: 65,
  });
  assert.deepEqual(priceParameterRecords[0], {
    priceDate: "2026-07-14",
    price: "1.0000000000",
    currency: "USD",
    latestPriceUpdateTime: "2026-07-15 09:01:12",
  });
});

test("价格参数页面和后台导航均已就绪", () => {
  const pageSource = readFileSync("src/projects/market-making-demo/components/price-parameter-page.tsx", "utf8");
  const shellSource = readFileSync("src/projects/market-making-demo/components/backend-console-shell.tsx", "utf8");

  for (const label of ["价格参数", "上报价格", "价格日期", "最新价格更新时间", "共 {priceParameterSummary.total} 条"]) {
    assert.match(pageSource, new RegExp(label));
  }
  assert.match(shellSource, /price-parameter/);
  assert.match(shellSource, /\/backEnd\/assetManagement\/priceParameter/);
});
