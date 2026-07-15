"use client";

import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { useGlobalFeedback } from "@/components/feedback/global-feedback-provider";
import {
  priceParameterColumns,
  priceParameterRecords,
  priceParameterSummary,
  type PriceParameterRecord,
} from "@/projects/market-making-demo/data/price-parameter-prototype";

const inputClassName = "h-9 rounded-[6px] border border-[#dcdfe6] bg-white px-3 text-[13px] text-slate-700 outline-none focus:border-[#1f5bd8]";

function formatNow() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

export function PriceParameterPage() {
  const { showSuccessToast, showWarningToast } = useGlobalFeedback();
  const [records, setRecords] = useState<PriceParameterRecord[]>(() => [...priceParameterRecords]);
  const [currency, setCurrency] = useState("全部币种");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportDate, setReportDate] = useState("");
  const [reportPrice, setReportPrice] = useState("");
  const [reportCurrency, setReportCurrency] = useState("USD");

  const filteredRecords = useMemo(
    () =>
      records.filter((record) => {
        const matchedCurrency = currency === "全部币种" || record.currency === currency;
        const matchedStart = !startDate || record.priceDate >= startDate;
        const matchedEnd = !endDate || record.priceDate <= endDate;

        return matchedCurrency && matchedStart && matchedEnd;
      }),
    [currency, endDate, records, startDate]
  );

  const latestRecord = records[0] ?? priceParameterSummary;

  const resetFilters = () => {
    setCurrency("全部币种");
    setStartDate("");
    setEndDate("");
  };

  const openReportPanel = () => {
    setReportDate("");
    setReportPrice("");
    setReportCurrency("USD");
    setReportOpen(true);
  };

  const savePriceReport = () => {
    const price = Number(reportPrice);
    if (!reportDate || !reportPrice || Number.isNaN(price) || price <= 0) {
      showWarningToast("请填写有效的价格日期和价格");
      return;
    }

    const newRecord: PriceParameterRecord = {
      priceDate: reportDate,
      price: price.toFixed(10),
      currency: reportCurrency,
      latestPriceUpdateTime: formatNow(),
    };

    setRecords((current) => [newRecord, ...current.filter((record) => !(record.priceDate === reportDate && record.currency === reportCurrency))]);
    setReportOpen(false);
    showSuccessToast("价格上报已暂存，接入 API 后将同步至真实数据源");
  };

  return (
    <div className="space-y-4">
      <section className="rounded-[8px] border border-[#eceff5] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <label className="flex flex-col gap-2 text-[13px] font-medium text-slate-700">
            <span>币种</span>
            <select value={currency} onChange={(event) => setCurrency(event.target.value)} className={`${inputClassName} w-[180px]`}>
              <option>全部币种</option>
              <option>USD</option>
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
            <button type="button" onClick={openReportPanel} className="inline-flex h-9 items-center gap-1.5 rounded-[6px] bg-[#16a05d] px-4 text-[13px] font-medium text-white hover:bg-[#12894f]">
              <Plus className="size-4" />
              上报价格
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
            <p className="mt-1 text-[12px] text-slate-400">每日价格数据将由价格接口同步；当前为接口返回样例。</p>
          </div>
          <span className="rounded-full bg-[#edf5ff] px-3 py-1 text-[12px] font-medium text-[#1f5bd8]">接口待接入</span>
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
                <tr key={`${record.priceDate}-${record.currency}`} className="border-b border-[#edf0f5] text-slate-700 last:border-b-0">
                  <td className="px-4 py-3.5">{record.priceDate}</td>
                  <td className="px-4 py-3.5 font-medium text-[#1f5bd8]">{record.price}</td>
                  <td className="px-4 py-3.5">{record.currency}</td>
                  <td className="px-4 py-3.5">{record.latestPriceUpdateTime}</td>
                  <td className="px-4 py-3.5">
                    <button type="button" onClick={openReportPanel} className="text-[#1f5bd8] hover:underline">补报</button>
                  </td>
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

      {reportOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 p-4">
          <section role="dialog" aria-modal="true" aria-label="上报价格" className="w-full max-w-[460px] rounded-[10px] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[18px] font-semibold text-slate-800">上报价格</h2>
                <p className="mt-1 text-[13px] text-slate-400">真实 API 接入前，此操作仅在当前页面暂存。</p>
              </div>
              <button type="button" onClick={() => setReportOpen(false)} className="text-[20px] leading-none text-slate-400 hover:text-slate-600">×</button>
            </div>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-[13px] font-medium text-slate-700">价格日期
                <input type="date" value={reportDate} onChange={(event) => setReportDate(event.target.value)} className={inputClassName} />
              </label>
              <label className="grid gap-2 text-[13px] font-medium text-slate-700">价格
                <input inputMode="decimal" value={reportPrice} onChange={(event) => setReportPrice(event.target.value)} placeholder="请输入价格，例如 1.0000000000" className={inputClassName} />
              </label>
              <label className="grid gap-2 text-[13px] font-medium text-slate-700">币种
                <select value={reportCurrency} onChange={(event) => setReportCurrency(event.target.value)} className={inputClassName}><option>USD</option></select>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setReportOpen(false)} className="h-9 rounded-[6px] border border-[#dcdfe6] px-5 text-[13px] text-slate-600 hover:bg-slate-50">取消</button>
              <button type="button" onClick={savePriceReport} className="h-9 rounded-[6px] bg-[#1f5bd8] px-5 text-[13px] font-medium text-white hover:bg-[#1a4fc1]">保存上报</button>
            </div>
          </section>
        </div>
      ) : null}
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
