import React from 'react';
import {
  Smartphone,
  Download,
  QrCode,
  ShieldCheck,
  Zap,
  CreditCard,
  Gift,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const DownloadIPay: React.FC = () => {
  const { downloadApp, bankInfo } = contentData;

  const steps = [
    {
      title: 'Bước 1: Quét mã QR',
      desc: 'Dùng camera điện thoại hoặc Zalo quét mã QR bên cạnh để mở trang tải ứng dụng tương thích với máy của Quý khách.'
    },
    {
      title: 'Bước 2: Cài đặt VietinBank iPay',
      desc: 'Bấm “Cài đặt” hoặc “Nhận” trên App Store (iPhone) hoặc Google Play (Android).'
    },
    {
      title: 'Bước 3: Đăng ký eKYC hoặc Đăng nhập',
      desc: 'Nếu đã có tài khoản, đăng nhập theo tên đăng nhập được cấp. Nếu chưa có tài khoản, chọn “Mở tài khoản mới” chỉ mất 2 phút.'
    },
    {
      title: 'Bước 4: Kích hoạt Soft OTP',
      desc: 'Thiết lập mã PIN Soft OTP và cập nhật sinh trắc học để bảo mật tối đa cho mọi giao dịch.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#003B70] via-[#005A9E] to-[#0072BC] rounded-3xl p-8 sm:p-12 text-white shadow-lg">
        {/* Decorative background circles */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-10 bottom-0 w-64 h-64 rounded-full bg-sky-400/10 blur-xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-sky-200 border border-white/10">
              <SparklesIcon className="w-3.5 h-3.5 text-amber-300" />
              <span>Ứng dụng Ngân hàng số Vạn năng</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {downloadApp.title}
            </h2>

            <p className="text-sky-100 text-sm sm:text-base leading-relaxed max-w-xl">
              {downloadApp.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={downloadApp.iosUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-white text-slate-900 hover:bg-sky-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <AppleIcon className="w-4 h-4" />
                <span>Tải trên App Store (iOS)</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href={downloadApp.androidUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-sky-950/80 hover:bg-sky-950 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
              >
                <PlayStoreIcon className="w-4 h-4 text-emerald-400" />
                <span>Tải trên Google Play</span>
                <ExternalLink className="w-3 h-3 text-sky-300" />
              </a>
            </div>
          </div>

          {/* QR Code box */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="bg-white p-5 rounded-2xl shadow-xl text-slate-900 text-center max-w-xs w-full">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#005A9E] mb-3">
                <QrCode className="w-4 h-4" />
                <span>QUÉT MÃ TẢI APP NGAY</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-center">
                <img
                  src={downloadApp.qrUrl}
                  alt="QR Code Tải VietinBank iPay"
                  className="w-48 h-48 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <p className="text-[11px] text-slate-500 mt-3 font-medium">
                Hỗ trợ cả iOS và Android. Tự động nhận diện thiết bị của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {downloadApp.features.map((feat, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-[#005A9E] transition-all space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#005A9E] flex items-center justify-center font-bold">
              {idx === 0 ? <Zap className="w-5 h-5" /> : null}
              {idx === 1 ? <ShieldCheck className="w-5 h-5" /> : null}
              {idx === 2 ? <CreditCard className="w-5 h-5" /> : null}
              {idx === 3 ? <Gift className="w-5 h-5" /> : null}
            </div>
            <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* Counter Assistance Steps */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Quy trình cài đặt & kích hoạt nhanh tại quầy
            </h3>
            <p className="text-xs text-slate-500">
              Cán bộ VietinBank sẵn sàng hỗ trợ trực tiếp từng thao tác cho Quý khách
            </p>
          </div>
          <span className="text-xs font-semibold text-[#005A9E] bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100">
            Hỗ trợ viên: {bankInfo.advisor.name}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((st, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start gap-3.5"
            >
              <div className="w-7 h-7 rounded-lg bg-[#005A9E] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">{st.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
    </svg>
  );
}

function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.58-.72.98-1.72.87-2.72-.85.03-1.87.57-2.47 1.29-.53.62-.99 1.63-.87 2.6.94.07 1.9-.47 2.47-1.17z" />
    </svg>
  );
}

function PlayStoreIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M3.609 1.814L13.792 12 3.61 22.186a2.02 2.02 0 0 1-.61-.925V2.739c.142-.35.358-.67.61-.925zm11.597 11.598l2.458 2.458-12.756 7.37 10.298-9.828zm2.458-2.458l-2.458-2.458 10.298-9.828-12.756 7.37 2.458 2.458 2.458 2.458zm1.447-1.447l3.666 2.118a1.503 1.503 0 0 1 0 2.604l-3.666 2.118-2.083-2.083 2.083-2.083z" />
    </svg>
  );
}
