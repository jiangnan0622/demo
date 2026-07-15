"use client";

import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import {
  priceParameterColumns,
  priceParameterRecords,
  priceParameterSummary,
} from "@/projects/market-making-demo/data/price-parameter-prototype";

const inputClassName = "h-9 rounded-[6px] border border-[#dcdfe6] bg-white px-3 text-[13px] text-slate-700 outline-none focus:border-[#1f5bd8]";

export function PriceParameterPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assetSymbol, setAssetSymbol] = useState("rFUIDL");

  const filteredRecords = useMemo(
    () =>
      priceParameterRecords.filter((record) => {
        const matchedStart = !startDate || record.priceDate >= startDate;
        const matchedEnd = !endDate || record.priceDate <= endDate;
        const matchedAsset = record.assetSymbol === assetSymbol;

        return matchedStart && matchedEnd && matchedAsset;
      }),
    [assetSymbol, endDate, startDate]
  );

  const latestRecord = filteredRecords[0] ?? priceParameterSummary;

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setAssetSymbol("rFUIDL");
  };

  return (
    <div className="space-y-4">
      <section className="rounded-[8px] border border-[#eceff5] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <label className="flex flex-col gap-2 text-[13px] font-medium text-slate-700">
            <span>币种</span>
            <select value={assetSymbol} onChange={(event) => setAssetSymbol(event.target.value)} className={`${inputClassName} w-[180px]`}>
              <option>rFUIDL</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-[13px] font-medium text-slate-700">
            <span>价格日期</span>
            <span className="flex items-center gap-2">
              <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className={`${inputClassName} w-[160px]`} />
              <span className="text-slate-400">→</span>
              <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className={`${inputClassName} w-[160px]`} />
              <Calendar className="size-4 text-slate-400" />
            </span>
          </label>
          <div className="ml-auto flex items-center gap-2">
            <button type="button" onClick={resetFilters} className="h-9 rounded-[6px] border border-[#dcdfe6] bg-white px-5 text-[13px] text-slate-600 hover:bg-slate-50">
              重置
            </button>
            <button type="button" className="h-9 rounded-[6px] bg-[#1f5bd8] px-5 text-[13px] font-medium text-white hover:bg-[#1a4fc1]">
              查询
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard title="最新价格" value={latestRecord.price} unit={latestRecord.currency} />
        <SummaryCard title="最新价格日期" value={latestRecord.priceDate} />
        <SummaryCard title="最新价格更新时间" value={latestRecord.latestPriceUpdateTime} />
      </section>

      <section className="rounded-[8px] border border-[#eceff5] bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-slate-800">价格参数记录</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] border-collapse text-[13px]">
            <thead className="bg-[#fafbfd] text-left text-slate-700">
              <tr>
                {priceParameterColumns.map((column) => (
                  <th key={column} className="h-12 px-4 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={`${record.assetSymbol}-${record.priceDate}-${record.currency}`} className="border-b border-[#edf0f5] text-slate-700 last:border-b-0">
                  <td className="px-4 py-3.5">{record.priceDate}</td>
                  <td className="px-4 py-3.5">{record.assetSymbol}</td>
                  <td className="px-4 py-3.5 font-medium text-[#1f5bd8]">{record.price}</td>
                  <td className="px-4 py-3.5">{record.currency}</td>
                  <td className="px-4 py-3.5">{record.latestPriceUpdateTime}</td>
                </tr>
              ))}
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={priceParameterColumns.length} className="h-28 text-center text-slate-400">暂无数据</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-end gap-2 text-[13px] text-slate-600">
          <span className="mr-2">共 {priceParameterSummary.total} 条</span>
          <button type="button" aria-label="上一页" className="grid size-7 place-items-center rounded-[4px] text-slate-400 hover:bg-slate-100"><ChevronLeft className="size-3.5" /></button>
          <span className="grid size-7 place-items-center rounded-[4px] border border-[#1f5bd8] text-[#1f5bd8]">1</span>
          <button type="button" className="grid size-7 place-items-center rounded-[4px] hover:bg-slate-100">2</button>
          <span className="px-1">…</span>
          <button type="button" className="grid size-7 place-items-center rounded-[4px] hover:bg-slate-100">22</button>
          <button type="button" aria-label="下一页" className="grid size-7 place-items-center rounded-[4px] hover:bg-slate-100"><ChevronRight className="size-3.5" /></button>
          <button type="button" className="ml-1 flex h-7 items-center gap-1 rounded-[4px] border border-[#dcdfe6] bg-white px-2 hover:bg-slate-50">10 条/页 <ChevronDown className="size-3" /></button>
        </div>
      </section>

    </div>
  );
}

function SummaryCard({ title, value, unit }: { title: string; value: string; unit?: string }) {
  return (
    <div className="rounded-[8px] border border-[#dde7ff] bg-[#f1f6ff] px-6 py-5">
      <p className="text-[13px] text-slate-600">{title}</p>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="text-[24px] font-semibold leading-none text-[#1f5bd8]">{value}</span>
        {unit ? <span className="text-[13px] text-[#1f5bd8]/70">{unit}</span> : null}
      </p>
    </div>
  );
}
