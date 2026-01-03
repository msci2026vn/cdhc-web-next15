import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.3) 0%, transparent 40%),
                             radial-gradient(circle at 80% 70%, rgba(245, 158, 11, 0.2) 0%, transparent 40%)`,
          }}
        />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8">
              <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs">
                ⭐
              </span>
              <span className="text-sm font-medium">
                Super App Nông Nghiệp Hữu Cơ #1 Việt Nam
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Nông Nghiệp
              <br />
              <span className="text-gradient bg-gradient-to-r from-green-300 to-amber-300 bg-clip-text text-transparent">
                Thông Minh
              </span>
              <br />
              Cuộc Sống Xanh
            </h1>

            {/* Description */}
            <p className="text-lg text-white/80 mb-8 max-w-lg">
              Ứng dụng toàn diện với AI chẩn đoán bệnh cây 90%+ độ chính xác,
              sàn thương mại hữu cơ, truy xuất nguồn gốc blockchain và cộng đồng
              15,000+ nông dân.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#download"
                className="inline-flex items-center gap-2 px-8 py-4 gradient-accent text-white font-semibold rounded-full hover:shadow-xl transition-all"
              >
                <span>📥</span>
                Tải App Miễn Phí
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white hover:text-green-700 transition-all"
              >
                Khám Phá Tính Năng
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              {[
                { number: "15K+", label: "Nông dân" },
                { number: "500+", label: "Nông trại" },
                { number: "63", label: "Tỉnh thành" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {stat.number}
                  </div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            {/* Phone Mockup */}
            <div className="relative mx-auto w-72">
              <div className="relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="relative rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                  <Image
                    src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=800&fit=crop"
                    alt="CDHC App"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute top-20 -left-8 animate-float">
              <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  🌿
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Chứng nhận hữu cơ
                  </h4>
                  <p className="text-xs text-slate-500">Đạt chuẩn USDA, EU</p>
                </div>
              </div>
            </div>

            <div
              className="absolute top-1/2 -right-4 animate-float"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                  🧠
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    AI Chẩn đoán
                  </h4>
                  <p className="text-xs text-slate-500">90%+ độ chính xác</p>
                </div>
              </div>
            </div>

            <div
              className="absolute bottom-20 left-0 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  📱
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Truy xuất nguồn gốc
                  </h4>
                  <p className="text-xs text-slate-500">Tích hợp TraceViet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
