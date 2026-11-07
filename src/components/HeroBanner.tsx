import React from 'react';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
  ChevronRight,
  UserCheck,
  PhoneCall,
  Clock,
  ShieldCheck
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface HeroBannerProps {
  onSelectTab: (tabId: string) => void;
  onOpenAdvisorModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectTab, onOpenAdvisorModal }) => {
  const { bankInfo, menuTabs } = contentData;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-5 h-5" />;
      case 'PiggyBank':
        return <PiggyBank className="w-5 h-5" />;
      case 'Calculator':
        return <Calculator className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5" />;
      default:
        return <HelpCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#002D62] via-[#005A9E] to-[#0072BC] rounded-3xl p-6 sm:p-10 text-white shadow-md">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-sky-200 border border-white/15">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Cổng Dịch Vụ Khách Hàng Tại Quầy VietinBank</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Kính chào Quý khách đến với <span className="text-amber-300">VietinBank</span>
            </h1>

            <p className="text-sky-100 text-xs sm:text-sm leading-relaxed max-w-xl">
              Vui lòng chạm chọn các tiện ích dưới đây để được hướng dẫn nhanh, tính toán lãi suất, trải nghiệm minigame nhận quà hoặc kết nối chuyên viên tư vấn.
            </p>
          </div>

          {/* Counter Advisor Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl max-w-sm w-full space-y-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-extrabold text-base shrink-0 shadow-xs">
                TH
              </div>
              <div>
                <span className="text-[10px] font-bold text-sky-200 uppercase tracking-wider">
                  Chuyên viên tư vấn quầy
                </span>
                <div className="text-base font-bold text-white">
                  {bankInfo.advisor.name}
                </div>
                <div className="text-xs text-amber-300 font-bold">
                  Hotline: {bankInfo.advisor.phone}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/15 flex gap-2">
              <a
                href={`tel:${bankInfo.advisor.phone}`}
                className="flex-1 py-2 bg-white hover:bg-sky-50 text-[#005A9E] font-bold text-xs rounded-xl text-center shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Gọi hỗ trợ</span>
              </a>
              <button
                onClick={onOpenAdvisorModal}
                className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl transition-colors"
              >
                Thông tin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7 Interactive Feature Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {menuTabs.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className="group bg-white border border-slate-200 hover:border-[#005A9E] rounded-2xl p-4 sm:p-5 text-left shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#005A9E] group-hover:bg-[#005A9E] group-hover:text-white transition-colors flex items-center justify-center font-bold">
                {getIcon(tab.icon)}
              </div>
              <span className="text-[11px] font-bold text-slate-400 group-hover:text-[#005A9E]">
                0{idx + 1}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#005A9E] transition-colors leading-snug">
                {tab.label}
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {tab.description}
              </p>
            </div>

            <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-[#005A9E]">
              <span>Khám phá ngay</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
