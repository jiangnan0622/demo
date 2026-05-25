"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Lang } from "@/projects/realrwa-demo/lib/realrwa-i18n";
import { rwaText } from "@/projects/realrwa-demo/lib/realrwa-i18n";

type RwaAppState = {
  lang: Lang;
  text: (typeof rwaText)[Lang];
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  walletConnected: boolean;
  walletAddress: string;
  identityBound: boolean;
  identityEmail: string;
  identityName: string;
  identityCountry: string;
  displayIdentity: string;
  platformUsd1Balance: number;
  connectWallet: () => void;
  disconnectWallet: () => void;
  bindIdentity: (payload: {
    email: string;
    surname: string;
    givenName: string;
    country: string;
    signature: string;
  }) => void;
};

const AppStateContext = createContext<RwaAppState | null>(null);

const DEFAULT_WALLET_ADDRESS = "0xd8250...cfD78438";
const DEFAULT_IDENTITY = {
  email: "744123@qq.com",
  name: "Zhangsan",
  country: "CN",
} as const;

function maskEmail(email: string) {
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf("@");
  if (atIndex <= 1) return trimmed;
  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex);
  const head = local.slice(0, Math.min(3, local.length));
  return `${head}...${domain}`;
}

export function RwaAppStateProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("cn");
  const [walletConnected, setWalletConnected] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string>(DEFAULT_WALLET_ADDRESS);
  const [identityBound, setIdentityBound] = useState(true);
  const [identityEmail, setIdentityEmail] = useState<string>(DEFAULT_IDENTITY.email);
  const [identityName, setIdentityName] = useState<string>(DEFAULT_IDENTITY.name);
  const [identityCountry, setIdentityCountry] = useState<string>(DEFAULT_IDENTITY.country);
  const [identityRegistry, setIdentityRegistry] = useState<
    Record<string, { email: string; name: string; country: string }>
  >({
    [DEFAULT_WALLET_ADDRESS]: DEFAULT_IDENTITY,
  });
  const [platformUsd1Balance] = useState(99920);

  const value = useMemo<RwaAppState>(
    () => ({
      lang,
      text: rwaText[lang],
      setLang,
      toggleLang: () => setLang((prev) => (prev === "cn" ? "en" : "cn")),
      walletConnected,
      walletAddress,
      identityBound,
      identityEmail,
      identityName,
      identityCountry,
      displayIdentity: identityBound ? maskEmail(identityEmail) : walletAddress,
      platformUsd1Balance,
      connectWallet: () => {
        const address = DEFAULT_WALLET_ADDRESS;
        setWalletConnected(true);
        setWalletAddress(address);
        // Simulate backend bind-status query result by address.
        const boundProfile = identityRegistry[address];
        if (boundProfile) {
          setIdentityBound(true);
          setIdentityEmail(boundProfile.email);
          setIdentityName(boundProfile.name);
          setIdentityCountry(boundProfile.country);
          return;
        }
        setIdentityBound(false);
        setIdentityEmail("");
        setIdentityName("");
        setIdentityCountry("");
      },
      disconnectWallet: () => {
        setWalletConnected(false);
        setIdentityBound(false);
        setIdentityEmail("");
        setIdentityName("");
        setIdentityCountry("");
      },
      bindIdentity: ({ email, surname, givenName, country }) => {
        const name = `${surname}${givenName}`;
        setIdentityBound(true);
        setIdentityEmail(email);
        setIdentityName(name);
        setIdentityCountry(country);
        setIdentityRegistry((prev) => ({
          ...prev,
          [walletAddress]: {
            email,
            name,
            country,
          },
        }));
      },
    }),
    [
      lang,
      walletConnected,
      walletAddress,
      identityBound,
      identityEmail,
      identityName,
      identityCountry,
      identityRegistry,
      platformUsd1Balance,
    ]
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useRwaAppState() {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error("useRwaAppState must be used inside RwaAppStateProvider");
  }
  return value;
}
