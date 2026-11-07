import React from 'react';
import { Phone, Clock, Shield, MapPin, ArrowUp } from 'lucide-react';
import contentData from '../data/contentData.json';
import { SafeImage } from './SafeImage';

export const Footer: React.FC = () => {
  const { bankInfo } = contentData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Bank Identity */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <SafeImage
                src={bankInfo.logo}
                fallbackSrc={bankInfo.remoteLogo}
                alt="VietinBank"
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md">
              {bankInfo.name} ({bankInfo.shortName}) là định chế tài chính trụ cột hàng đầu Việt Nam, cung cấp các giải pháp tài chính toàn diện cho khách hàng cá nhân, hộ kinh doanh và doanh nghiệp.
            </p>
            <div className="text-xs text-slate-500 space-y-1">
              <div>Trụ sở chính: 108 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội</div>
              <div>Hotline 24/7: <strong>{bankInfo.hotline}</strong> | <strong>{bankInfo.secondaryHotline}</strong></div>
            </div>
          </div>

          {/* Col 2: Operating Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#005A9E]" />
              <span>Giờ giao dịch tại quầy</span>
            </h4>
            <div className="text-xs text-slate-600 space-y-1 leading-relaxed">
              <div className="font-semibold text-slate-800">Thứ 2 đến Thứ 6:</div>
              <div>Sáng: 07h30 - 11h30</div>
              <div>Chiều: 13h30 - 16h30</div>
              <div className="font-semibold text-red-600 pt-1">Thứ 7 & Chủ Nhật:</div>
              <div>Nghỉ giao dịch tại quầy</div>
            </div>
          </div>

          {/* Col 3: Advisor Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#005A9E]" />
              <span>Chuyên viên phụ trách quầy</span>
            </h4>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="text-xs font-bold text-slate-900">{bankInfo.advisor.name}</div>
              <div className="text-[11px] text-slate-500">{bankInfo.advisor.title}</div>
              <a
                href={`tel:${bankInfo.advisor.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#005A9E] text-white text-xs font-bold rounded-lg hover:bg-[#004a82] transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>{bankInfo.advisor.phone}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Ngân hàng TMCP Công Thương Việt Nam (VietinBank). Bản quyền thuộc về VietinBank.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-[#005A9E] hover:underline font-semibold"
          >
            <span>Về đầu trang</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
