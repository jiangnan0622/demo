import { publicAsset } from "@/lib/public-asset";

export default function SettleFlowPayManagementPage() {
  return (
    <main className="h-[100svh] w-full overflow-hidden bg-[#f4f6f8]">
      <iframe
        title="SettleFlow Pay 管理后台"
        src={publicAsset("/SettleFlow-Pay/management/index.html")}
        className="h-full w-full border-0"
      />
    </main>
  );
}
