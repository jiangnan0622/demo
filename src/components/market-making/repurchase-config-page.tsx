"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGlobalFeedback } from "@/components/feedback/global-feedback-provider";
import { REPURCHASE_STABLECOIN_OPTIONS } from "@/lib/market-making/mock-data";
import {
  getRepurchaseAssets,
  getRepurchaseCurrentViewer,
  getRepurchaseListingById,
  getRepurchaseMarketMakers,
  saveRepurchaseListing,
} from "@/services/market-making.service";
import type {
  RepurchaseAssetOption,
  RepurchaseListedPrice,
  RepurchaseMarketMakerOption,
  RepurchaseStablecoin,
  RepurchaseViewerContext,
} from "@/lib/market-making/types";

type ListedPriceFormRow = {
  stablecoin: RepurchaseStablecoin;
  price: string;
};

function createInitialPriceRows(): ListedPriceFormRow[] {
  return [{ stablecoin: "USDC", price: "" }];
}

function findNextStablecoin(rows: ListedPriceFormRow[]) {
  const used = new Set(rows.map((item) => item.stablecoin));
  return REPURCHASE_STABLECOIN_OPTIONS.find((item) => !used.has(item)) ?? null;
}

export function RepurchaseConfigPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showErrorToast, showSuccessToast, showWarningToast } = useGlobalFeedback();

  const editId = searchParams.get("id");
  const roleQuery = searchParams.get("role");
  const isEdit = Boolean(editId);

  const [viewer, setViewer] = useState<RepurchaseViewerContext | null>(null);
  const [assetId, setAssetId] = useState("");
  const [assetName, setAssetName] = useState("");
  const [marketMakerId, setMarketMakerId] = useState("");
  const [marketMakerName, setMarketMakerName] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [listedQuantity, setListedQuantity] = useState("");
  const [listedPrices, setListedPrices] = useState<ListedPriceFormRow[]>(createInitialPriceRows());
  const [assets, setAssets] = useState<RepurchaseAssetOption[]>([]);
  const [marketMakers, setMarketMakers] = useState<RepurchaseMarketMakerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const listUrl = useMemo(() => {
    const role = roleQuery === "marketMaker" ? "marketMaker" : "admin";
    return `/backEnd/marketMaking/repurchase?role=${role}`;
  }, [roleQuery]);

  useEffect(() => {
    setViewer(getRepurchaseCurrentViewer(roleQuery));
  }, [roleQuery]);

  const loadMarketMakers = useCallback(
    async (nextViewer: RepurchaseViewerContext) => {
      const list = await getRepurchaseMarketMakers(nextViewer);
      setMarketMakers(list);
    },
    []
  );

  const loadAssets = useCallback(
    async (nextViewer: RepurchaseViewerContext, scopedMarketMakerId: string) => {
      if (!scopedMarketMakerId) {
        setAssets([]);
        return;
      }
      const list = await getRepurchaseAssets({
        viewer: nextViewer,
        marketMakerId: scopedMarketMakerId,
      });
      setAssets(list);
    },
    []
  );

  useEffect(() => {
    if (!viewer) {
      return;
    }

    void (async () => {
      setLoading(true);
      try {
        await loadMarketMakers(viewer);

        if (isEdit && editId) {
          const detail = await getRepurchaseListingById(editId, viewer);
          if (!detail) {
            showErrorToast("未找到当前上架记录");
            router.replace(listUrl);
            return;
          }
          setMarketMakerId(detail.marketMakerId);
          setMarketMakerName(detail.marketMakerName);
          setAssetId(detail.assetId);
          setAssetName(detail.assetName);
          setAvailableQuantity(String(detail.availableQuantity));
          setListedQuantity(String(detail.listedQuantity));
          setListedPrices(
            detail.listedPrices.map((item) => ({
              stablecoin: item.stablecoin,
              price: String(item.price),
            }))
          );
        } else if (viewer.role === "marketMaker" && viewer.marketMakerId) {
          setMarketMakerId(viewer.marketMakerId);
          setMarketMakerName(viewer.marketMakerName ?? "");
          await loadAssets(viewer, viewer.marketMakerId);
          setListedPrices(createInitialPriceRows());
        } else {
          setListedPrices(createInitialPriceRows());
        }
      } catch {
        showErrorToast("配置加载失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    })();
  }, [viewer, isEdit, editId, loadMarketMakers, loadAssets, router, showErrorToast, listUrl]);

  async function handleSubmit() {
    if (!viewer) {
      return;
    }

    const effectiveMarketMakerId =
      viewer.role === "marketMaker" ? viewer.marketMakerId ?? "" : marketMakerId;

    if (!effectiveMarketMakerId) {
      showWarningToast("请选择做市商");
      return;
    }

    if (!assetId) {
      showWarningToast("请选择资产名称");
      return;
    }

    const numericAvailable = Number(availableQuantity);
    const numericListed = Number(listedQuantity);
    if (!listedQuantity || Number.isNaN(numericListed) || numericListed <= 0) {
      showWarningToast("请输入大于 0 的上架数量");
      return;
    }
    if (Number.isFinite(numericAvailable) && numericListed > numericAvailable) {
      showWarningToast("上架数量不能超过当前可继续上架数量");
      return;
    }

    const nextListedPrices: RepurchaseListedPrice[] = [];
    for (const item of listedPrices) {
      const numericPrice = Number(item.price);
      if (!item.price || Number.isNaN(numericPrice) || numericPrice <= 0) {
        showWarningToast("请输入有效的稳定币上架价格");
        return;
      }
      nextListedPrices.push({
        stablecoin: item.stablecoin,
        price: numericPrice,
      });
    }

    if (nextListedPrices.length === 0) {
      showWarningToast("请至少配置一条稳定币价格");
      return;
    }

    setSaving(true);
    try {
      await saveRepurchaseListing(
        {
          id: editId ?? undefined,
          marketMakerId: effectiveMarketMakerId,
          assetId,
          listedQuantity: numericListed,
          listedPrices: nextListedPrices,
        },
        viewer
      );
      showSuccessToast(isEdit ? "修改成功" : "上架成功");
      router.push(listUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "保存失败，请稍后重试";
      showErrorToast(message);
    } finally {
      setSaving(false);
    }
  }

  const showMarketMakerSelect = viewer?.role === "admin" && !isEdit;
  const showMarketMakerReadonly = viewer?.role === "admin" && isEdit;
  const assetReadonly = isEdit;

  return (
    <div className="max-w-[1200px] space-y-4">
      <div className="space-y-1 px-1">
        <p className="text-[13px] text-[#909399]">做市上架 / 回购上架</p>
        <h1 className="text-[22px] font-semibold text-[#303133]">上架配置</h1>
      </div>

      <section className="overflow-hidden rounded-[2px] border border-[#ebeef5] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="px-4 py-6">
          <div className="rounded-[2px] border border-[#f0f2f5] bg-white p-6">
            <div className="space-y-1">
              <h2 className="text-[20px] font-semibold text-[#303133]">上架配置</h2>
              <p className="text-[13px] text-[#909399]">
                {isEdit
                  ? "调整当前挂单的数量与多稳定币价格，记录归属不可更改"
                  : viewer?.role === "marketMaker"
                    ? "选择可回购上架的资产后，配置本次挂单数量与多稳定币价格"
                    : "选择做市商与回购资产后，配置本次挂单数量与多稳定币价格"}
              </p>
            </div>

            {loading || !viewer ? (
              <div className="py-16 text-center text-[14px] text-[#909399]">配置加载中...</div>
            ) : (
              <div className="mt-8 max-w-[760px] space-y-6">
                {showMarketMakerSelect ? (
                  <div className="space-y-2">
                    <label className="text-[14px] text-[#303133]">做市商</label>
                    <select
                      value={marketMakerId}
                      onChange={(event) => {
                        const nextId = event.target.value;
                        const nextMaker = marketMakers.find((item) => item.id === nextId);
                        setMarketMakerId(nextId);
                        setMarketMakerName(nextMaker?.name ?? "");
                        setAssetId("");
                        setAssetName("");
                        setAvailableQuantity("");
                        void loadAssets(viewer, nextId);
                      }}
                      className="h-10 w-full rounded-[2px] border border-[#dcdfe6] bg-white px-3 text-sm text-black outline-none"
                    >
                      <option value="">请选择做市商</option>
                      {marketMakers.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {showMarketMakerReadonly ? (
                  <div className="space-y-2">
                    <label className="text-[14px] text-[#303133]">做市商</label>
                    <Input
                      value={marketMakerName}
                      disabled
                      className="h-10 rounded-[2px] border border-[#dcdfe6] bg-[#f5f7fa] text-sm text-[#606266] shadow-none"
                    />
                  </div>
                ) : null}

                <div className="space-y-2">
                  <label className="text-[14px] text-[#303133]">资产名称</label>
                  {assetReadonly ? (
                    <Input
                      value={assetName}
                      disabled
                      className="h-10 rounded-[2px] border border-[#dcdfe6] bg-[#f5f7fa] text-sm text-[#606266] shadow-none"
                    />
                  ) : (
                    <select
                      value={assetId}
                      onChange={(event) => {
                        const nextId = event.target.value;
                        const nextAsset = assets.find((item) => item.id === nextId);
                        setAssetId(nextId);
                        setAssetName(nextAsset?.name ?? "");
                        setAvailableQuantity(nextAsset ? String(nextAsset.availableQuantity) : "");
                      }}
                      className="h-10 w-full rounded-[2px] border border-[#dcdfe6] bg-white px-3 text-sm text-black outline-none"
                      disabled={viewer.role === "admin" && !marketMakerId}
                    >
                      <option value="">请选择资产名称</option>
                      {assets.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[14px] text-[#303133]">当前可继续上架数量</label>
                  <Input
                    value={availableQuantity}
                    disabled
                    className="h-10 rounded-[2px] border border-[#dcdfe6] bg-[#f5f7fa] text-sm text-[#606266] shadow-none"
                  />
                  <p className="text-[12px] text-[#909399]">
                    已自动扣除当前仍在售的挂单数量，这里展示的是本次还能继续配置的数量上限
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[14px] text-[#303133]">本次挂单数量</label>
                  <Input
                    value={listedQuantity}
                    onChange={(event) => setListedQuantity(event.target.value)}
                    placeholder="请输入本次挂单数量"
                    inputMode="numeric"
                    className="h-10 rounded-[2px] border border-[#dcdfe6] bg-white text-sm text-black shadow-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[14px] text-[#303133]">上架价格</label>
                  <div className="space-y-3">
                    {listedPrices.map((item, index) => {
                      const availableStablecoins = REPURCHASE_STABLECOIN_OPTIONS.filter(
                        (stablecoin) =>
                          stablecoin === item.stablecoin ||
                          !listedPrices.some((current, currentIndex) => currentIndex !== index && current.stablecoin === stablecoin)
                      );

                      return (
                        <div key={`${item.stablecoin}-${index}`} className="flex items-center gap-3">
                          <select
                            value={item.stablecoin}
                            onChange={(event) => {
                              const nextStablecoin = event.target.value as RepurchaseStablecoin;
                              setListedPrices((current) =>
                                current.map((currentItem, currentIndex) =>
                                  currentIndex === index
                                    ? {
                                        ...currentItem,
                                        stablecoin: nextStablecoin,
                                      }
                                    : currentItem
                                )
                              );
                            }}
                            className="h-10 w-[140px] rounded-[2px] border border-[#dcdfe6] bg-white px-3 text-sm text-black outline-none"
                          >
                            {availableStablecoins.map((stablecoin) => (
                              <option key={stablecoin} value={stablecoin}>
                                {stablecoin}
                              </option>
                            ))}
                          </select>
                          <Input
                            value={item.price}
                            onChange={(event) =>
                              setListedPrices((current) =>
                                current.map((currentItem, currentIndex) =>
                                  currentIndex === index
                                    ? {
                                        ...currentItem,
                                        price: event.target.value,
                                      }
                                    : currentItem
                                )
                              )
                            }
                            placeholder="请输入上架价格"
                            inputMode="decimal"
                            className="h-10 rounded-[2px] border border-[#dcdfe6] bg-white text-sm text-black shadow-none"
                          />
                          {listedPrices.length > 1 ? (
                            <button
                              type="button"
                              className="inline-flex h-10 w-10 items-center justify-center rounded-[2px] border border-[#dcdfe6] text-[#909399] transition hover:border-[#c0c4cc] hover:text-[#606266]"
                              onClick={() =>
                                setListedPrices((current) => current.filter((_, currentIndex) => currentIndex !== index))
                              }
                            >
                              <Trash2 className="size-4" />
                            </button>
                          ) : null}
                        </div>
                      );
                    })}
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-[#909399]">支持配置 USDC、USDT、USD1，不同稳定币价格需在 0.90 - 1.10 区间</span>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 rounded-[2px] border border-[#dcdfe6] bg-white px-3 text-[12px] font-normal text-[#303133] shadow-none hover:bg-[#f5f7fa]"
                        onClick={() => {
                          const nextStablecoin = findNextStablecoin(listedPrices);
                          if (!nextStablecoin) {
                            showWarningToast("已添加全部稳定币价格");
                            return;
                          }
                          setListedPrices((current) => [...current, { stablecoin: nextStablecoin, price: "" }]);
                        }}
                      >
                        <Plus className="size-3.5" />
                        新增
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="h-10 rounded-[2px] border border-[#dcdfe6] bg-white px-8 text-[14px] font-normal text-[#303133] shadow-none hover:bg-[#f5f7fa]"
                    onClick={() => router.push(listUrl)}
                  >
                    取消
                  </Button>
                  <Button
                    className="h-10 rounded-[2px] bg-[#2f80ed] px-8 text-[14px] font-normal text-white shadow-none hover:bg-[#1766cf]"
                    onClick={() => void handleSubmit()}
                    disabled={saving}
                  >
                    {saving ? "提交中..." : "确定上架"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
