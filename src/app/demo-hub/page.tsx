import Link from "next/link";

const productEntries = [
  {
    name: "RealFinance",
    description: "REALRWA 主站与业务页面",
    route: "/",
    port: "3000",
  },
  {
    name: "Flagship",
    description: "审美与交互展示型页面",
    route: "/capabilities",
    port: "3001",
  },
  {
    name: "Rebate Admin",
    description: "邀请后台管理",
    route: "/rebate/config",
    port: "3002",
  },
  {
    name: "Market Making Admin",
    description: "做市上架后台管理",
    route: "/backEnd/marketMaking/repurchase",
    port: "3003",
  },
];

export default function DemoHubPage() {
  return (
    <main className="min-h-screen bg-[#0b1020] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-white/55">Product Hub</p>
          <h1 className="text-4xl font-semibold tracking-tight">Product Experience Index</h1>
          <p className="max-w-2xl text-base text-white/70">
            这里聚合了当前 product 仓库已经整理好的 4 个产品页面，方便本地按端口查看和后续上架到
            VANTA。
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {productEntries.map((entry) => (
            <article
              key={entry.name}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur"
            >
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8fb2ff]">
                  localhost:{entry.port}
                </p>
                <h2 className="text-2xl font-semibold">{entry.name}</h2>
                <p className="text-sm text-white/70">{entry.description}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <Link
                  href={entry.route}
                  className="rounded-full bg-[#2d6bff] px-4 py-2 font-medium text-white transition hover:bg-[#2459d6]"
                >
                  打开当前页面
                </Link>
                <code className="rounded-full border border-white/12 bg-black/20 px-4 py-2 text-white/75">
                  {entry.route}
                </code>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
