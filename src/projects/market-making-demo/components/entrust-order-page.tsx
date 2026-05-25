"use client";

import { useMemo, useState } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useGlobalFeedback } from "@/components/feedback/global-feedback-provider";

type EntrustOrderStatus = "SETTLING" | "UNFILLED" | "COMPLETED";
type EntrustOrderSide = "BUY" | "SELL";

type EntrustOrderRecord = {
  id: string;
  address: string;
  side: EntrustOrderSide;
  pair: string;
  orderType: string;
  avgPrice: string;
  hash: string;
  status: EntrustOrderStatus;
  createdAt: string;
};

const sideLabel: Record<EntrustOrderSide, string> = {
  BUY: "买",
  SELL: "卖",
};

const statusLabel: Record<EntrustOrderStatus, string> = {
  SETTLING: "结算中",
  UNFILLED: "未成交",
  COMPLETED: "已完成",
};

const mockRows: EntrustOrderRecord[] = Array.from({ length: 10 }, (_, index) => ({
  id: `EO${String(index + 1).padStart(8, "0")}`,
  address: "0x1000...00X1",
  side: index % 2 === 0 ? "SELL" : "BUY",
  pair: "rFUIDL/USDC",
  orderType: "市价委托",
  avgPrice: index < 7 ? "1.0008" : "--",
  hash: "0xd850...8438",
  status: index < 3 ? "SETTLING" : index < 7 ? "COMPLETED" : "UNFILLED",
  createdAt: "2026-05-06 18:18:32",
}));

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

function StatusTag({ status }: { status: EntrustOrderStatus }) {
  const tone =
    status === "SETTLING"
      ? "bg-[#fff4e5] text-[#e07d10]"
      : status === "UNFILLED"
        ? "bg-[#eef3ff] text-[#1f5bd8]"
        : "bg-[#e8f7ee] text-[#1c9551]";
  return (
    <span className={`inline-flex h-6 items-center rounded-[4px] px-2 text-[12px] font-medium ${tone}`}>
      {statusLabel[status]}
    </span>
  );
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

export function EntrustOrderPage() {
  const { showSuccessToast } = useGlobalFeedback();
  const [status, setStatus] = useState<"全部" | EntrustOrderStatus>("全部");
  const [side, setSide] = useState<"全部" | EntrustOrderSide>("全部");
  const [pair, setPair] = useState<string>("全部");
  const [address, setAddress] = useState("");

  const rows = useMemo(
    () =>
      mockRows.filter((row) => {
        const matchStatus = status === "全部" || row.status === status;
        const matchSide = side === "全部" || row.side === side;
        const matchPair = pair === "全部" || row.pair === pair;
        const matchAddr = address.trim() === "" || row.address.includes(address.trim());
        return matchStatus && matchSide && matchPair && matchAddr;
      }),
    [pair, side, status, address]
  );

  const reset = () => {
    setStatus("全部");
    setSide("全部");
    setPair("全部");
    setAddress("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[8px] border border-[#eceff5] bg-white px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-600">交易对</span>
            <select
              value={pair}
              onChange={(event) => setPair(event.target.value)}
              className="h-9 w-[140px] rounded-[6px] border border-[#dcdfe6] bg-white px-3 text-[13px] text-slate-700 outline-none"
            >
              <option value="全部">交易对</option>
              <option>rFUIDL/USDC</option>
              <option>rXWCT/USDC</option>
              <option>rSDCT/USDC</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-600">日期</span>
            <div className="flex h-9 w-[240px] items-center gap-2 rounded-[6px] border border-[#dcdfe6] bg-white px-3 text-[13px] text-slate-400">
              <span>开始日期</span>
              <span>→</span>
              <span>结束日期</span>
              <Calendar className="ml-auto size-3.5" />
            </div>
          </div>
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="h-9 w-[220px] rounded-[6px] border border-[#dcdfe6] bg-white px-3 text-[13px] outline-none focus:border-[#1f5bd8]"
            placeholder="地址"
          />
          <select
            value={side}
            onChange={(event) => setSide(event.target.value as "全部" | EntrustOrderSide)}
            className="h-9 w-[100px] rounded-[6px] border border-[#dcdfe6] bg-white px-3 text-[13px] text-slate-700 outline-none"
          >
            <option value="全部">买卖</option>
            <option value="BUY">买</option>
            <option value="SELL">卖</option>
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as "全部" | EntrustOrderStatus)}
            className="h-9 w-[120px] rounded-[6px] border border-[#dcdfe6] bg-white px-3 text-[13px] text-slate-700 outline-none"
          >
            <option value="全部">状态</option>
            <option value="SETTLING">结算中</option>
            <option value="UNFILLED">未成交</option>
            <option value="COMPLETED">已完成</option>
          </select>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={reset}
              className="h-9 rounded-[6px] border border-[#dcdfe6] bg-white px-5 text-[13px] text-slate-600 hover:bg-slate-50"
            >
              重 置
            </button>
            <button
              type="button"
              className="h-9 rounded-[6px] bg-[#1f5bd8] px-5 text-[13px] font-medium text-white hover:bg-[#1a4fc1]"
            >
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

      <div className="grid grid-cols-3 gap-4">
        <StatCard title="24h交易额" value="1,000,000,000" unit="USDC" />
        <StatCard title="24h交易地址数" value="1,000,000,000" />
        <StatCard title="24h交易量" value="1,000,000,000" unit="USDC" />
      </div>

      <div className="rounded-[8px] border border-[#eceff5] bg-white">
        <div className="border-b border-[#eceff5] px-5 py-3 text-[13px] font-medium text-slate-700">委托订单</div>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-[13px]">
            <thead className="bg-[#fafbfd] text-left text-slate-500">
              <tr>
                {["委托 ID", "买入地址", "买卖", "交易对", "交易类型", "成交均价", "交易 HASH", "状态", "创建时间"].map((title) => (
                  <th key={title} className="h-10 px-4 font-normal">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-[#eceff5] text-slate-700">
                  <td className="px-4 py-3 text-[#1f5bd8]">{row.id}</td>
                  <td className="px-4 py-3 text-[#1f5bd8]">{row.address}</td>
                  <td className={`px-4 py-3 font-medium ${row.side === "BUY" ? "text-[#e54545]" : "text-[#1c9551]"}`}>
                    {sideLabel[row.side]}
                  </td>
                  <td className="px-4 py-3">{row.pair}</td>
                  <td className="px-4 py-3 text-[#1f5bd8]">{row.orderType}</td>
                  <td className="px-4 py-3">{row.avgPrice}</td>
                  <td className="px-4 py-3">
                    <button type="button" className="text-[#1f5bd8] underline-offset-2 hover:underline">
                      {row.hash}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <StatusTag status={row.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{row.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#eceff5] px-5 py-3">
          <Pagination total={rows.length} />
        </div>
      </div>
    </div>
  );
}
