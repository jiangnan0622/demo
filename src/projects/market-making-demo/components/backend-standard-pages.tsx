"use client";

import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import { useGlobalFeedback } from "@/components/feedback/global-feedback-provider";

type TableRow = Record<string, ReactNode>;
type FilterField =
  | { type: "select"; placeholder: string; options: string[] }
  | { type: "input"; placeholder: string }
  | { type: "date"; placeholder?: string };

const rwaOptions = ["rFUIDL", "rXWCT", "rSDCT"];
const hashValue = "0xe512c4ce...845a2380de1c";

function StatCard({ title, value, unit }: { title: string; value: string; unit?: string }) {
  return (
    <div className="rounded-[8px] border border-[#dde7ff] bg-[#eef3ff] px-6 py-5">
      <p className="text-[13px] text-slate-600">{title}</p>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="text-[28px] font-semibold leading-none text-[#1f5bd8]">{value}</span>
        {unit ? <span className="text-[12px] text-[#1f5bd8]/70">{unit}</span> : null}
      </p>
    </div>
  );
}

function FilterBar({ placeholder = "地址" }: { placeholder?: string }) {
  const { showSuccessToast } = useGlobalFeedback();

  return (
    <div className="rounded-[8px] border border-[#eceff5] bg-white px-5 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <select className="h-9 w-[150px] rounded-[6px] border border-[#dcdfe6] bg-white px-3 text-[13px] text-slate-700 outline-none">
          <option>RWA 资产</option>
          <option>rFUIDL</option>
          <option>rXWCT</option>
          <option>rSDCT</option>
        </select>
        <div className="flex h-9 w-[240px] items-center gap-2 rounded-[6px] border border-[#dcdfe6] bg-white px-3 text-[13px] text-slate-400">
          <span>开始日期</span>
          <span>→</span>
          <span>结束日期</span>
          <Calendar className="ml-auto size-3.5" />
        </div>
        <input
          className="h-9 w-[220px] rounded-[6px] border border-[#dcdfe6] bg-white px-3 text-[13px] outline-none focus:border-[#1f5bd8]"
          placeholder={placeholder}
        />
        <div className="ml-auto flex items-center gap-2">
          <button type="button" className="h-9 rounded-[6px] border border-[#dcdfe6] bg-white px-5 text-[13px] text-slate-600 hover:bg-slate-50">
            重 置
          </button>
          <button type="button" className="h-9 rounded-[6px] bg-[#1f5bd8] px-5 text-[13px] font-medium text-white hover:bg-[#1a4fc1]">
            查 询
          </button>
          <button
            type="button"
            onClick={() => showSuccessToast("导出成功")}
            className="h-9 rounded-[6px] bg-[#1c9551] px-5 text-[13px] font-medium text-white hover:bg-[#168645]"
          >
            导 出
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  variant = "primary",
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const variantClass =
    disabled
      ? "cursor-not-allowed bg-slate-200 text-slate-400"
      : variant === "success"
      ? "bg-[#16a05d] text-white hover:bg-[#12894f]"
      : variant === "secondary"
        ? "border border-[#dcdfe6] bg-white text-slate-600 hover:bg-slate-50"
        : "bg-[#1f5bd8] text-white hover:bg-[#1a4fc1]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-9 rounded-[6px] px-5 text-[13px] font-medium ${variantClass}`}
    >
      {children}
    </button>
  );
}

function StandardFilterBar({
  fields,
  primaryAction,
  showExport = true,
}: {
  fields: FilterField[];
  primaryAction?: ReactNode;
  showExport?: boolean;
}) {
  const { showSuccessToast } = useGlobalFeedback();

  return (
    <div className="rounded-[8px] border border-[#eceff5] bg-white px-5 py-4">
      <div className="flex flex-wrap items-center gap-3">
        {fields.map((field, index) => {
          if (field.type === "date") {
            return (
              <div
                key={`${field.type}-${index}`}
                className="flex h-9 w-[250px] items-center gap-2 rounded-[6px] border border-[#dcdfe6] bg-white px-3 text-[13px] text-slate-400"
              >
                <span>开始日期</span>
                <span>→</span>
                <span>结束日期</span>
                <Calendar className="ml-auto size-3.5" />
              </div>
            );
          }

          if (field.type === "select") {
            return (
              <select
                key={`${field.type}-${index}`}
                className="h-9 w-[170px] rounded-[6px] border border-[#dcdfe6] bg-white px-3 text-[13px] text-slate-700 outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  {field.placeholder}
                </option>
                {field.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            );
          }

          return (
            <input
              key={`${field.type}-${index}`}
              className="h-9 w-[210px] rounded-[6px] border border-[#dcdfe6] bg-white px-3 text-[13px] outline-none focus:border-[#1f5bd8]"
              placeholder={field.placeholder}
            />
          );
        })}
        <div className="ml-auto flex items-center gap-2">
          <ActionButton variant="secondary">重 置</ActionButton>
          <ActionButton>查 询</ActionButton>
          {showExport ? (
            <ActionButton variant="success" onClick={() => showSuccessToast("导出成功")}>
              导 出
            </ActionButton>
          ) : null}
          {primaryAction}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "green" | "red" | "gray" | "orange" }) {
  const toneClass = {
    blue: "bg-[#eaf2ff] text-[#1f5bd8]",
    green: "bg-[#e9f8f1] text-[#159656]",
    red: "bg-[#fff1f0] text-[#d93026]",
    gray: "bg-slate-100 text-slate-500",
    orange: "bg-[#fff7e6] text-[#b86e00]",
  }[tone];

  return <span className={`inline-flex rounded-[4px] px-2 py-1 text-[12px] font-medium ${toneClass}`}>{children}</span>;
}

function TextLink({ children }: { children: ReactNode }) {
  return <span className="cursor-pointer text-[#1f5bd8] hover:underline">{children}</span>;
}

function Pagination({ total }: { total: number }) {
  return (
    <div className="flex items-center justify-end gap-3 text-[13px] text-slate-600">
      <span>共 {total} 条</span>
      <button type="button" className="grid size-7 place-items-center rounded-[4px] text-slate-400 hover:bg-slate-100">
        <ChevronLeft className="size-3.5" />
      </button>
      <span className="grid size-7 place-items-center rounded-[4px] border border-[#1f5bd8] text-[#1f5bd8]">1</span>
      <button type="button" className="grid size-7 place-items-center rounded-[4px] text-slate-400 hover:bg-slate-100">
        <ChevronRight className="size-3.5" />
      </button>
      <button type="button" className="flex h-7 items-center gap-1 rounded-[4px] border border-[#dcdfe6] bg-white px-2 text-slate-600">
        10 条/页
        <ChevronDown className="size-3" />
      </button>
    </div>
  );
}

function BackendTable({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: TableRow[];
}) {
  return (
    <div className="rounded-[8px] border border-[#eceff5] bg-white">
      <div className="border-b border-[#eceff5] px-5 py-3 text-[13px] font-medium text-slate-700">{title}</div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-[13px]">
          <thead className="bg-[#fafbfd] text-left text-slate-500">
            <tr>
              {columns.map((title) => (
                <th key={title} className="h-10 px-4 font-normal">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr className="border-t border-[#eceff5]">
                <td colSpan={columns.length} className="h-28 px-4 text-center text-[13px] text-slate-400">
                  暂无数据
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={`${title}-${index}`} className="border-t border-[#eceff5] text-slate-700">
                  {columns.map((column) => (
                    <td key={column} className="px-4 py-3">
                      {row[column] ?? "--"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t border-[#eceff5] px-5 py-3">
        <Pagination total={rows.length} />
      </div>
    </div>
  );
}

export function StakeOverviewPage() {
  const rows = Array.from({ length: 8 }, (_, index) => ({
    "资产名称": index % 2 === 0 ? "rFUIDL" : "rSDCT",
    "质押地址": "0x1000...00X1",
    "质押数量": "1,000.01",
    "年化收益率": index % 2 === 0 ? "3.90%" : "6.00%",
    "状态": "已质押",
    "创建时间": "2026-05-06 18:18:32",
  }));

  return (
    <div className="space-y-4">
      <FilterBar />
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="质押资产数量" value="1,000" />
        <StatCard title="昨日收益" value="1,000,000" unit="USDC" />
        <StatCard title="累计收益" value="1,000,000" unit="USDC" />
      </div>
      <BackendTable
        title="质押情况"
        columns={["资产名称", "质押地址", "质押数量", "年化收益率", "状态", "创建时间"]}
        rows={rows}
      />
    </div>
  );
}

export function StakeRecordPage() {
  const rows = Array.from({ length: 8 }, (_, index) => ({
    "记录 ID": `SR${String(index + 1).padStart(8, "0")}`,
    "资产名称": "rFUIDL",
    "操作类型": index % 2 === 0 ? "质押" : "赎回",
    "数量": "1,000.01",
    "交易 HASH": hashValue,
    "状态": "已完成",
    "创建时间": "2026-05-06 18:18:32",
  }));

  return (
    <div className="space-y-4">
      <FilterBar />
      <BackendTable
        title="质押记录"
        columns={["记录 ID", "资产名称", "操作类型", "数量", "交易 HASH", "状态", "创建时间"]}
        rows={rows}
      />
    </div>
  );
}

export function UserListPage() {
  const rows = Array.from({ length: 8 }, (_, index) => ({
    "序列ID": `U${String(index + 1).padStart(6, "0")}`,
    "地址": <TextLink>0x{index % 2 === 0 ? "2a59fd...e07fe3" : "e9b3ba...02a4cc"}</TextLink>,
    "邮箱": index % 3 === 0 ? "--" : index % 2 === 0 ? "yang@realfinance.cc" : "admin@realfinance.cc",
    "姓名": index % 3 === 0 ? "--" : index % 2 === 0 ? "杨志文" : "Admin",
    "最后连接钱包时间": index % 3 === 0 ? "--" : "2026-06-05 11:42:18",
    "绑定时间": index % 3 === 0 ? "--" : "2026-05-26 16:18:06",
  }));

  return (
    <div className="space-y-4">
      <StandardFilterBar
        fields={[
          { type: "input", placeholder: "邮箱查询" },
          { type: "input", placeholder: "地址查询" },
          { type: "date" },
        ]}
        primaryAction={<ActionButton>添加用户</ActionButton>}
      />
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="总地址数（绑定未绑定）" value="1,000" />
        <StatCard title="绑定地址数" value="1,000,000,000" />
        <StatCard title="未绑定地址数" value="1,000,000,000" />
      </div>
      <BackendTable
        title="用户列表"
        columns={["序列ID", "地址", "邮箱", "姓名", "最后连接钱包时间", "绑定时间"]}
        rows={rows}
      />
    </div>
  );
}

export function RewardReleaseAuditPage() {
  const { showSuccessToast } = useGlobalFeedback();
  const [released, setReleased] = useState(false);

  const statusBadge = released ? <StatusBadge tone="green">已发放</StatusBadge> : <StatusBadge tone="orange">待发放</StatusBadge>;
  const batchRows = [
    {
      "发放周期": "2026-05-01 至 2026-05-31",
      "资产名称": "rFUIDL",
      "发放用户数": "86",
      "计息天数": "31",
      "底层收益总额": "1,248.32 USDC",
      "iREAL收益总额": "12,480 iREAL",
      "统计截止日": "2026-05-31",
      "创建时间": "2026-06-03 13:20:00",
      "状态": statusBadge,
    },
    {
      "发放周期": "2026-05-01 至 2026-05-31",
      "资产名称": "rSDCT",
      "发放用户数": "42",
      "计息天数": "31",
      "底层收益总额": "860.00 USDC",
      "iREAL收益总额": "6,240 iREAL",
      "统计截止日": "2026-05-31",
      "创建时间": "2026-06-03 13:20:00",
      "状态": statusBadge,
    },
  ];
  const detailRows = [
    {
      "用户地址": "0x2a59fd...e07fe3",
      "邮箱": "yang@realfinance.cc",
      "资产名称": "rFUIDL",
      "发放周期": "2026-05-01 至 2026-05-31",
      "计息天数": "31",
      "底层收益": "14.52 USDC",
      "iREAL收益": "145 iREAL",
      "状态": statusBadge,
    },
    {
      "用户地址": "0xe9b3ba...02a4cc",
      "邮箱": "--",
      "资产名称": "rSDCT",
      "发放周期": "2026-05-01 至 2026-05-31",
      "计息天数": "31",
      "底层收益": "8.20 USDC",
      "iREAL收益": "82 iREAL",
      "状态": statusBadge,
    },
  ];

  const handleRelease = () => {
    setReleased(true);
    showSuccessToast("上月用户奖励已发放");
  };

  return (
    <div className="space-y-4">
      <StandardFilterBar
        fields={[
          { type: "select", placeholder: "资产名称", options: rwaOptions },
          { type: "input", placeholder: "用户地址" },
        ]}
        showExport={false}
        primaryAction={
          <ActionButton variant="success" onClick={handleRelease} disabled={released}>
            {released ? "已发放" : "发放奖励"}
          </ActionButton>
        }
      />
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="待发放用户数" value={released ? "0" : "128"} />
        <StatCard title="待发放底层收益" value={released ? "0" : "2,108.32"} unit="USDC" />
        <StatCard title="待发放 iREAL" value={released ? "0" : "18,720"} unit="iREAL" />
      </div>
      <BackendTable
        title="发放审核"
        columns={["资产名称", "发放周期", "发放用户数", "计息天数", "底层收益总额", "iREAL收益总额", "统计截止日", "创建时间", "状态"]}
        rows={batchRows}
      />
      <BackendTable
        title="发放明细"
        columns={["用户地址", "邮箱", "资产名称", "发放周期", "底层收益", "iREAL收益", "计息天数", "状态"]}
        rows={detailRows}
      />
    </div>
  );
}

export function RewardReleaseRecordPage() {
  const rows = [
    {
      "发放周期": "2026-05-01 至 2026-05-31",
      "资产名称": "rFUIDL",
      "发放用户数": "86",
      "发放底层收益": "1,248.32 USDC",
      "发放 iREAL": "12,480 iREAL",
      "发放时间": "2026-06-03 13:30:00",
      "发放状态": <StatusBadge tone="green">已完成</StatusBadge>,
      "操作人": "admin",
      "交易哈希": <TextLink>{hashValue}</TextLink>,
    },
    {
      "发放周期": "2026-04-01 至 2026-04-30",
      "资产名称": "rSDCT",
      "发放用户数": "42",
      "发放底层收益": "780.00 USDC",
      "发放 iREAL": "5,920 iREAL",
      "发放时间": "2026-05-01 10:05:24",
      "发放状态": <StatusBadge tone="red">失败</StatusBadge>,
      "操作人": "yang",
      "交易哈希": <TextLink>{hashValue}</TextLink>,
    },
  ];
  const detailRows = [
    {
      "用户地址": "0x2a59fd...e07fe3",
      "邮箱": "yang@realfinance.cc",
      "资产名称": "rFUIDL",
      "发放底层收益": "14.52 USDC",
      "发放 iREAL": "145 iREAL",
      "发放时间": "2026-06-03 13:30:00",
      "状态": <StatusBadge tone="green">已完成</StatusBadge>,
      "交易哈希": <TextLink>{hashValue}</TextLink>,
    },
    {
      "用户地址": "0xe9b3ba...02a4cc",
      "邮箱": "--",
      "资产名称": "rSDCT",
      "发放底层收益": "8.20 USDC",
      "发放 iREAL": "82 iREAL",
      "发放时间": "2026-05-01 10:05:24",
      "状态": <StatusBadge tone="red">失败</StatusBadge>,
      "交易哈希": <TextLink>{hashValue}</TextLink>,
    },
  ];

  return (
    <div className="space-y-4">
      <StandardFilterBar
        fields={[
          { type: "select", placeholder: "发放月份", options: ["2026-05", "2026-04", "2026-03"] },
          { type: "select", placeholder: "资产名称", options: rwaOptions },
          { type: "input", placeholder: "用户地址" },
          { type: "select", placeholder: "发放状态", options: ["已完成", "失败"] },
        ]}
      />
      <BackendTable
        title="发放记录"
        columns={["资产名称", "发放周期", "发放用户数", "发放底层收益", "发放 iREAL", "发放时间", "发放状态", "操作人", "交易哈希"]}
        rows={rows}
      />
      <BackendTable
        title="发放明细"
        columns={["用户地址", "邮箱", "资产名称", "发放底层收益", "发放 iREAL", "发放时间", "状态", "交易哈希"]}
        rows={detailRows}
      />
    </div>
  );
}

export function LendingOrderPage() {
  const rows = Array.from({ length: 8 }, (_, index) => ({
    "订单 ID": `LO${String(index + 1).padStart(8, "0")}`,
    "账户地址": "0x1000...00X1",
    "资产名称": "rFUIDL",
    "借贷数量": "1,000.01",
    "借贷利率": "3.20%",
    "状态": "处理中",
    "创建时间": "2026-05-06 18:18:32",
  }));

  return (
    <div className="space-y-4">
      <FilterBar />
      <BackendTable
        title="借贷订单"
        columns={["订单 ID", "账户地址", "资产名称", "借贷数量", "借贷利率", "状态", "创建时间"]}
        rows={rows}
      />
    </div>
  );
}

export function AddressListPage() {
  const rows = [
    { "钱包ID": "205191...684801", "钱包名称": "real主钱包", "钱包地址": "0x85e1...071e", "公链": "BSC", "币种符号": "USDC", "当前余额": "4,463.5", "最后一次转账时间": "2026-05-18 13:59:29", "操作": <TextLink>查看</TextLink> },
    { "钱包ID": "205191...684801", "钱包名称": "real主钱包", "钱包地址": "0x85e1...071e", "公链": "BSC", "币种符号": "USD1", "当前余额": "1", "最后一次转账时间": "2026-03-30 13:08:48", "操作": <TextLink>查看</TextLink> },
    { "钱包ID": "205259...350017", "钱包名称": "风险保障金账户（保险池）", "钱包地址": "0xc006...1908", "公链": "BSC", "币种符号": "rXWCT", "当前余额": "0", "最后一次转账时间": "--", "操作": <TextLink>查看</TextLink> },
    { "钱包ID": "205259...649666", "钱包名称": "渠道奖励账户", "钱包地址": "0xc416...c873", "公链": "BSC", "币种符号": "REAL", "当前余额": "0", "最后一次转账时间": "--", "操作": <TextLink>查看</TextLink> },
    { "钱包ID": "205259...649666", "钱包名称": "渠道奖励账户", "钱包地址": "0xc416...c873", "公链": "BSC", "币种符号": "USD1", "当前余额": "0", "最后一次转账时间": "--", "操作": <TextLink>查看</TextLink> },
    { "钱包ID": "205259...649666", "钱包名称": "渠道奖励账户", "钱包地址": "0xc416...c873", "公链": "BSC", "币种符号": "USDT", "当前余额": "0", "最后一次转账时间": "--", "操作": <TextLink>查看</TextLink> },
    { "钱包ID": "205259...649666", "钱包名称": "渠道奖励账户", "钱包地址": "0xc416...c873", "公链": "BSC", "币种符号": "rSDCT", "当前余额": "0", "最后一次转账时间": "--", "操作": <TextLink>查看</TextLink> },
    { "钱包ID": "205259...649666", "钱包名称": "渠道奖励账户", "钱包地址": "0xc416...c873", "公链": "BSC", "币种符号": "rFUIDL", "当前余额": "0", "最后一次转账时间": "--", "操作": <TextLink>查看</TextLink> },
    { "钱包ID": "205259...649666", "钱包名称": "渠道奖励账户", "钱包地址": "0xc416...c873", "公链": "BSC", "币种符号": "rXWCT", "当前余额": "0", "最后一次转账时间": "--", "操作": <TextLink>查看</TextLink> },
    { "钱包ID": "205259...649666", "钱包名称": "渠道奖励账户", "钱包地址": "0xc416...c873", "公链": "BSC", "币种符号": "USDC", "当前余额": "0", "最后一次转账时间": "--", "操作": <TextLink>查看</TextLink> },
  ];

  return (
    <div className="space-y-4">
      <StandardFilterBar
        fields={[{ type: "input", placeholder: "钱包地址" }, { type: "date" }]}
        showExport={false}
        primaryAction={<ActionButton>添加钱包</ActionButton>}
      />
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="当前钱包总资产折合" value="4,464.5" unit="USDC" />
        <StatCard title="USDC" value="4,463.5" />
        <StatCard title="USDT" value="0" />
        <StatCard title="USD1" value="1" />
      </div>
      <BackendTable
        title="地址表"
        columns={["钱包ID", "钱包名称", "钱包地址", "公链", "币种符号", "当前余额", "最后一次转账时间", "操作"]}
        rows={rows}
      />
    </div>
  );
}

export function SalesDataPage() {
  const rows = [
    { "产品ID": "204947...091010", "产品名称": "BNY Money Market Fund", "币种符号": "rFUIDL", "销售总资产折合（USDC）": "0", "当前余额(USDC)": "999,000,000", "最后一次买入": "--", "最后一次卖出": "--" },
    { "产品ID": "204947...607297", "产品名称": "Standard Bond", "币种符号": "rXWCT", "销售总资产折合（USDC）": "4,438.5", "当前余额(USDC)": "435,561.5", "最后一次买入": "2026-05-11 10:49:49", "最后一次卖出": "2026-04-15 15:40:14" },
    { "产品ID": "204947...856834", "产品名称": "Standard Bond", "币种符号": "rSDCT", "销售总资产折合（USDC）": "14", "当前余额(USDC)": "1,459,986", "最后一次买入": "2026-05-18 13:59:20", "最后一次卖出": "2026-04-16 13:58:27" },
  ];

  return (
    <div className="space-y-4">
      <StandardFilterBar fields={[{ type: "select", placeholder: "产品列表", options: rwaOptions }, { type: "date" }]} showExport={false} />
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="平台总销售折合" value="4,452.5" unit="USDC" />
        <StatCard title="USDC" value="4,451.5" />
        <StatCard title="USDT" value="0" />
        <StatCard title="USD1" value="1" />
      </div>
      <BackendTable
        title="销售数据"
        columns={["产品ID", "产品名称", "币种符号", "销售总资产折合（USDC）", "当前余额(USDC)", "最后一次买入", "最后一次卖出"]}
        rows={rows}
      />
    </div>
  );
}

export function MerchantPositionPage() {
  const rows: TableRow[] = [];

  return (
    <div className="space-y-4">
      <StandardFilterBar
        fields={[
          { type: "select", placeholder: "交易对", options: ["rFUIDL/USDC", "rXWCT/USDC", "rSDCT/USDC"] },
          { type: "date" },
          { type: "input", placeholder: "做市商地址" },
          { type: "input", placeholder: "做市商邮箱" },
        ]}
        showExport={false}
        primaryAction={<ActionButton>添加做市商</ActionButton>}
      />
      <div className="grid grid-cols-2 gap-4">
        <StatCard title="总成交额" value="0" unit="USDC" />
        <StatCard title="总成交量" value="0" unit="BOND" />
      </div>
      <BackendTable
        title="商户持仓"
        columns={["资产 ID", "账户地址", "邮箱", "商户名称", "资产币种", "买入单价", "成交量", "成交总额", "rwa余额", "稳定币余额", "成交时间", "操作"]}
        rows={rows}
      />
    </div>
  );
}

export function MerchantSettlementPage() {
  const settlementRows = [
    {
      "日期": "2026-05-15",
      "持仓总量": "2 rSDCT",
      "底层利率总额": "0",
      "积分利率总数": "0",
      "总利率折算": "0",
      "状态": <StatusBadge tone="orange">待审核</StatusBadge>,
      "操作": <TextLink>发放佣金</TextLink>,
    },
    { "日期": "2026-05-14", "持仓总量": "2 rSDCT", "底层利率总额": "0", "积分利率总数": "0", "总利率折算": "0", "状态": <StatusBadge tone="orange">待审核</StatusBadge>, "操作": <TextLink>发放佣金</TextLink> },
    { "日期": "2026-05-13", "持仓总量": "2 rSDCT", "底层利率总额": "0", "积分利率总数": "0", "总利率折算": "0", "状态": <StatusBadge tone="orange">待审核</StatusBadge>, "操作": <TextLink>发放佣金</TextLink> },
    { "日期": "2026-05-12", "持仓总量": "2 rSDCT", "底层利率总额": "0", "积分利率总数": "0", "总利率折算": "0", "状态": <StatusBadge tone="orange">待审核</StatusBadge>, "操作": <TextLink>发放佣金</TextLink> },
    { "日期": "2026-05-09", "持仓总量": "1 rSDCT", "底层利率总额": "0", "积分利率总数": "0", "总利率折算": "0", "状态": <StatusBadge tone="orange">待审核</StatusBadge>, "操作": <TextLink>发放佣金</TextLink> },
    { "日期": "2026-05-08", "持仓总量": "1 rSDCT", "底层利率总额": "0", "积分利率总数": "0", "总利率折算": "0", "状态": <StatusBadge tone="orange">待审核</StatusBadge>, "操作": <TextLink>发放佣金</TextLink> },
    { "日期": "2026-05-07", "持仓总量": "1 rSDCT", "底层利率总额": "0", "积分利率总数": "0", "总利率折算": "0", "状态": <StatusBadge tone="orange">待审核</StatusBadge>, "操作": <TextLink>发放佣金</TextLink> },
    { "日期": "2026-05-06", "持仓总量": "1 rSDCT", "底层利率总额": "0", "积分利率总数": "0", "总利率折算": "0", "状态": <StatusBadge tone="orange">待审核</StatusBadge>, "操作": <TextLink>发放佣金</TextLink> },
  ];

  const detailRows = [
    { "资产 ID": "2053626136026271745", "账户地址": "0x31ad...f7b5", "邮箱": "-", "商户名称": "做市商nathan", "资产币种": "rSDCT", "平均持仓数量": "1 rSDCT", "底层收益率": "6%", "底层收益": "0", "iREAL 收益率": "1.9%", "iREAL 收益": "0", "生成时间": "2026-05-11 08:00:00" },
    { "资产 ID": "2053263748349415426", "账户地址": "0x31ad...f7b5", "邮箱": "-", "商户名称": "做市商nathan", "资产币种": "rSDCT", "平均持仓数量": "1 rSDCT", "底层收益率": "6%", "底层收益": "0", "iREAL 收益率": "1.9%", "iREAL 收益": "0", "生成时间": "2026-05-10 08:00:00" },
  ];

  return (
    <div className="space-y-4">
      <StandardFilterBar
        fields={[{ type: "select", placeholder: "RWA 资产", options: rwaOptions }]}
        showExport={false}
        primaryAction={<ActionButton>批量发放</ActionButton>}
      />
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="持仓总额" value="12" unit="USDC" />
        <StatCard title="底层利率总额" value="0.002" unit="USDC" />
        <StatCard title="iREAL 利息总额" value="0.001" unit="iREAL" />
      </div>
      <BackendTable
        title="商户结算"
        columns={["日期", "持仓总量", "底层利率总额", "积分利率总数", "总利率折算", "状态", "操作"]}
        rows={settlementRows}
      />
      <StandardFilterBar
        fields={[{ type: "select", placeholder: "RWA 资产", options: rwaOptions }, { type: "date" }, { type: "input", placeholder: "地址" }, { type: "input", placeholder: "邮箱" }]}
        showExport={false}
      />
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="持仓总额" value="2" unit="USDC" />
        <StatCard title="利息总额" value="0" unit="USDC" />
        <StatCard title="支出利率总额" value="0" unit="USDC" />
      </div>
      <BackendTable
        title="发放明细"
        columns={["资产 ID", "账户地址", "邮箱", "商户名称", "资产币种", "平均持仓数量", "底层收益率", "底层收益", "iREAL 收益率", "iREAL 收益", "生成时间"]}
        rows={detailRows}
      />
    </div>
  );
}

export function RebateConfigManagementPage() {
  const rows = ["L0", "L1", "L2", "L3"].map((level, index) => ({
    "奖励等级": level,
    "合格受邀人数": `${[50, 100, 200, 300][index]}人${index === 3 ? "以上" : ""}`,
    "单人申购额": `$${[50000, 100000, 200000, 300000][index].toLocaleString()}`,
    "人头佣金": `${[20, 30, 50, 20][index]} USDC`,
    "佣金币种": "USD1",
    "质押利率加成": `${(index + 1) / 10}%`,
    "加成有效时长": index === 1 ? "60天" : "30天",
  }));

  return (
    <div className="space-y-4">
      <div className="rounded-[8px] border border-[#eceff5] bg-white p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-semibold text-slate-800">邀请返佣活动</h2>
              <StatusBadge tone="green">上架中</StatusBadge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-10 gap-y-3 text-[13px] text-slate-600">
              <span>版本号：V1.8</span>
              <span>版本创建时间：2026-05-18 12:00:00</span>
              <span>生效时间范围：2026-01-06 至 2027-01-06</span>
              <span>收益口径：8%（6% USDC + 2% iREAL）</span>
            </div>
          </div>
          <div className="flex gap-2">
            <ActionButton variant="secondary">查看修改记录</ActionButton>
            <ActionButton>修改配置</ActionButton>
          </div>
        </div>
      </div>
      <BackendTable
        title="返佣等级"
        columns={["奖励等级", "合格受邀人数", "单人申购额", "人头佣金", "佣金币种", "质押利率加成", "加成有效时长"]}
        rows={rows}
      />
    </div>
  );
}

export function RebatePendingReviewPage() {
  const rows: TableRow[] = [];

  return (
    <div className="space-y-4">
      <StandardFilterBar
        fields={[
          { type: "input", placeholder: "邀请人地址" },
          { type: "input", placeholder: "邀请人邮箱" },
          { type: "select", placeholder: "奖励等级", options: ["L0", "L1", "L2", "L3"] },
          { type: "date" },
        ]}
        showExport={false}
        primaryAction={<ActionButton>批量审核</ActionButton>}
      />
      <BackendTable
        title="审核列表"
        columns={["邀请人地址", "邀请人邮箱", "统计周期", "待发放 USDC", "待发放 REAL", "创建时间", "操作"]}
        rows={rows}
      />
    </div>
  );
}

export function RebateReviewedPage() {
  const rows: TableRow[] = [];

  return (
    <div className="space-y-4">
      <StandardFilterBar
        fields={[
          { type: "input", placeholder: "邀请人地址" },
          { type: "input", placeholder: "邀请人邮箱" },
          { type: "select", placeholder: "奖励等级", options: ["L0", "L1", "L2", "L3"] },
          { type: "date" },
        ]}
        showExport={false}
      />
      <BackendTable
        title="利率审核列表"
        columns={["审核时间", "邀请人地址", "邀请人邮箱", "统计周期", "USDC佣金", "REAL佣金", "发放状态", "操作"]}
        rows={rows}
      />
    </div>
  );
}

export function RebateRecordPage() {
  const rows: TableRow[] = [];

  return (
    <div className="space-y-4">
      <StandardFilterBar
        fields={[{ type: "input", placeholder: "邀请人地址" }, { type: "input", placeholder: "邀请人邮箱" }, { type: "date" }]}
        showExport={false}
      />
      <BackendTable
        title="返佣记录"
        columns={["发放时间", "邀请人地址", "邀请人邮箱", "奖励类型", "发放资产", "发放数量", "发放状态", "操作"]}
        rows={rows}
      />
    </div>
  );
}

export function MemberManagementPage() {
  const rows = [
    {
      "成员账号": "admin",
      "邮箱": "admin@real.finance",
      "角色": "超级管理员",
      "状态": <StatusBadge tone="green">启用</StatusBadge>,
      "加入时间": "2025-01-07 14:30:41",
      "操作": (
        <span className="flex gap-3">
          <TextLink>编辑</TextLink>
          <TextLink>禁用</TextLink>
        </span>
      ),
    },
    {
      "成员账号": "operation",
      "邮箱": "operation@real.finance",
      "角色": "运营",
      "状态": <StatusBadge tone="green">启用</StatusBadge>,
      "加入时间": "2026-03-12 10:08:31",
      "操作": <TextLink>编辑</TextLink>,
    },
  ];

  return (
    <div className="space-y-4">
      <StandardFilterBar fields={[{ type: "input", placeholder: "成员账号" }, { type: "input", placeholder: "邮箱" }]} primaryAction={<ActionButton>新增成员</ActionButton>} />
      <BackendTable title="成员管理" columns={["成员账号", "邮箱", "角色", "状态", "加入时间", "操作"]} rows={rows} />
    </div>
  );
}

export function RoleManagementPage() {
  const rows = [
    {
      "角色名称": "超级管理员",
      "角色说明": "拥有后台全部管理权限",
      "成员数量": "1",
      "创建时间": "2025-01-07 14:30:41",
      "操作": <TextLink>编辑</TextLink>,
    },
    {
      "角色名称": "运营",
      "角色说明": "查看并处理订单、产品、返佣相关业务",
      "成员数量": "3",
      "创建时间": "2026-03-12 10:08:31",
      "操作": <TextLink>编辑</TextLink>,
    },
  ];

  return (
    <div className="space-y-4">
      <StandardFilterBar fields={[{ type: "input", placeholder: "角色名称" }]} primaryAction={<ActionButton>新增角色</ActionButton>} />
      <BackendTable title="角色管理" columns={["角色名称", "角色说明", "成员数量", "创建时间", "操作"]} rows={rows} />
    </div>
  );
}

export function PersonalInformationPage() {
  return (
    <div className="rounded-[8px] border border-[#eceff5] bg-white p-6">
      <div className="flex items-center justify-between border-b border-[#eceff5] pb-5">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-[#eff6ff] text-[22px] font-semibold text-[#1f5bd8]">
            A
          </span>
          <div>
            <h2 className="text-[18px] font-semibold text-slate-800">admin</h2>
            <p className="mt-1 text-[13px] text-slate-500">个人信息</p>
          </div>
        </div>
        <ActionButton>编辑信息</ActionButton>
      </div>
      <div className="mt-6 grid max-w-[680px] gap-5 text-[14px]">
        <div className="grid grid-cols-[120px_1fr] gap-4">
          <span className="text-slate-500">登录帐号</span>
          <span className="text-slate-800">admin</span>
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-4">
          <span className="text-slate-500">账号密码</span>
          <span className="text-slate-800">********** <TextLink>修改密码</TextLink></span>
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-4">
          <span className="text-slate-500">绑定邮箱</span>
          <span className="text-slate-800">-</span>
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-4">
          <span className="text-slate-500">加入时间</span>
          <span className="text-slate-800">2025-01-07 14:30:41</span>
        </div>
      </div>
    </div>
  );
}
