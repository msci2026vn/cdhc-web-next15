export function FeaturesBar() {
  const features = [
    {
      icon: "📸",
      title: "AI Chẩn Đoán Bệnh",
      description: "Chụp ảnh lá cây, nhận kết quả trong 3 giây",
    },
    {
      icon: "🏪",
      title: "Chợ Nông Sản",
      description: "Mua bán trực tiếp, không qua trung gian",
    },
    {
      icon: "🤖",
      title: "Trợ Lý AI 24/7",
      description: "Hỏi đáp nông nghiệp bằng giọng nói",
    },
    {
      icon: "📍",
      title: "Truy Xuất Nguồn Gốc",
      description: "QR code blockchain minh bạch",
    },
  ];

  return (
    <section id="features" className="relative -mt-16 z-10 pb-20">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-2xl hover:bg-green-50 transition-colors group"
              >
                <div className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
