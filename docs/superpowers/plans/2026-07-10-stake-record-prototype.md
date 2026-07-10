# 质押记录原型 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让后台质押记录页准确呈现参考图中的筛选、统计与质押流水字段。

**Architecture:** 在现有 `StakeRecordPage` 内使用专属的静态行数据和页面布局，不改变共享的通用表格与其他后台页面。为字段与样例数据建立一个小型可测试配置模块；页面只消费该配置并承载视觉样式。

**Tech Stack:** Next.js 16、React 19、TypeScript、Tailwind CSS、lucide-react、Node 内置 test runner。

## Global Constraints

- 只修改 `src/projects/market-making-demo` 与对应后台路由消费的代码。
- 不接入接口，不修改前台 `realrwa-demo` 模块。
- 路由保持为 `/backEnd/stakeManagement/stakeRecord`。
- 参考图字段固定为 RWA 资产、时间、邮箱、Staking 总额、Staking 地址数和六列表格。

---

### Task 1: 建立质押记录的静态数据契约

**Files:**
- Create: `src/projects/market-making-demo/data/stake-record-prototype.ts`
- Create: `tests/stake-record-prototype.test.mts`

**Interfaces:**
- Produces: `stakeRecordColumns: readonly string[]`，供页面表头使用。
- Produces: `stakeRecordRows: readonly StakeRecordRow[]`，供页面表格使用。
- Produces: `stakeRecordSummary`，包含 `total: "120,441.5"`、`unit: "USDC"` 与 `addressCount: "18"`。

- [ ] **Step 1: 写入会失败的数据契约测试**

```ts
import test from "node:test";
import assert from "node:assert/strict";

import { stakeRecordColumns, stakeRecordRows, stakeRecordSummary } from "../src/projects/market-making-demo/data/stake-record-prototype";

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
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test --experimental-strip-types tests/stake-record-prototype.test.mts`

Expected: FAIL，原因是 `stake-record-prototype.ts` 尚不存在。

- [ ] **Step 3: 创建最小静态数据模块**

```ts
export type StakeRecordRow = {
  address: string;
  email: string;
  token: string;
  amount: string;
  hash: string;
  stakedAt: string;
};

export const stakeRecordColumns = ["Staking地址", "邮箱", "Staking币种", "数量", "Hash", "质押时间"] as const;
export const stakeRecordSummary = { total: "120,441.5", unit: "USDC", addressCount: "18" } as const;
export const stakeRecordRows: readonly StakeRecordRow[] = [
  { address: "0x7946...1fcC", email: "li_...@hotmail.com", token: "rFUIDL", amount: "6,363", hash: "0xccca...287afa", stakedAt: "2026-07-06 23:13:45" },
  { address: "0x7946...1fcC", email: "li_...@hotmail.com", token: "rFUIDL", amount: "35,000", hash: "0xac3f...3d75b8", stakedAt: "2026-07-06 16:08:34" },
  { address: "0x31ad...f7b5", email: "744...@qq.com", token: "rFUIDL", amount: "2", hash: "0xbb7b...0da7f1", stakedAt: "2026-07-01 14:01:39" },
];
```

添加其余七条参考图中的 `rSDCT` 行，保持 `StakeRecordRow` 的六个字段完整。

- [ ] **Step 4: 运行测试确认通过**

Run: `node --test --experimental-strip-types tests/stake-record-prototype.test.mts`

Expected: PASS，且 10 条数据、摘要和六个表头均匹配测试。

- [ ] **Step 5: 提交数据契约**

```bash
git add src/projects/market-making-demo/data/stake-record-prototype.ts tests/stake-record-prototype.test.mts
git commit -m "feat: add stake record prototype data"
```

### Task 2: 按参考图重建质押记录页面

**Files:**
- Modify: `src/projects/market-making-demo/components/backend-standard-pages.tsx:286-306`
- Modify: `tests/stake-record-prototype.test.mts`

**Interfaces:**
- Consumes: Task 1 的 `stakeRecordColumns`、`stakeRecordRows`、`stakeRecordSummary`。
- Produces: `StakeRecordPage()`，在既有后台壳内显示截图样式的质押记录原型。

- [ ] **Step 1: 扩展失败测试，锁定页面要求**

```ts
import { readFileSync } from "node:fs";

test("质押记录页面显示筛选文案、统计卡与总条数", () => {
  const pageSource = readFileSync("src/projects/market-making-demo/components/backend-standard-pages.tsx", "utf8");
  for (const label of ["RWA资产", "开始时间", "结束时间", "邮箱", "展开", "Staking总额", "Staking地址数", "共 119 条"]) {
    assert.match(pageSource, new RegExp(label));
  }
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test --experimental-strip-types tests/stake-record-prototype.test.mts`

Expected: FAIL，因为当前 `StakeRecordPage` 没有 `Staking总额`、`Staking地址数`、`展开` 和 `共 119 条`。

- [ ] **Step 3: 最小化替换 `StakeRecordPage`**

```tsx
<div className="space-y-4">
  <div className="rounded-[8px] border border-[#eceff5] bg-white px-5 py-4">{/* RWA资产、时间、邮箱、展开、重置、查询 */}</div>
  <div className="grid grid-cols-2 gap-4 rounded-[8px] border border-[#e5edf9] bg-[#f1f6ff] p-5">{/* 两张统计卡 */}</div>
  <div className="rounded-[8px] border border-[#eceff5] bg-white p-5">{/* 六列表格与自定义分页 */}</div>
</div>
```

页面使用 Task 1 的数据，地址和 Hash 通过现有 `TextLink` 呈现为蓝色链接。筛选区采用标签加控件的横向布局，时间框使用现有 `Calendar` 图标；表头没有额外标题行，页脚显示 `共 119 条`、1 至 5、`…`、12、`10 条/页` 和跳页输入框。保留 `BackendConsoleShell` 已提供的面包屑与高亮状态。

- [ ] **Step 4: 运行回归测试和生产构建**

Run: `node --test --experimental-strip-types tests/stake-record-prototype.test.mts && pnpm build`

Expected: 测试 PASS，Next.js 构建成功且没有 TypeScript 或 ESLint 错误。

- [ ] **Step 5: 浏览器验收本地路由**

访问 `http://localhost:3000/backEnd/stakeManagement/stakeRecord`，检查面包屑、筛选区、两张浅蓝统计卡、六列表格、蓝色地址/Hash 链接和“共 119 条”分页都可见；确认侧栏“质押记录”高亮。

- [ ] **Step 6: 提交页面实现**

```bash
git add src/projects/market-making-demo/components/backend-standard-pages.tsx tests/stake-record-prototype.test.mts
git commit -m "feat: recreate stake record prototype"
```
