"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle, CircleX } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { feedbackCopy } from "@/lib/feedback-copy";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type BannerConfig = {
  text: string;
  onClick?: () => void;
};

type CriticalModalConfig = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

type GlobalFeedbackContextValue = {
  showSuccessToast: (
    text: string,
    action?: { label: string; onClick: () => void },
    options?: { duration?: number }
  ) => void;
  showWarningToast: (text: string) => void;
  showErrorToast: (text: string, options?: { duration?: number }) => void;
  showNetworkBanner: (config?: Partial<BannerConfig>) => void;
  hideNetworkBanner: () => void;
  showCriticalModal: (config: CriticalModalConfig) => void;
  hideCriticalModal: () => void;
  blockRegion: (text?: string) => void;
  unblockRegion: () => void;
};

const DEFAULT_NETWORK_BANNER =
  feedbackCopy.auth.switchBsc.cn;
const DEFAULT_REGION_BLOCK_TEXT =
  feedbackCopy.auth.regionBlocked.cn;

const GlobalFeedbackContext = createContext<GlobalFeedbackContextValue | null>(
  null
);

type ToastTone = "success" | "warning" | "error";

function HyperToast({
  tone,
  text,
  onAction,
  actionLabel,
}: {
  tone: ToastTone;
  text: string;
  onAction?: () => void;
  actionLabel?: string;
}) {
  const toneStyles =
    tone === "success"
      ? {
          icon: <CheckCircle2 className="size-4 text-emerald-300" />,
          dot: "bg-emerald-400",
          border: "border-emerald-400/30",
          action:
            "border-emerald-300/30 text-emerald-100 hover:bg-emerald-300/10",
        }
      : tone === "warning"
        ? {
            icon: <AlertTriangle className="size-4 text-amber-300" />,
            dot: "bg-amber-400",
            border: "border-amber-300/30",
            action:
              "border-amber-300/30 text-amber-100 hover:bg-amber-300/10",
          }
        : {
            icon: <CircleX className="size-4 text-red-300" />,
            dot: "bg-red-400",
            border: "border-red-400/30",
            action:
              "border-red-300/30 text-red-100 hover:bg-red-300/10",
          };

  return (
    <div
      className={`w-[360px] rounded-xl border ${toneStyles.border} bg-[#0f1115] p-3 shadow-[0_14px_40px_rgba(0,0,0,0.5)]`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex items-center gap-2">
          <span className={`size-1.5 rounded-full ${toneStyles.dot}`} />
          {toneStyles.icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium leading-5 text-zinc-100">{text}</p>
        </div>
        {onAction && actionLabel ? (
          <button
            type="button"
            className={`rounded-md border px-2 py-1 text-xs transition ${toneStyles.action}`}
            onClick={onAction}
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function GlobalFeedbackProvider({ children }: { children: ReactNode }) {
  const [networkBanner, setNetworkBanner] = useState<BannerConfig | null>(null);
  const [regionBlockText, setRegionBlockText] = useState<string | null>(null);
  const [criticalModal, setCriticalModal] = useState<CriticalModalConfig | null>(
    null
  );

  const showSuccessToast = useCallback(
    (
      text: string,
      action?: { label: string; onClick: () => void },
      options?: { duration?: number }
    ) => {
      toast.custom(
        () => (
          <HyperToast
            tone="success"
            text={text}
            actionLabel={action?.label}
            onAction={action?.onClick}
          />
        ),
        { position: "top-right", duration: options?.duration }
      );
    },
    []
  );

  const showWarningToast = useCallback((text: string) => {
    toast.custom(() => <HyperToast tone="warning" text={text} />, {
      position: "top-right",
    });
  }, []);

  const showErrorToast = useCallback((text: string, options?: { duration?: number }) => {
    toast.custom(() => <HyperToast tone="error" text={text} />, {
      position: "top-right",
      duration: options?.duration,
    });
  }, []);

  const showNetworkBanner = useCallback((config?: Partial<BannerConfig>) => {
    setNetworkBanner({
      text: config?.text ?? DEFAULT_NETWORK_BANNER,
      onClick: config?.onClick,
    });
  }, []);

  const hideNetworkBanner = useCallback(() => {
    setNetworkBanner(null);
  }, []);

  const showCriticalModal = useCallback((config: CriticalModalConfig) => {
    setCriticalModal(config);
  }, []);

  const hideCriticalModal = useCallback(() => {
    setCriticalModal(null);
  }, []);

  const blockRegion = useCallback((text?: string) => {
    setRegionBlockText(text ?? DEFAULT_REGION_BLOCK_TEXT);
  }, []);

  const unblockRegion = useCallback(() => {
    setRegionBlockText(null);
  }, []);

  const value = useMemo<GlobalFeedbackContextValue>(
    () => ({
      showSuccessToast,
      showWarningToast,
      showErrorToast,
      showNetworkBanner,
      hideNetworkBanner,
      showCriticalModal,
      hideCriticalModal,
      blockRegion,
      unblockRegion,
    }),
    [
      showSuccessToast,
      showWarningToast,
      showErrorToast,
      showNetworkBanner,
      hideNetworkBanner,
      showCriticalModal,
      hideCriticalModal,
      blockRegion,
      unblockRegion,
    ]
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <GlobalFeedbackContext.Provider value={value}>
        {networkBanner ? (
          <button
            className="fixed inset-x-0 top-0 z-[90] flex min-h-12 w-full items-center justify-center bg-red-700 px-4 py-2 text-sm font-semibold text-white"
            onClick={networkBanner.onClick}
            type="button"
          >
            {networkBanner.text}
          </button>
        ) : null}

        {regionBlockText ? (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/72 px-6 text-center">
            <p className="max-w-2xl text-lg font-semibold text-white sm:text-2xl">
              {regionBlockText}
            </p>
          </div>
        ) : null}

        <Dialog
          open={Boolean(criticalModal)}
          onOpenChange={(open) => {
            if (!open) {
              hideCriticalModal();
            }
          }}
        >
          <DialogContent className="real-modal-surface border-red-500/40 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="real-modal-title text-red-300">
                {criticalModal?.title}
              </DialogTitle>
              <DialogDescription className="text-zinc-300">
                {criticalModal?.description}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <Button
                className="rounded-lg border border-red-300/30 bg-red-500/20 text-white hover:bg-red-500/30"
                onClick={() => {
                  criticalModal?.onAction?.();
                  hideCriticalModal();
                }}
              >
                {criticalModal?.actionLabel ?? "关闭"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster
          theme="dark"
          closeButton={false}
          toastOptions={{
            duration: 3200,
          }}
        />
        {children}
      </GlobalFeedbackContext.Provider>
    </ThemeProvider>
  );
}

export function useGlobalFeedback() {
  const context = useContext(GlobalFeedbackContext);

  if (!context) {
    throw new Error(
      "useGlobalFeedback must be used within GlobalFeedbackProvider"
    );
  }

  return context;
}
