export function generateStaticParams() {
  return [{ slug: ["dashboard"] }];
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          👥 Khu vực Cộng đồng
        </h1>
        <p className="text-slate-500">Đang phát triển...</p>
      </div>
    </div>
  );
}
