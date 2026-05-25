"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { TopNav } from "@/projects/realrwa-demo/components/realrwa/top-nav";
import { ConnectWalletModal } from "@/projects/realrwa-demo/components/realrwa/connect-wallet-modal";
import { IdentityVerificationModal } from "@/projects/realrwa-demo/components/realrwa/identity-verification-modal";
import { useGlobalFeedback } from "@/components/feedback/global-feedback-provider";
import { useRwaAppState } from "@/projects/realrwa-demo/components/realrwa/app-state-provider";

type ShellProps = {
  activeNav?: number;
  children: ReactNode;
  defaultWalletMenuOpen?: boolean;
  topNavRightAction?: ReactNode;
};

type ShellActions = {
  openConnect: () => void;
  openIdentityVerification: () => void;
};

const ShellActionsContext = createContext<ShellActions | null>(null);

export function RealRwaShell({
  activeNav = 0,
  children,
  defaultWalletMenuOpen = false,
  topNavRightAction,
}: ShellProps) {
  const [connectOpen, setConnectOpen] = useState(false);
  const [identityOpen, setIdentityOpen] = useState(false);
  useGlobalFeedback();
  useRwaAppState();
  useSuppressKnownExtensionErrors();
  useShellEventBridge(setConnectOpen, setIdentityOpen);
  const actions = useMemo<ShellActions>(
    () => ({
      openConnect: () => setConnectOpen(true),
      openIdentityVerification: () => setIdentityOpen(true),
    }),
    []
  );

  return (
    <main className="realrwa-shell min-h-screen overflow-x-hidden bg-black pt-[72px] text-white">
      <ShellActionsContext.Provider value={actions}>
        <TopNav
          activeIndex={activeNav}
          defaultWalletMenuOpen={defaultWalletMenuOpen}
          onConnectWallet={() => setConnectOpen(true)}
          onOpenIdentityVerification={() => setIdentityOpen(true)}
          rightAction={topNavRightAction}
        />
        {children}

        <ConnectWalletModal open={connectOpen} onClose={() => setConnectOpen(false)} />
        <IdentityVerificationModal
          open={identityOpen}
          onOpenChange={setIdentityOpen}
        />
      </ShellActionsContext.Provider>
    </main>
  );
}

function isKnownExtensionChainIdError(errorLike: unknown, source?: string) {
  const message =
    typeof errorLike === "string"
      ? errorLike
      : errorLike instanceof Error
        ? errorLike.message
        : typeof (errorLike as { message?: unknown })?.message === "string"
          ? ((errorLike as { message: string }).message)
          : "";

  const isChainIdMutationError = message.includes(
    "Cannot set property chainId of #<d> which has only a getter"
  );
  const isExtensionSource = typeof source === "string" && source.startsWith("chrome-extension://");
  return isChainIdMutationError && isExtensionSource;
}

export const OPEN_CONNECT_EVENT = "realrwa-open-connect";
export const OPEN_IDENTITY_VERIFICATION_EVENT = "realrwa-open-identity-verification";

function useShellEventBridge(
  setConnectOpen: (open: boolean) => void,
  setIdentityOpen: (open: boolean) => void
) {
  useEffect(() => {
    const onConnect = () => setConnectOpen(true);
    const onIdentity = () => setIdentityOpen(true);
    window.addEventListener(OPEN_CONNECT_EVENT, onConnect);
    window.addEventListener(OPEN_IDENTITY_VERIFICATION_EVENT, onIdentity);
    return () => {
      window.removeEventListener(OPEN_CONNECT_EVENT, onConnect);
      window.removeEventListener(OPEN_IDENTITY_VERIFICATION_EVENT, onIdentity);
    };
  }, [setConnectOpen, setIdentityOpen]);
}

function useSuppressKnownExtensionErrors() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      if (isKnownExtensionChainIdError(event.error ?? event.message, event.filename)) {
        event.preventDefault();
      }
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const stack =
        typeof (reason as { stack?: unknown })?.stack === "string"
          ? ((reason as { stack: string }).stack)
          : "";
      const extensionSource = stack.match(/chrome-extension:\/\/[^\s)]+/)?.[0];
      if (isKnownExtensionChainIdError(reason, extensionSource)) {
        event.preventDefault();
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);
}

export function useShellActions() {
  const actions = useContext(ShellActionsContext);
  if (!actions) {
    throw new Error("useShellActions must be used inside RealRwaShell");
  }
  return actions;
}
