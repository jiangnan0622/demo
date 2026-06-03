"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowLeftRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Copy,
  CircleHelp,
  Globe2,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  UserCircle,
  WalletCards,
  X,
} from "lucide-react";
import { publicAsset } from "@/lib/public-asset";
import {
  commissionRows,
  inviteSteps,
  inviteeRows,
  lendingRows,
  portfolioAssets,
  portfolioHoldingRows,
  portfolioOverviewData,
  realMobileBasePath,
  realMobileOrders,
  realMobileProducts,
  reserveRows,
  type RealMobileProduct,
  type TableRow,
} from "@/projects/real-mobile-demo/lib/real-mobile-data";
import styles from "./real-mobile-demo.module.css";

type RealMobileDemoProps = {
  slug?: string[];
};

const moreMenuItems = [
  { label: "市场", path: "/market" },
  { label: "OTC", path: "/otc" },
  { label: "邀请", path: "/invite" },
  { label: "白皮书", path: "/whitepaper" },
  { label: "服务条款", path: "/terms" },
];

function toDemoPath(path: string) {
  const [pathname, query] = path.split("?");
  const normalizedPath = pathname === "/" ? "" : pathname;
  return `${realMobileBasePath}${normalizedPath}${query ? `?${query}` : ""}`;
}

function getRoutePath(slug?: string[]) {
  if (!slug || slug.length === 0) return "/";
  return `/${slug.join("/")}`;
}

function getProgress(product: RealMobileProduct) {
  if (product.totalSupply <= 0) return 0;
  return Math.min((product.soldAmount / product.totalSupply) * 100, 100);
}

function getProduct(id?: string | null) {
  return realMobileProducts.find((product) => product.id === id || product.symbol === id) ?? realMobileProducts[0];
}

function orderTradeProducts(products: RealMobileProduct[]) {
  return [...products].sort((a, b) => {
    if (a.id === "fuidl") return -1;
    if (b.id === "fuidl") return 1;
    return 0;
  });
}

export function RealMobileDemo({ slug }: RealMobileDemoProps) {
  const routePath = getRoutePath(slug);
  const searchParams = useSearchParams();
  const product = getProduct(searchParams.get("coin"));
  const tab1 = searchParams.get("tab1") ?? "detail";
  const tab2 = searchParams.get("tab2") ?? "buy";
  const isConnected = !["/connect", "/connect/metamask", "/onboarding", "/onboarding/buy"].includes(routePath);

  const content = (() => {
    if (routePath === "/") return <TradePage connected={false} />;
    if (routePath === "/trade") return <TradePage connected={isConnected} />;
    if (routePath === "/search-empty") return <TradePage connected={isConnected} forceEmpty />;
    if (routePath === "/market") return <MarketPage />;
    if (routePath === "/coinDetail") return <CoinDetailPage product={product} tab1={tab1} tab2={tab2} />;
    if (routePath === "/buy" || routePath === "/sell") return <CoinDetailPage product={product} tab1="trade" tab2={routePath.replace("/", "")} />;
    if (routePath === "/redeem") return <CoinDetailPage product={product} tab1="stake" tab2="redeem" />;
    if (routePath === "/claim") {
      return <TransactionPage routePath={routePath} product={product} />;
    }
    if (routePath === "/stake") return <StakePage />;
    if (routePath === "/stake/detail") return <StakeDetailPage />;
    if (routePath === "/stake/operate") return <StakeOperatePage product={product} />;
    if (routePath === "/orders") return <OrdersPage />;
    if (routePath === "/orders/detail") return <OrderDetailPage />;
    if (routePath === "/otc") return <InfoPage title="OTC" subtitle="场外交易服务" body="为大额 RWA 资产买卖提供报价、撮合和结算支持。" />;
    if (routePath === "/whitepaper") return <InfoPage title="白皮书" subtitle="Real Finance 产品说明" body="白皮书将介绍产品架构、资产准入、流动性设计和风险披露。" />;
    if (routePath === "/terms") return <InfoPage title="服务条款" subtitle="使用 Real Finance 前请阅读" body="所有交易、质押、赎回和邀请活动均以正式服务条款为准。" />;
    if (routePath === "/portfolio" || routePath === "/myPortfolio") return <PortfolioPage title="我的投资组合" />;
    if (routePath === "/reserve") return <ReservePage />;
    if (routePath === "/insurance") return <InsurancePage />;
    if (routePath === "/lending") return <LendingPage />;
    if (routePath.startsWith("/lending/")) return <LendingDetailPage />;
    if (routePath === "/invite") return <InvitePage />;
    if (routePath === "/invite/detail") return <InviteeDetailPage />;
    if (routePath === "/invite/commission") return <CommissionPage />;
    if (routePath === "/invite/commission/detail") return <CommissionDetailPage title="佣金详情" />;
    if (routePath === "/my") return <UserMenuPage verified={false} />;
    if (routePath === "/my/verified") return <UserMenuPage verified />;
    if (routePath === "/kyc") return <KycPage />;
    if (routePath === "/connect") return <ConnectWalletPage />;
    if (routePath === "/connect/metamask") return <ConnectingWalletPage />;
    if (routePath === "/onboarding") return <OnboardingPage />;
    if (routePath === "/onboarding/buy") return <OnRampPage />;
    if (routePath === "/register") return <RegisterPage />;
    if (routePath === "/result") return <ResultPage />;
    return <TradePage connected={isConnected} />;
  })();

  const bottomActive = routePath === "/orders" || routePath === "/orders/detail" ? "orders" : routePath === "/myPortfolio" || routePath === "/portfolio" ? "assets" : "market";
  const showBottom = ["/trade", "/market", "/orders", "/portfolio", "/myPortfolio"].includes(routePath);

  return (
    <div className={styles.shell}>
      <div className={styles.phone}>
        <main className={`${styles.page} ${!showBottom ? styles.noBottom : ""}`}>{content}</main>
        {showBottom ? <BottomTab active={bottomActive} /> : null}
      </div>
    </div>
  );
}

function Header({
  connected = true,
  searchValue,
  onSearchChange,
}: {
  connected?: boolean;
  searchValue?: string;
  onSearchChange?: (next: string) => void;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const hasSearch = searchValue !== undefined && Boolean(onSearchChange);
  const safeSearchValue = searchValue ?? "";
  const handleSearchChange = onSearchChange ?? (() => undefined);

  const handleUserClick = () => {
    if (connected) {
      setAccountOpen(true);
      return;
    }
    router.push(toDemoPath("/connect"));
  };

  return (
    <>
      <header className={styles.header}>
        {hasSearch && searchOpen ? (
          <div className={styles.headerSearchBox}>
            <Search size={18} />
            <input autoFocus value={safeSearchValue} onChange={(event) => handleSearchChange(event.target.value)} placeholder="搜索产品" type="search" />
            <button
              className={styles.iconButton}
              type="button"
              aria-label="关闭搜索"
              onClick={() => {
                handleSearchChange("");
                setSearchOpen(false);
              }}
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <>
            <div className={styles.headerLeft}>
              <Link href={toDemoPath("/trade")} aria-label="Real mobile market">
                <img className={styles.logo} src={publicAsset("/realrwa/figma/real-logo-gold-cropped.png")} alt="REAL" />
              </Link>
              <button className={styles.iconButton} type="button" aria-label="打开菜单" onClick={() => setDrawerOpen(true)}>
                <Menu size={28} strokeWidth={2} />
              </button>
            </div>
            <div className={styles.headerActions}>
              {hasSearch ? (
                <button className={styles.iconButton} type="button" aria-label="打开搜索" onClick={() => setSearchOpen(true)}>
                  <Search size={22} strokeWidth={2} />
                </button>
              ) : null}
              <button className={styles.userButton} type="button" aria-label={connected ? "我的" : "连接钱包"} onClick={handleUserClick}>
                <UserCircle size={28} strokeWidth={1.9} />
              </button>
            </div>
          </>
        )}
      </header>
      {drawerOpen ? <RouteDrawer onClose={() => setDrawerOpen(false)} /> : null}
      {connected && accountOpen ? <AccountDrawer onClose={() => setAccountOpen(false)} /> : null}
    </>
  );
}

function SubHeader({ title, right }: { title: string; right?: ReactNode }) {
  const router = useRouter();

  return (
    <header className={styles.subHeader}>
      <button className={styles.iconButton} type="button" aria-label="返回" onClick={() => router.back()}>
        <ArrowLeft size={24} />
      </button>
      <div className={styles.subHeaderTitle}>{title}</div>
      <div className={styles.subHeaderRight}>{right}</div>
    </header>
  );
}

function RouteDrawer({ onClose }: { onClose: () => void }) {
  return (
    <>
      <button className={styles.drawerScrim} type="button" aria-label="关闭菜单" onClick={onClose} />
      <aside className={styles.drawer}>
        <div className={styles.drawerHead}>
          <div className={styles.drawerTitle}>更多</div>
          <button className={styles.iconButton} type="button" aria-label="关闭菜单" onClick={onClose}>
            <X size={22} />
          </button>
        </div>
        <nav className={styles.moreMenuList}>
          {moreMenuItems.map((item) => (
            <Link className={styles.moreMenuItem} href={toDemoPath(item.path)} key={item.path} onClick={onClose}>
              <span>{item.label}</span>
              <ChevronRight size={22} />
            </Link>
          ))}
        </nav>
        <div className={styles.languageSwitch}>
          <button className={styles.languageActive} type="button">简体中文</button>
          <button type="button">English</button>
        </div>
      </aside>
    </>
  );
}

function AccountDrawer({ onClose }: { onClose: () => void }) {
  return (
    <>
      <button className={styles.drawerScrim} type="button" aria-label="关闭我的弹层" onClick={onClose} />
      <aside className={styles.accountDrawer}>
        <div className={styles.drawerHead}>
          <div className={styles.drawerTitle}>我的</div>
          <button className={styles.iconButton} type="button" aria-label="关闭我的弹层" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className={styles.accountProfileList}>
          <div className={styles.accountProfileRow}>
            <span className={styles.accountCircleIcon}>
              <BadgeCheck size={28} />
            </span>
            <strong>744895374@qq.com</strong>
            <em>已认证</em>
          </div>
          <div className={styles.accountProfileRow}>
            <span className={styles.accountCircleIcon}>
              <UserCircle size={28} />
            </span>
            <strong>0x31ad...f7b5</strong>
            <button type="button" aria-label="复制钱包地址">
              <Copy size={22} />
            </button>
          </div>
          <Link className={styles.accountProfileRow} href={toDemoPath("/myPortfolio")} onClick={onClose}>
            <span className={styles.accountCircleIcon}>
              <ClipboardList size={28} />
            </span>
            <strong>我的投资组合</strong>
            <ChevronRight size={24} />
          </Link>
          <Link className={styles.accountProfileRow} href={toDemoPath("/onboarding")} onClick={onClose}>
            <span className={styles.accountCircleIcon}>
              <LogOut size={28} />
            </span>
            <strong>断开连接</strong>
            <ChevronRight size={24} />
          </Link>
        </div>
      </aside>
    </>
  );
}

function TradePage({ connected = true, forceEmpty = false }: { connected?: boolean; forceEmpty?: boolean }) {
  const [query, setQuery] = useState(forceEmpty ? "XYZ" : "");
  const products = forceEmpty
    ? []
    : orderTradeProducts(realMobileProducts.filter((product) => `${product.symbol}${product.name}${product.publisher}`.toLowerCase().includes(query.toLowerCase())));

  return (
    <>
      <Header connected={connected} searchValue={query} onSearchChange={setQuery} />
      <TradeBanner />
      <section className={styles.contentStack}>
        {connected ? <MarketSummaryStrip /> : null}
        {products.length > 0 ? (
          <div className={styles.cardList}>
            {products.map((product, index) => (
              <AssetCard product={product} defaultExpanded={index === 0} key={product.id} />
            ))}
          </div>
        ) : (
          <EmptyState title="暂无匹配结果" />
        )}
      </section>
    </>
  );
}

function MarketSummaryStrip() {
  const yesterdayReward = portfolioHoldingRows[0]?.detail.yesterdayReward ?? "0.000000";
  const yesterdayRewardNumber = Number.parseFloat(yesterdayReward.replace(/,/g, ""));
  const yesterdayRewardLabel = Number.isFinite(yesterdayRewardNumber) ? yesterdayRewardNumber.toFixed(2) : yesterdayReward;

  return (
    <Link className={styles.marketSummaryStrip} href={toDemoPath("/myPortfolio")} aria-label="查看资产与收益">
      <div className={styles.summaryMetric}>
        <span>总资产</span>
        <strong>{portfolioOverviewData.totalAssetValue}</strong>
      </div>
      <div className={styles.summaryMetric}>
        <span>昨日收益</span>
        <strong>{yesterdayRewardLabel}</strong>
      </div>
      <em className={styles.summaryAction}>
        查看资产
        <ChevronRight size={13} />
      </em>
    </Link>
  );
}

function TradeBanner() {
  return (
    <section className={styles.tradeBanner}>
      <img className={styles.tradeBannerImage} src={publicAsset("/real-mobile/trade-banner.png")} alt="" aria-hidden="true" />
      <div className={styles.tradeBannerOverlay} />
      <div className={styles.tradeBannerContent}>
        <h1>Real Finance</h1>
        <p>用区块链技术重构金融产品流动性</p>
      </div>
    </section>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return (
    <label className={styles.searchBox}>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="搜索" type="search" />
      <Search size={20} />
    </label>
  );
}

function AssetCard({ product, defaultExpanded = false }: { product: RealMobileProduct; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const router = useRouter();
  const progress = getProgress(product);
  const canBuy = product.status === "selling";
  const disabled = !canBuy;
  const detailPath = toDemoPath(`/coinDetail?coin=${product.id}&tab1=detail`);

  const handleCardClick = () => {
    router.push(detailPath);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      router.push(detailPath);
    }
  };

  const stopCardNavigation = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  return (
    <article
      className={styles.assetCard}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`查看 ${product.symbol} 详情`}
    >
      {disabled ? (
        <img className={styles.statusStamp} src={publicAsset("/real-mobile/status-sold-out.svg")} alt="已售罄" />
      ) : (
        <img className={styles.cardWatermark} src={product.logoUrl} alt="" aria-hidden="true" />
      )}
      <div className={styles.assetHeader}>
        <img className={styles.tokenIcon} src={product.logoUrl} alt={product.symbol} />
        <div className={styles.tokenText}>
          <h2>{product.symbol}</h2>
          <p>{product.name}</p>
        </div>
      </div>

      <div className={styles.priceGrid}>
        <div>
          <span className={styles.fieldCaption}>价格</span>
          <div className={styles.valuePill}>
            <strong>{product.priceUnit.replace(" USDC", "")}</strong>
            <span>USDC</span>
          </div>
        </div>
        <div>
          <span className={styles.fieldCaption}>综合收益构成</span>
          <div className={styles.valuePill}>
            <strong>{product.apr}</strong>
            <span>%</span>
          </div>
        </div>
      </div>

      <div className={styles.progressPanel}>
        <div className={styles.progressTrack}>
          <span className={disabled ? styles.progressFull : styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <button
          className={styles.poolRow}
          type="button"
          aria-expanded={expanded}
          onClick={(event) => {
            stopCardNavigation(event);
            setExpanded((isExpanded) => !isExpanded);
          }}
        >
          <span>已售出</span>
          <strong className={disabled ? styles.fullPool : styles.activePool}>
            {product.soldLabel}/{product.totalLabel}
          </strong>
          <ChevronDown className={expanded ? styles.chevronUp : ""} size={20} />
        </button>
        {expanded ? (
          <div className={styles.expandedDetail}>
            <InfoLine label="底层资产" value={product.publisher} />
            <InfoLine label="产品流动性" value={product.liquidity} />
            <InfoLine label="交易时限" value="工作日 11:00 前" />
            <InfoLine label="底层规模" value={product.managementScale} />
          </div>
        ) : null}
      </div>

      <div className={`${styles.actions} ${styles.singleAction}`} onClick={stopCardNavigation}>
        {!canBuy ? (
          <button className={`${styles.disabledButton} ${styles.cardPrimaryAction}`} type="button" disabled>
            已售罄
          </button>
        ) : (
          <Link className={`${styles.goldButton} ${styles.cardPrimaryAction}`} href={toDemoPath(`/coinDetail?coin=${product.id}&tab1=trade&tab2=buy`)}>
            购买
          </Link>
        )}
      </div>
    </article>
  );
}

function MarketPage() {
  return (
    <>
      <Header />
      <TradeBanner />
      <section className={styles.contentStack}>
        <SearchBox value="" onChange={() => undefined} />
        <SectionTitle title="市场" subtitle="更新时间 2026-06-01 10:00" />
        {realMobileProducts.map((product) => (
          <article className={styles.marketRow} key={product.id}>
            <div className={styles.marketToken}>
              <img src={product.logoUrl} alt={product.symbol} />
              <div>
                <strong>{product.symbol}</strong>
                <span>{product.name}</span>
              </div>
            </div>
            <div className={styles.marketMetrics}>
              <InfoLine label="市值" value={product.marketCap} />
              <InfoLine label="年化收益率" value={`${product.apr}%`} />
              <InfoLine label="24小时交易量" value={product.volume24h} />
            </div>
            <Link className={styles.goldButton} href={toDemoPath(`/coinDetail?coin=${product.id}&tab1=trade&tab2=buy`)}>
              购买
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}

function CoinDetailPage({ product, tab1, tab2 }: { product: RealMobileProduct; tab1: string; tab2: string }) {
  const activeTab = ["detail", "trade", "stake", "holders"].includes(tab1) ? tab1 : "detail";

  return (
    <>
      <Header />
      <SubHeader title="债券详情" />
      <section className={styles.detailHero}>
        <img className={styles.detailWatermark} src={product.logoUrl} alt="" aria-hidden="true" />
        <div className={styles.detailToken}>
          <img src={product.logoUrl} alt={product.symbol} />
          <div>
            <h1>{product.symbol}</h1>
            <p>{product.publisher}</p>
          </div>
        </div>
      </section>

      <nav className={`${styles.segmented} ${styles.coinTabs}`}>
        <TabLink product={product} active={activeTab === "detail"} tab="detail" label="详情" />
        <TabLink product={product} active={activeTab === "trade"} tab="trade" label="交易" />
        <TabLink product={product} active={activeTab === "stake"} tab="stake" label="质押" />
        <TabLink product={product} active={activeTab === "holders"} tab="holders" label="持有者" />
      </nav>

      {activeTab === "detail" ? <BondDetailPanel product={product} /> : null}
      {activeTab === "trade" ? <InlineTradePanel product={product} tab2={tab2} /> : null}
      {activeTab === "stake" ? <InlineStakePanel product={product} tab2={tab2} /> : null}
      {activeTab === "holders" ? <HoldersPanel /> : null}
    </>
  );
}

function TabLink({ product, active, tab, label }: { product: RealMobileProduct; active: boolean; tab: string; label: string }) {
  return (
    <Link className={`${styles.segmentedItem} ${active ? styles.segmentedActive : ""}`} href={toDemoPath(`/coinDetail?coin=${product.id}&tab1=${tab}`)}>
      {label}
    </Link>
  );
}

function getProductMerchant(product: RealMobileProduct) {
  if (product.id === "fuidl") return "复星财富控股";

  return product.publisher;
}

function getDetailMarketCap(product: RealMobileProduct) {
  if (product.id === "fuidl") return "$999.00M";

  return product.marketCap;
}

function getDetailTotalSupply(product: RealMobileProduct) {
  if (product.id === "fuidl") return `999.00M ${product.symbol}`;

  return `${product.totalLabel} ${product.symbol}`;
}

function BondDetailPanel({ product }: { product: RealMobileProduct }) {
  const detailRows: [string, ReactNode][] = [
    ["商家", getProductMerchant(product)],
    ["交易时限", "工作日11点前"],
    ["单次起购数量", `起购1 ${product.symbol},1倍递增`],
    ["链上市值", getDetailMarketCap(product)],
    ["总供应量", getDetailTotalSupply(product)],
    ["总交易量（24h）", "$0.00"],
  ];

  return (
    <>
      <section className={styles.productInfoPanel}>
        <div className={styles.productFeatureRow}>
          <span>产品特点:</span>
          <strong>{product.tags[0] ?? "标准债券"}</strong>
        </div>
        <div className={styles.productFactsGrid}>
          {detailRows.map(([label, value]) => (
            <InfoLine label={`${label}:`} value={value} key={label} />
          ))}
        </div>
      </section>
      <section className={styles.noticePanel}>
        <h2>商家公告栏</h2>
        <EmptyState title="暂无数据" />
      </section>
    </>
  );
}

function ModeTabs({ items }: { items: Array<{ label: string; href: string; active: boolean; disabled?: boolean }> }) {
  return (
    <nav className={`${styles.operationModeTabs} ${items.length > 2 ? styles.operationModeTabsWide : ""}`}>
      {items.map((item) =>
        "disabled" in item && item.disabled ? (
          <span className={styles.operationModeDisabled} key={item.label}>
            {item.label}
          </span>
        ) : (
          <Link className={item.active ? styles.operationModeActive : ""} href={toDemoPath(item.href)} key={item.label}>
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
}

function SwapQuoteCards({ product, mode }: { product: RealMobileProduct; mode: string }) {
  const leftUnit = mode === "buy" ? "USDC" : product.symbol;
  const rightUnit = mode === "buy" ? product.symbol : mode === "sell" ? "USDC" : mode === "stake" ? "R凭证" : product.symbol;
  const leftIcon = mode === "buy" ? publicAsset("/tokens/usdc.svg") : product.logoUrl;
  const rightIcon = rightUnit === "USDC" ? publicAsset("/tokens/usdc.svg") : product.logoUrl;

  return (
    <div className={styles.swapQuoteGrid}>
      <TokenQuoteCard iconUrl={leftIcon} unit={leftUnit} value="1.00" />
      <div className={styles.swapIconButton}>
        <ArrowLeftRight size={22} />
      </div>
      <TokenQuoteCard iconUrl={rightIcon} unit={rightUnit} value={rightUnit === product.symbol ? "1.0000" : "1.00"} />
    </div>
  );
}

function TokenQuoteCard({ iconUrl, unit, value }: { iconUrl: string; unit: string; value: string }) {
  return (
    <div className={styles.tokenQuoteCard}>
      <div>
        <img src={iconUrl} alt={unit} />
        <span>{unit}</span>
        <ChevronDown size={16} />
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function OperationInput({ label, value, unit, iconUrl }: { label: string; value: string; unit: string; iconUrl: string }) {
  return (
    <label className={styles.operationInput}>
      <span>{label}</span>
      <div>
        <input value={value} readOnly />
        <em>
          <img src={iconUrl} alt={unit} />
          {unit}
          <button type="button">最大</button>
        </em>
      </div>
    </label>
  );
}

function FeePanel() {
  return (
    <div className={styles.feePanel}>
      <strong>手续费: 0.000000 BNB <span>≈$0.00</span></strong>
      <em>可用：0.0226 BNB</em>
    </div>
  );
}

function InlineTradePanel({ product, tab2 }: { product: RealMobileProduct; tab2: string }) {
  const canBuy = product.status === "selling";
  const mode = tab2 === "sell" || !canBuy ? "sell" : "buy";
  return (
    <section className={styles.operationPanel}>
      <ModeTabs
        items={[
          { label: "购买", href: `/coinDetail?coin=${product.id}&tab1=trade&tab2=buy`, active: mode === "buy", disabled: !canBuy },
          { label: "卖出", href: `/coinDetail?coin=${product.id}&tab1=trade&tab2=sell`, active: mode === "sell" },
        ]}
      />
      <SwapQuoteCards product={product} mode={mode} />
      <OperationInput label="数量" value="0.00" unit={mode === "buy" ? product.symbol : "USDC"} iconUrl={mode === "buy" ? product.logoUrl : publicAsset("/tokens/usdc.svg")} />
      <div className={styles.availableLine}>可用: --</div>
      <OperationInput label="价值" value="0.00" unit={mode === "buy" ? "USDC" : product.symbol} iconUrl={mode === "buy" ? publicAsset("/tokens/usdc.svg") : product.logoUrl} />
      <div className={styles.availableLine}>可用: -- {mode === "buy" ? <Link href={toDemoPath("/onboarding")}>去充值</Link> : null}</div>
      <FeePanel />
      <button className={styles.operationSubmit} type="button" disabled>
        {mode === "buy" ? "购买" : "卖出"}
      </button>
    </section>
  );
}

function InlineStakePanel({ product, tab2 }: { product: RealMobileProduct; tab2: string }) {
  const mode = tab2 === "redeem" ? "redeem" : tab2 === "claim" ? "claim" : "stake";

  return (
    <section className={styles.operationPanel}>
      <ModeTabs
        items={[
          { label: "质押", href: `/coinDetail?coin=${product.id}&tab1=stake&tab2=stake`, active: mode === "stake" },
          { label: "赎回", href: `/coinDetail?coin=${product.id}&tab1=stake&tab2=redeem`, active: mode === "redeem" },
          { label: "领取", href: `/coinDetail?coin=${product.id}&tab1=stake&tab2=claim`, active: mode === "claim" },
        ]}
      />
      {mode === "claim" ? (
        <>
          <OperationInput label="领取数量" value="0.00" unit="REAL" iconUrl={publicAsset("/realrwa/figma/real-logo-gold-cropped.png")} />
          <div className={styles.availableLine}>可领取: --</div>
        </>
      ) : (
        <>
          <SwapQuoteCards product={product} mode={mode} />
          <OperationInput label="数量" value="0.00" unit={mode === "stake" ? product.symbol : "R凭证"} iconUrl={product.logoUrl} />
          <div className={styles.availableLine}>可用: --</div>
          <OperationInput label="价值" value="0.00" unit={mode === "stake" ? "R凭证" : product.symbol} iconUrl={product.logoUrl} />
          <div className={styles.availableLine}>可用: --</div>
        </>
      )}
      <FeePanel />
      <button className={styles.operationSubmit} type="button" disabled>
        {mode === "stake" ? "质押" : mode === "redeem" ? "赎回" : "领取"}
      </button>
    </section>
  );
}

function StakePage() {
  return (
    <>
      <Header />
      <section className={styles.featureBanner}>
        <p>质押债券代币</p>
        <h1>让 RWA 持仓产生每日奖励</h1>
      </section>
      <div className={styles.metricGrid}>
        <Metric label="总质押" value="2.48M" />
        <Metric label="总奖励" value="186.30K" />
      </div>
      <section className={styles.contentStack}>
        <SectionTitle title="我的质押列表" />
        {portfolioAssets.slice(0, 2).map((asset) => (
          <PositionCard key={asset.token} title={asset.token} rows={[["质押收益率", asset.apr], ["累计收益", asset.reward], ["可用余额", asset.balance]]} action="更多" href="/stake/detail" />
        ))}
        <SectionTitle title="债券列表" />
        {realMobileProducts.slice(0, 2).map((product) => (
          <AssetCard key={product.id} product={product} />
        ))}
      </section>
    </>
  );
}

function StakeDetailPage() {
  return (
    <>
      <SubHeader title="质押详情" />
      <section className={styles.surface}>
        <SectionTitle title="srXWCT reward dashboard" subtitle="查看质押仓位、奖励记录、领取历史和产品收益参考。" />
        <div className={styles.metricGrid}>
          <Metric label="可用余额" value="100,000.01" />
          <Metric label="参考年化" value="10.05%" />
        </div>
      </section>
      <SimpleTable columns={[["date", "日期"], ["type", "类型"], ["amount", "金额"]]} rows={commissionRows.slice(0, 4)} />
    </>
  );
}

function StakeOperatePage({ product }: { product: RealMobileProduct }) {
  return (
    <>
      <SubHeader title="质押" />
      <StakeOperatePanel product={product} />
    </>
  );
}

function StakeOperatePanel({ product, compact = false }: { product: RealMobileProduct; compact?: boolean }) {
  return (
    <section className={styles.formPanel}>
      {!compact ? <p className={styles.copy}>质押债券代币后，收益领取频率会根据 REAL 持仓动态调控。</p> : null}
      <AmountField label="质押数量" value="0.00" unit={product.symbol} />
      <AmountField label="预计获得" value="0.00" unit="R凭证" />
      <InfoLine label="兑换比例" value={`1 ${product.symbol} = 1 R凭证`} />
      <InfoLine label="参考年化" value={`${product.apr}%`} />
      <InfoLine label="预计月收益" value="325 R凭证" />
      <div className={styles.timeline}>
        <InfoLine label="认购日期" value="2026-06-01" />
        <InfoLine label="预计收益开始累计" value="T+1" />
        <InfoLine label="收益发放日期" value="每日 18:00" />
      </div>
      <Link className={styles.fullGoldButton} href={toDemoPath("/result")}>
        质押
      </Link>
    </section>
  );
}

function OrdersPage() {
  return (
    <>
      <Header />
      <section className={styles.orderListPage}>
        <h1>订单列表</h1>
        <div className={styles.orderFilters}>
          <button className={styles.orderSelect} type="button">
            <span>所有订单</span>
            <ChevronDown size={22} />
          </button>
          <button className={styles.dateRange} type="button">
            <span>开始日期</span>
            <ChevronRight size={18} />
            <span>结束日期</span>
            <CalendarDays size={20} />
          </button>
        </div>
        {realMobileOrders.map((order) => (
          <OrderListCard order={order} key={order.id} />
        ))}
        <OrderPagination />
      </section>
    </>
  );
}

function OrderDetailPage() {
  const order = realMobileOrders[0];
  return (
    <>
      <SubHeader title="订单详情" />
      <section className={styles.surface}>
        <SectionTitle title={`${order.type} ${order.token}`} subtitle={order.id} />
        <InfoLine label="交易类型" value={order.type} />
        <InfoLine label="钱包地址" value={order.address} />
        <InfoLine label="交易价格" value={order.price} />
        <InfoLine label="交易数量" value={`${order.amount} ${order.token}`} />
        <InfoLine label="交易价值" value={order.value} />
        <InfoLine label="创建时间" value={order.time} />
        <InfoLine label="订单状态" value={order.status} />
      </section>
      <Link className={styles.fullGoldButton} href={toDemoPath("/orders")}>
        返回订单
      </Link>
    </>
  );
}

function OrderListCard({ order }: { order: (typeof realMobileOrders)[number] }) {
  const isSell = order.amount.startsWith("-");

  return (
    <Link className={styles.orderListCard} href={toDemoPath("/orders/detail")}>
      <div className={styles.orderCardTop}>
        <strong>{order.type} {order.token}</strong>
        <span className={isSell ? styles.orderAmountSell : styles.orderAmountBuy}>
          {order.amount} <em>{order.token}</em>
        </span>
      </div>
      <div className={styles.orderCardBottom}>
        <time>{order.time}</time>
        <span className={styles.orderSuccess}>
          <CheckCircle2 size={18} />
          {order.status}
        </span>
      </div>
    </Link>
  );
}

function OrderPagination() {
  return (
    <div className={styles.orderPagination}>
      <button className={styles.orderPageArrow} type="button" aria-label="上一页">
        <ChevronLeft size={22} />
      </button>
      {["1", "2", "3", "4", "5"].map((page) => (
        <button className={page === "1" ? styles.orderPageActive : ""} type="button" key={page}>
          {page}
        </button>
      ))}
      <button className={styles.orderPageArrow} type="button" aria-label="下一页">
        <ChevronRight size={22} />
      </button>
    </div>
  );
}

function InfoPage({ title, subtitle, body }: { title: string; subtitle: string; body: string }) {
  return (
    <>
      <Header />
      <section className={styles.featureBanner}>
        <p>{subtitle}</p>
        <h1>{title}</h1>
      </section>
      <section className={styles.surface}>
        <p className={styles.copy}>{body}</p>
      </section>
    </>
  );
}

function PortfolioPage({ title }: { title: string }) {
  const router = useRouter();
  const [expandedToken, setExpandedToken] = useState<string | null>(portfolioHoldingRows[0]?.token ?? null);

  return (
    <>
      <Header />
      <section className={styles.portfolioPage}>
        <button className={styles.portfolioBackRow} type="button" onClick={() => router.back()}>
          <ArrowLeft size={24} />
          <span>{title}</span>
        </button>

        <div className={styles.portfolioSectionTitle}>资产概览</div>

        <section className={styles.portfolioOverviewCard}>
          <div className={styles.portfolioOverviewDecor} aria-hidden="true">
            <span className={styles.portfolioDecorCircleLarge} />
            <span className={styles.portfolioDecorCircleOne} />
            <span className={styles.portfolioDecorCircleTwo} />
            <span className={styles.portfolioDecorCircleThree} />
            <span className={styles.portfolioDecorCircleFour} />
          </div>
          <div className={styles.portfolioOverviewGrid}>
            <div className={styles.portfolioOverviewStat}>
              <div className={styles.portfolioOverviewLabel}>
                <span>总资产价值</span>
                <CircleHelp size={14} />
              </div>
              <div className={styles.portfolioOverviewPill}>
                <em>$</em>
                <strong>{portfolioOverviewData.totalAssetValue}</strong>
              </div>
              <p>{portfolioOverviewData.totalAssetApprox}</p>
            </div>
            <div className={styles.portfolioOverviewStat}>
              <div className={styles.portfolioOverviewLabel}>
                <span>可用资产价值</span>
                <CircleHelp size={14} />
              </div>
              <div className={styles.portfolioOverviewPill}>
                <em>$</em>
                <strong>{portfolioOverviewData.availableAssetValue}</strong>
              </div>
              <p>{portfolioOverviewData.availableAssetApprox}</p>
            </div>
            <div className={styles.portfolioOverviewStat}>
              <div className={styles.portfolioOverviewLabel}>
                <span>iREAL余额</span>
                <CircleHelp size={14} />
              </div>
              <div className={styles.portfolioOverviewPill}>
                <strong>{portfolioOverviewData.irealBalance}</strong>
                <b>{portfolioOverviewData.irealUnit}</b>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.portfolioSectionTitle}>资产列表</div>

        <div className={styles.portfolioHoldingList}>
          {portfolioHoldingRows.map((asset) => {
            const expanded = expandedToken === asset.token;
            const product = getProduct(asset.productId);
            const canBuy = product.status === "selling";

            return (
              <article className={`${styles.portfolioHoldingPanel} ${expanded ? styles.portfolioHoldingPanelOpen : ""}`} key={asset.token}>
                <button
                  className={`${styles.portfolioHoldingCard} ${expanded ? styles.portfolioHoldingCardOpen : ""}`}
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setExpandedToken(expanded ? null : asset.token)}
                >
                  <img className={styles.portfolioHoldingIcon} src={asset.logoUrl} alt={asset.token} />
                  <div className={styles.portfolioHoldingText}>
                    <strong>{asset.token}</strong>
                    <span>{asset.subtitle}</span>
                  </div>
                  <div className={styles.portfolioHoldingValue}>
                    <strong>{asset.amount}</strong>
                    <span>{asset.approx}</span>
                  </div>
                  <ChevronDown className={expanded ? styles.portfolioHoldingChevronOpen : ""} size={22} />
                </button>

                {expanded ? (
                  <>
                    <div className={styles.portfolioHoldingDetail}>
                      <PortfolioDetailRow label="质押收益率" value={asset.detail.stakingYield} />
                      <PortfolioDetailRow label="累计收益" value={asset.detail.cumulativeReward} hint={asset.detail.cumulativeRewardApprox} />
                      <PortfolioDetailRow label="昨日收益" value={asset.detail.yesterdayReward} hint={asset.detail.yesterdayRewardApprox} />
                      <PortfolioDetailRow label="可用余额" value={asset.detail.availableBalance} hint={asset.detail.availableApprox} />
                    </div>
                    <div className={styles.portfolioHoldingActions}>
                      <Link className={styles.portfolioOutlineAction} href={toDemoPath(`/coinDetail?coin=${asset.productId}`)}>更多</Link>
                      <Link className={styles.portfolioOutlineAction} href={toDemoPath(`/coinDetail?coin=${asset.productId}&tab1=stake&tab2=stake`)}>质押</Link>
                      <Link className={styles.portfolioGoldAction} href={toDemoPath(`/coinDetail?coin=${asset.productId}&tab1=trade&tab2=${canBuy ? "buy" : "sell"}`)}>{canBuy ? "购买" : "卖出"}</Link>
                    </div>
                  </>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

function PortfolioDetailRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className={styles.portfolioDetailRow}>
      <span>{label}</span>
      <div>
        <strong>{value}</strong>
        {hint ? <em>{hint}</em> : null}
      </div>
    </div>
  );
}

function TransactionPage({ routePath, product }: { routePath: string; product: RealMobileProduct }) {
  const map: Record<string, { title: string; primary: string; label: string; unit: string; helper: string }> = {
    "/buy": { title: "购买", primary: "确认购买", label: "支付金额", unit: "USDC", helper: "购买提交后，将在订单列表中显示链上确认状态。" },
    "/sell": { title: "卖出", primary: "确认卖出", label: "卖出数量", unit: product.symbol, helper: "选择做市商报价后，预计获得 USDC。" },
    "/redeem": { title: "赎回", primary: "确认赎回", label: "赎回数量", unit: product.symbol, helper: "提交后不可撤销，请仔细确认。" },
    "/claim": { title: "奖励", primary: "领取", label: "领取数量", unit: "REAL", helper: "收益领取次数会根据 REAL 持仓动态调控。" },
  };
  const copy = map[routePath] ?? map["/buy"];

  return (
    <>
      <SubHeader title={copy.title} />
      <section className={styles.formPanel}>
        <p className={styles.copy}>{copy.helper}</p>
        <AmountField label={copy.label} value="0.00" unit={copy.unit} />
        <AmountField label="预计获得" value="0.00" unit={routePath === "/buy" ? product.symbol : "USDC"} />
        <InfoLine label="可用" value="100,000.01 USDC" />
        <InfoLine label="GAS 费" value="0.005 BNB" />
        <Link className={styles.fullGoldButton} href={toDemoPath("/result")}>
          {copy.primary}
        </Link>
      </section>
    </>
  );
}

function ReservePage() {
  return (
    <>
      <Header />
      <section className={styles.featureBanner}>
        <p>储备金证明</p>
        <h1>链上流动性和赎回缓冲层</h1>
      </section>
      <SimpleTable columns={[["type", "储备类型"], ["value", "份额价值"], ["update", "更新时间"]]} rows={reserveRows} />
    </>
  );
}

function InsurancePage() {
  return (
    <>
      <Header />
      <section className={styles.featureBanner}>
        <p>保险</p>
        <h1>默认事件保护池和风险缓冲</h1>
      </section>
      <PositionCard title="风险保护池" rows={[["覆盖状态", "已生效"], ["覆盖资产", "rXWCT / rFUIDL"], ["默认事件", "0"]]} action="详情" href="/insurance" />
      <PositionCard title="保单记录" rows={[["保单状态", "生效中"], ["保护额度", "220.00K USDC"], ["下次更新", "2026-06-08"]]} action="详情" href="/insurance" />
    </>
  );
}

function LendingPage() {
  return (
    <>
      <Header />
      <section className={styles.surface}>
        <SectionTitle title="借贷" subtitle="供应资产、借入资产、健康因子和 REAL 奖励。" />
        <div className={styles.metricGrid}>
          <Metric label="净值" value="$18.72K" />
          <Metric label="健康因子" value="2.81" />
        </div>
      </section>
      {lendingRows.map((row) => (
        <PositionCard key={row.asset} title={row.asset} rows={[["可供应", row.available], ["APR", row.apr], ["利用率", row.liquidity]]} action="供应" href="/lending/corporate-bond" />
      ))}
    </>
  );
}

function LendingDetailPage() {
  return (
    <>
      <SubHeader title="借贷详情" />
      <section className={styles.surface}>
        <SectionTitle title="公司 A" subtitle="供应和借入该资产前，请确认 LTV、清算阈值和预言机价格。" />
        <InfoLine label="储备规模" value="1.20M USDC" />
        <InfoLine label="可用流动性" value="840.00K USDC" />
        <InfoLine label="最大 LTV" value="72%" />
        <InfoLine label="清算阈值" value="80%" />
        <InfoLine label="每日奖励" value="128 REAL" />
      </section>
      <div className={styles.actions}>
        <Link className={styles.outlineButton} href={toDemoPath("/result")}>借款</Link>
        <Link className={styles.goldButton} href={toDemoPath("/result")}>供应</Link>
      </div>
    </>
  );
}

function InvitePage() {
  return (
    <>
      <Header />
      <section className={styles.inviteHero}>
        <div>
          <p>邀请计划</p>
          <h1>通过 Real 推荐计划，邀请好友一起参与 RWA 交易。</h1>
        </div>
        <Link className={styles.goldButton} href={toDemoPath("/invite/commission")}>我的佣金</Link>
      </section>
      <section className={styles.posterGrid}>
        <img src={publicAsset("/real-mobile/invitation.png")} alt="精英邀请海报" />
        <img src={publicAsset("/real-mobile/invitation-data.png")} alt="数据证明海报" />
      </section>
      <section className={styles.surface}>
        <SectionTitle title="邀请方式" subtitle="连接钱包，一键生成您的专属邀请链接与多场景推广海报。" />
        <CopyRow label="邀请码" value="WEB123" />
        <CopyRow label="邀请链接" value="https://real.finance/i/WEB123" />
      </section>
      <section className={styles.surface}>
        <SectionTitle title="如何邀请好友获得收益" />
        <div className={styles.stepList}>
          {inviteSteps.map((step, index) => (
            <div className={styles.stepItem} key={step.title}>
              <span>{index + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function InviteeDetailPage() {
  return (
    <>
      <SubHeader title="被邀请人详情" />
      <section className={styles.surface}>
        <SectionTitle title="数据来源" subtitle="统计周期 2026-05-01 至 2026-06-01" />
        <InfoLine label="注册时间" value="2026-05-18 10:24" />
        <InfoLine label="有效邀请" value="是" />
        <InfoLine label="受邀人总交易额" value="14,797.20 USDC" />
        <InfoLine label="佣金总额" value="68.20 USD1" />
      </section>
      <SimpleTable columns={[["date", "日期"], ["type", "类型"], ["amount", "金额"]]} rows={commissionRows.slice(0, 3)} />
    </>
  );
}

function CommissionPage() {
  return (
    <>
      <SubHeader title="佣金记录" />
      <div className={`${styles.segmented} ${styles.recordsTabs}`}>
        <button className={styles.segmentedActive} type="button">被邀请人</button>
        <button type="button">佣金</button>
      </div>
      <SimpleTable columns={[["address", "被邀请人地址"], ["quantity", "数量"], ["volume", "总交易额"]]} rows={inviteeRows} />
      <TablePagination current="1" total="3" />
    </>
  );
}

function CommissionDetailPage({ title }: { title: string }) {
  return (
    <>
      <SubHeader title={title} />
      <section className={styles.surface}>
        <SectionTitle title={title} subtitle="统计周期 2026-05-01 至 2026-06-01" />
        <InfoLine label="合格受邀人数" value="12 人" />
        <InfoLine label="受邀人总交易额" value="28,091.37 USDC" />
        <InfoLine label="佣金总额" value="168.20 USD1" />
        <InfoLine label="质押利率加成" value="2.00%" />
        <InfoLine label="质押数量" value="8,000 rXWCT" />
      </section>
      <div className={`${styles.segmented} ${styles.recordsTabs}`}>
        <button className={styles.segmentedActive} type="button">佣金记录</button>
        <button type="button">受邀人</button>
      </div>
      <SimpleTable columns={[["date", "日期"], ["type", "类型"], ["amount", "金额"]]} rows={commissionRows} />
      <TablePagination current="1" total="4" />
    </>
  );
}

function UserMenuPage({ verified }: { verified: boolean }) {
  return (
    <>
      <SubHeader title="我的" />
      <section className={styles.accountSheet}>
        <SheetMenuRow label="我的" value={verified ? "已认证" : "未认证"} href={verified ? "/my/verified" : "/kyc"} active={verified} />
        <SheetMenuRow label="我的投资组合" value="查看" href="/myPortfolio" />
        <SheetMenuRow label="邀请" value="佣金/海报" href="/invite" />
        <SheetMenuRow label="断开连接" value="Disconnect" href="/onboarding" tall />
      </section>
    </>
  );
}

function KycPage() {
  return (
    <>
      <SubHeader title="认证" />
      <section className={styles.kycNotice}>
        <span>当前地址</span>
        <strong>0x93A1...7E21 未认证，请完成身份绑定后继续。</strong>
      </section>
      <section className={styles.kycForm}>
        <KycField label="名" placeholder="请输入" />
        <KycField label="姓" placeholder="请输入" />
        <KycField label="所在地区" placeholder="请选择" />
        <KycField label="邮箱" placeholder="请输入邮箱" />
        <KycField label="验证码" placeholder="请输入验证码" suffix="发送验证码" tall />
        <div className={styles.kycActions}>
          <Link className={styles.outlineButton} href={toDemoPath("/my")}>取消</Link>
          <Link className={styles.goldButton} href={toDemoPath("/my/verified")}>验证并绑定</Link>
        </div>
        <label className={styles.kycAgreement}>
          <input type="checkbox" defaultChecked />
          <span>我已阅读并同意 RealFinance 用户协议。</span>
        </label>
      </section>
    </>
  );
}

function ConnectWalletPage() {
  return (
    <>
      <Header connected={false} />
      <TradeBanner />
      <section className={styles.contentStack}>
        <SearchBox value="" onChange={() => undefined} />
        <AssetCard product={realMobileProducts[2]} />
      </section>
      <WalletConnectSheet />
    </>
  );
}

function ConnectingWalletPage() {
  return (
    <>
      <Header connected={false} />
      <TradeBanner />
      <WalletConnectSheet initialStatus="connecting" initialWallet="MetaMask" />
    </>
  );
}

type WalletStatus = "select" | "connecting" | "success";

function WalletConnectSheet({ initialStatus = "select", initialWallet = "MetaMask" }: { initialStatus?: WalletStatus; initialWallet?: string }) {
  const [status, setStatus] = useState<WalletStatus>(initialStatus);
  const [walletName, setWalletName] = useState(initialWallet);

  useEffect(() => {
    if (status !== "connecting") return;
    const timer = window.setTimeout(() => setStatus("success"), 1100);
    return () => window.clearTimeout(timer);
  }, [status]);

  const connectWallet = (nextWallet: string) => {
    setWalletName(nextWallet);
    setStatus("connecting");
  };

  return (
    <>
      <div className={styles.walletBackdrop} />
      <aside className={styles.walletDrawer}>
        {status === "select" ? (
          <>
            <div className={styles.walletDrawerHead}>
              <CircleHelp size={20} />
              <h1>连接钱包</h1>
              <Link href={toDemoPath("/")} aria-label="关闭连接钱包">
                <X size={24} />
              </Link>
            </div>
            <div className={styles.walletRows}>
              <WalletConnectRow name="MetaMask" kind="metamask" onSelect={connectWallet} />
              <WalletConnectRow name="OKX Wallet" kind="okx" onSelect={connectWallet} />
              <WalletConnectRow name="浏览器钱包" kind="browser" onSelect={connectWallet} />
              <WalletConnectRow name="搜索钱包" kind="search" badge="380" onSelect={connectWallet} />
            </div>
            <div className={styles.walletPowered}>
              <span>UX by</span>
              <b>.</b>
              <b>/</b>
              <strong>reown</strong>
            </div>
          </>
        ) : null}
        {status === "connecting" ? (
          <div className={styles.walletProgress}>
            <WalletLogo kind={walletName === "OKX Wallet" ? "okx" : walletName === "浏览器钱包" ? "browser" : "metamask"} />
            <h1>正在连接 {walletName}</h1>
            <p>请在钱包中确认连接请求，完成后将自动返回 Real Finance。</p>
            <span className={styles.connectSpinner} />
          </div>
        ) : null}
        {status === "success" ? (
          <div className={styles.walletProgress}>
            <div className={styles.successOrb}>
              <CheckCircle2 size={50} />
            </div>
            <h1>连接成功</h1>
            <p>{walletName} 已连接到 0x31ad...f7b5</p>
            <Link className={styles.fullGoldButton} href={toDemoPath("/myPortfolio")}>查看资产</Link>
          </div>
        ) : null}
      </aside>
    </>
  );
}

function WalletConnectRow({ name, kind, badge = "已安装", onSelect }: { name: string; kind: "metamask" | "okx" | "browser" | "search"; badge?: string; onSelect: (name: string) => void }) {
  return (
    <button className={styles.walletConnectRow} type="button" onClick={() => onSelect(name)}>
      <WalletLogo kind={kind} />
      <strong>{name}</strong>
      <em>{badge}</em>
      <ChevronRight size={22} />
    </button>
  );
}

function WalletLogo({ kind }: { kind: "metamask" | "okx" | "browser" | "search" }) {
  if (kind === "search") {
    return (
      <span className={`${styles.walletLogo} ${styles.walletLogoSearch}`}>
        <Search size={20} />
      </span>
    );
  }

  return <span className={`${styles.walletLogo} ${styles[`walletLogo${kind[0].toUpperCase()}${kind.slice(1)}`]}`} aria-hidden="true" />;
}

function OnboardingPage() {
  return (
    <>
      <Header connected={false} />
      <section className={styles.welcomeBanner}>
        <h1>欢迎来到 REAL</h1>
      </section>
      <section className={`${styles.formPanel} ${styles.onboardingPanel}`}>
        <p className={styles.copy}>请选择您的账户状态，以便为您提供最合适的服务</p>
        <div className={styles.onboardingChoices}>
          <ChoiceCard title="我已有 BSC 兼容钱包" desc="连接钱包后，可直接进入市场、交易和质押流程。" href="/connect" className={styles.onboardingPrimaryChoice} />
          <ChoiceCard title="我还没有钱包" desc="先购买稳定币，再完成链上资产交易。" href="/onboarding/buy" className={styles.onboardingSecondaryChoice} />
        </div>
      </section>
      <Link className={`${styles.fullGoldButton} ${styles.onboardingButton}`} href={toDemoPath("/trade")}>确认</Link>
    </>
  );
}

function OnRampPage() {
  return (
    <>
      <Header connected={false} />
      <section className={styles.onRampContent}>
        <SectionTitle title="法币与加密货币的桥梁" subtitle="支持信用卡、借记卡购买稳定币。" />
        <Link className={styles.onRampProvider} href={toDemoPath("/onboarding/buy")}>
          <div>
            <span>入金机构</span>
            <strong>REAL Fiat Gateway</strong>
          </div>
          <ChevronRight size={18} />
        </Link>
        <div className={styles.onRampSwap}>
          <OnRampField label="支付" value="100.00" unit="USD" />
          <div className={styles.swapDivider}>
            <ChevronDown size={20} />
          </div>
          <OnRampField label="接收" value="99.40" unit="USDC" />
        </div>
      </section>
      <Link className={`${styles.fullGoldButton} ${styles.onboardingButton}`} href={toDemoPath("/trade")}>购买稳定币</Link>
    </>
  );
}

function RegisterPage() {
  return (
    <>
      <SubHeader title="预售登记" />
      <section className={styles.formPanel}>
        <TextField label="币种" placeholder="REAL" />
        <TextField label="登记邮箱" placeholder="请输入邮箱地址" />
        <TextField label="购买数量" placeholder="请输入购买数量" />
        <Link className={styles.fullGoldButton} href={toDemoPath("/result")}>提交</Link>
      </section>
    </>
  );
}

function ResultPage() {
  return (
    <>
      <SubHeader title="结果" />
      <section className={styles.resultPanel}>
        <CheckCircle2 size={58} />
        <h1>提交成功</h1>
        <p>交易已进入订单列表，您可以继续查看订单状态或返回资产页管理持仓。</p>
      </section>
      <div className={styles.actions}>
        <Link className={styles.outlineButton} href={toDemoPath("/myPortfolio")}>返回资产</Link>
        <Link className={styles.goldButton} href={toDemoPath("/orders")}>查看订单</Link>
      </div>
    </>
  );
}

function BottomTab({ active }: { active: "assets" | "market" | "orders" }) {
  return (
    <nav className={styles.bottomTab}>
      <Link className={`${styles.bottomItem} ${active === "assets" ? styles.bottomActive : ""}`} href={toDemoPath("/myPortfolio")}>
        <WalletCards size={20} />
        <span>资产</span>
      </Link>
      <Link className={`${styles.bottomItem} ${active === "market" ? styles.bottomActive : ""}`} href={toDemoPath("/trade")}>
        <Sparkles size={20} />
        <span>市场</span>
      </Link>
      <Link className={`${styles.bottomItem} ${active === "orders" ? styles.bottomActive : ""}`} href={toDemoPath("/orders")}>
        <ClipboardList size={20} />
        <span>订单</span>
      </Link>
    </nav>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className={styles.sectionTitle}>
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className={styles.infoLine}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.metricCard}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AmountField({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <label className={styles.amountField}>
      <span>{label}</span>
      <div>
        <input value={value} readOnly />
        <em>{unit}</em>
      </div>
    </label>
  );
}

function TextField({ label, placeholder, suffix }: { label: string; placeholder: string; suffix?: string }) {
  return (
    <label className={styles.textField}>
      <span>{label}</span>
      <div>
        <input placeholder={placeholder} readOnly />
        {suffix ? <button type="button">{suffix}</button> : null}
      </div>
    </label>
  );
}

function KycField({ label, placeholder, suffix, tall }: { label: string; placeholder: string; suffix?: string; tall?: boolean }) {
  return (
    <label className={`${styles.kycField} ${tall ? styles.kycFieldTall : ""}`}>
      <span>{label}</span>
      <div>
        <input placeholder={placeholder} readOnly />
        {suffix ? <button type="button">{suffix}</button> : null}
      </div>
    </label>
  );
}

function OnRampField({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <label className={styles.onRampField}>
      <span>{label}</span>
      <div>
        <input value={value} readOnly />
        <em>{unit}</em>
      </div>
    </label>
  );
}

function PositionCard({ title, rows, action, href }: { title: string; rows: [string, string][]; action: string; href: string }) {
  return (
    <article className={styles.positionCard}>
      <div className={styles.orderHead}>
        <strong>{title}</strong>
        <Link href={toDemoPath(href)}>{action}</Link>
      </div>
      {rows.map(([label, value]) => (
        <InfoLine label={label} value={value} key={label} />
      ))}
    </article>
  );
}

function SimpleTable({ columns, rows }: { columns: [string, string][]; rows: TableRow[] }) {
  const minWidth = columns.length * 104;

  return (
    <section className={styles.tableWrap}>
      <div className={styles.tableGrid} style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(104px, 1fr))`, minWidth }}>
        {columns.map(([, label], columnIndex) => (
          <div className={`${styles.tableHead} ${columnIndex === columns.length - 1 ? styles.tableHeadRight : ""}`} key={label}>{label}</div>
        ))}
        {rows.map((row, rowIndex) =>
          columns.map(([key], columnIndex) => (
            <div className={`${styles.tableCell} ${columnIndex === columns.length - 1 ? styles.tableCellRight : ""}`} key={`${rowIndex}-${key}`}>
              {row[key] ?? "-"}
            </div>
          )),
        )}
      </div>
    </section>
  );
}

function TablePagination({ current, total }: { current: string; total: string }) {
  return (
    <div className={styles.pagination}>
      <button type="button" aria-label="上一页">‹</button>
      <span>{current} / {total}</span>
      <button type="button" aria-label="下一页">›</button>
    </div>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.copyRow}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <button type="button" aria-label={`复制${label}`}>
        <Copy size={18} />
      </button>
    </div>
  );
}

function SheetMenuRow({ label, value, href, active, tall }: { label: string; value: string; href: string; active?: boolean; tall?: boolean }) {
  return (
    <Link className={`${styles.sheetMenuRow} ${tall ? styles.sheetMenuRowTall : ""}`} href={toDemoPath(href)}>
      <span>{label}</span>
      <strong className={active ? styles.sheetStatusActive : ""}>{value}</strong>
      <ChevronRight size={18} />
    </Link>
  );
}

function ChoiceCard({ title, desc, href, className }: { title: string; desc: string; href: string; className?: string }) {
  return (
    <Link className={`${styles.choiceCard} ${className ?? ""}`} href={toDemoPath(href)}>
      <ShieldCheck size={26} />
      <div>
        <strong>{title}</strong>
        <span>{desc}</span>
      </div>
    </Link>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <section className={styles.emptyState}>
      <Globe2 size={52} />
      <p>{title}</p>
    </section>
  );
}

function HoldersPanel() {
  const rows = [
    { address: "0x93A1...7E21", percentage: "36.20%", time: "2026-06-01" },
    { address: "0x12F8...B90C", percentage: "24.80%", time: "2026-05-29" },
    { address: "0x8C44...A110", percentage: "18.40%", time: "2026-05-26" },
  ];
  return <SimpleTable columns={[["address", "用户地址"], ["percentage", "百分比"], ["time", "时间"]]} rows={rows} />;
}
