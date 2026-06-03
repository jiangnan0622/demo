const productEntries = [
  {
    name: "RealFinance",
    description: "REALRWA 主站与业务页面",
    href: "https://jiangnan0622.github.io/demo/",
    path: "/",
  },
  {
    name: "Real mobile",
    description: "资产优先的移动端 RWA 产品 demo",
    href: "https://jiangnan0622.github.io/demo/real-mobile",
    path: "/real-mobile",
  },
  {
    name: "Real mobile v2",
    description: "保留方案 A 改造前的当前迭代版，便于对比和回退",
    href: "https://jiangnan0622.github.io/demo/real-mobile-v2",
    path: "/real-mobile-v2",
  },
  {
    name: "Real mobile v1",
    description: "保留改造前第一版移动端 demo，便于随时对比和回退",
    href: "https://jiangnan0622.github.io/demo/real-mobile-v1",
    path: "/real-mobile-v1",
  },
  {
    name: "Admin Console",
    description: "邀请后台管理与做市上架后台管理",
    href: "https://jiangnan0622.github.io/demo/backEnd/rebateConfig",
    path: "/backEnd/rebateConfig",
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
            这里保留线上入口：RealFinance 主站、Real mobile 移动端复刻，以及合并了邀请后台和做市上架的管理后台。
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {productEntries.map((entry) => (
            <article
              key={entry.name}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur"
            >
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8fb2ff]">GitHub Pages</p>
                <h2 className="text-2xl font-semibold">{entry.name}</h2>
                <p className="text-sm text-white/70">{entry.description}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <a
                  href={entry.href}
                  className="rounded-full bg-[#2d6bff] px-4 py-2 font-medium text-white transition hover:bg-[#2459d6]"
                >
                  打开当前页面
                </a>
                <code className="rounded-full border border-white/12 bg-black/20 px-4 py-2 text-white/75">
                  {entry.path}
                </code>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
