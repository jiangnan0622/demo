"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, CircleHelp, X } from "lucide-react";

import { useGlobalFeedback } from "@/components/feedback/global-feedback-provider";
import { getRepurchaseCurrentViewer } from "@/projects/market-making-demo/services/market-making.service";

const MARKET_MAKER_NAME = "REAL Liquidity Provider";
const baseControlClassName =
  "h-8 w-full rounded-[4px] border border-[#dcdfe6] bg-white text-[14px] font-normal text-[#c0c4cc] outline-none shadow-[inset_0_1px_1px_rgba(0,0,0,0.02)] transition placeholder:text-[#c0c4cc] disabled:cursor-not-allowed disabled:bg-[#f5f7fa] disabled:text-[#c0c4cc]";
const outlineButtonClassName =
  "h-8 rounded-[4px] border border-[#dcdfe6] bg-white text-[15px] font-semibold leading-8 text-[#303133] shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition hover:border-[#c6e2ff] hover:bg-white";
const primaryButtonClassName =
  "h-8 rounded-[4px] bg-[#2b58d8] text-[15px] font-semibold leading-8 text-white shadow-[0_1px_2px_rgba(43,88,216,0.22)] transition hover:bg-[#2b58d8]";

function SelectBox({
  value,
  placeholder,
  disabled = false,
  className = "",
}: {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value ?? ""}
        disabled={disabled}
        onChange={() => undefined}
        className={`${baseControlClassName} appearance-none px-[11px] pr-9`}
      >
        <option value="">{placeholder}</option>
        {value ? <option value={value}>{value}</option> : null}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#bdbdbd]" />
    </div>
  );
}

function FormLabel({ children, required = false }: { children: string; required?: boolean }) {
  return (
    <label className="block text-[15px] font-semibold leading-[22px] text-[#303133]">
      {required ? <span className="mr-1 text-[#f05b5b]">*</span> : null}
      {children}
    </label>
  );
}

function TextInput({
  placeholder,
  disabled = false,
}: {
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <input
      disabled={disabled}
      placeholder={placeholder}
      className={`${baseControlClassName} px-[11px] text-[#303133]`}
    />
  );
}

function EmptyState() {
  return (
    <div className="flex h-[148px] flex-col items-center justify-center text-[#bcbec3]">
      <div className="relative h-[78px] w-[92px]">
        <div className="absolute bottom-[8px] left-[16px] h-[38px] w-[64px] rounded-b-[6px] bg-[#e4e8ee]" />
        <div className="absolute bottom-[38px] left-[20px] h-0 w-0 border-b-[22px] border-l-[18px] border-r-[18px] border-b-[#edf0f4] border-l-transparent border-r-transparent" />
        <div className="absolute bottom-[38px] right-[12px] h-0 w-0 border-b-[22px] border-l-[18px] border-r-[18px] border-b-[#edf0f4] border-l-transparent border-r-transparent" />
        <div className="absolute left-[28px] top-[14px] h-[44px] w-[36px] rounded-[2px] bg-[#f3f5f8] shadow-[0_0_0_6px_#edf0f4]">
          <div className="mx-[5px] mt-[10px] h-[11px] bg-[#dfe4eb]" />
          <div className="mx-[5px] mt-[8px] h-[4px] bg-[#e1e5ec]" />
          <div className="mx-[5px] mt-[5px] h-[4px] bg-[#e1e5ec]" />
        </div>
        <div className="absolute right-[4px] top-[1px] flex h-[22px] w-[28px] items-center justify-center rounded-full bg-[#e5e9ef]">
          <span className="mb-[3px] text-[17px] leading-none text-white">...</span>
        </div>
        <div className="absolute bottom-0 left-[8px] h-[7px] w-[78px] rounded-full bg-[#f1f3f6]" />
      </div>
      <div className="-mt-1 text-[14px]">暂无数据</div>
    </div>
  );
}

function FilterCard() {
  return (
    <section className="h-[72px] rounded-[4px] bg-white shadow-[0_2px_12px_0_rgba(0,0,0,0.06)]">
      <div className="flex h-full items-center gap-[32px] px-5">
        <div className="flex items-center gap-6">
          <span className="whitespace-nowrap text-[15px] font-semibold text-[#303133]">做市商</span>
          <SelectBox value={MARKET_MAKER_NAME} disabled className="w-[220px]" />
        </div>

        <div className="flex items-center gap-6">
          <span className="whitespace-nowrap text-[15px] font-semibold text-[#303133]">资产名称</span>
          <SelectBox placeholder="请选择" className="w-[213px]" />
        </div>

        <div className="flex items-center gap-6">
          <span className="whitespace-nowrap text-[15px] font-semibold text-[#303133]">状态</span>
          <SelectBox placeholder="请选择" className="w-[220px]" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className={`${outlineButtonClassName} w-16`}
          >
            重 置
          </button>
          <button
            type="button"
            className={`${primaryButtonClassName} w-16`}
          >
            查 询
          </button>
        </div>
      </div>
    </section>
  );
}

function ListingTableCard({ onOpenConfig }: { onOpenConfig: () => void }) {
  const columns = ["做市商", "资产名称", "可上架", "上架总量", "在售", "已售", "上架价格", "状态", "操作"];

  return (
    <section className="mt-4 min-h-[306px] rounded-[4px] bg-white shadow-[0_2px_12px_0_rgba(0,0,0,0.07)]">
      <div className="px-5 pb-10 pt-[28px]">
        <div className="flex items-start justify-between">
          <p className="pt-[2px] text-[15px] font-semibold text-[#606266]">
            当前做市商：
            <span className="text-[#303133]">{MARKET_MAKER_NAME}</span>
          </p>
          <button
            type="button"
            onClick={onOpenConfig}
            className="h-[36px] w-[92px] rounded-[6px] bg-[#2b58d8] text-[15px] font-semibold leading-9 text-white shadow-[0_0_0_4px_rgba(47,128,237,0.45),0_1px_2px_rgba(43,88,216,0.18)] transition hover:bg-[#2b58d8]"
          >
            上架配置
          </button>
        </div>

        <div className="mt-2 overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="h-[47px] bg-[#fbfbfb] text-[15px] font-semibold text-[#1f2329]">
                {columns.map((column, index) => (
                  <th
                    key={column}
                    className="border-b border-[#ececec] px-2 font-semibold first:pl-2"
                    style={{ width: index === 0 ? "14%" : index === 1 ? "13%" : undefined }}
                  >
                    <span
                      className={`block leading-[22px] ${
                        index === columns.length - 1 ? "" : "border-r border-[#ececec]"
                      }`}
                    >
                      {column}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={columns.length} className="border-b border-[#ececec]">
                  <EmptyState />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function ListingConfigModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { showWarningToast } = useGlobalFeedback();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/48 pt-[100px]">
      <div className="relative h-[598px] w-[520px] rounded-[5px] bg-white shadow-[0_20px_48px_rgba(0,0,0,0.18)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-[20px] top-[21px] grid size-7 place-items-center text-[#909399]"
          aria-label="关闭"
        >
          <X className="size-5 stroke-[2]" />
        </button>

        <div className="px-12 pt-[38px]">
          <h2 className="text-[20px] font-semibold leading-[28px] text-[#303133]">上架配置</h2>
        </div>
        <div className="mx-6 mt-3 h-px bg-[#e9e9e9]" />

        <div className="px-12 pt-[26px]">
          <div className="space-y-[26px]">
            <div className="space-y-[11px]">
              <FormLabel required>做市商</FormLabel>
              <SelectBox value={MARKET_MAKER_NAME} disabled className="w-full" />
            </div>

            <div className="space-y-[11px]">
              <FormLabel required>资产名称</FormLabel>
              <SelectBox placeholder="请选择资产" className="w-full" />
            </div>

            <div className="space-y-[9px]">
              <FormLabel>当前可继续上架数量</FormLabel>
              <TextInput placeholder="选择资产后展示" disabled />
              <p className="max-w-[402px] text-[14px] font-semibold leading-[22px] text-[#909399]">
                已自动扣除当前仍在售的挂单数量，这里展示的是本次还能继续配置的数量上限
              </p>
            </div>

            <div className="space-y-[11px]">
              <div className="flex items-center gap-1">
                <FormLabel required>本次挂单数量</FormLabel>
                <CircleHelp className="mt-[1px] size-[15px] text-[#909399]" />
              </div>
              <TextInput placeholder="请输入" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-[#e9e9e9] px-12 py-[25px]">
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`${outlineButtonClassName} w-16`}
            >
              取 消
            </button>
            <button
              type="button"
              onClick={() => showWarningToast("请先连接钱包")}
              className={`${outlineButtonClassName} w-[88px]`}
            >
              连接钱包
            </button>
            <button
              type="button"
              onClick={() => showWarningToast("请选择资产名称")}
              className={`${primaryButtonClassName} w-[88px]`}
            >
              确定上架
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RepurchaseListingPage({ initialConfigOpen = false }: { initialConfigOpen?: boolean }) {
  const searchParams = useSearchParams();
  const roleQuery = searchParams.get("role");
  const configQuery = searchParams.get("config");
  const shouldOpenConfig = initialConfigOpen || configQuery === "1" || configQuery === "open";
  const viewer = useMemo(() => getRepurchaseCurrentViewer(roleQuery), [roleQuery]);
  const [configOpen, setConfigOpen] = useState(() => shouldOpenConfig);

  return (
    <div className="w-full">
      <div className="mb-[10px] flex items-center gap-[10px] text-[15px] font-semibold leading-[22px]">
        <span className="text-[#909399]">做市上架</span>
        <span className="text-[#909399]">/</span>
        <span className="text-[#303133]">回购上架</span>
      </div>

      <FilterCard />
      <ListingTableCard onOpenConfig={() => setConfigOpen(true)} />
      <ListingConfigModal open={configOpen} onClose={() => setConfigOpen(false)} />

      <span className="sr-only">当前角色：{viewer.role}</span>
    </div>
  );
}
