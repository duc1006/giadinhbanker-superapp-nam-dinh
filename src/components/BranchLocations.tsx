import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Search,
  Building2,
  Navigation,
  CalendarCheck
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { SafeImage } from './SafeImage';

export const BranchLocations: React.FC = () => {
  const { branchNetwork, bankInfo } = contentData;
  const [selectedBranchId, setSelectedBranchId] = useState<string>('nam-dinh');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentLocations = branchNetwork.locations[selectedBranchId as keyof typeof branchNetwork.locations] || branchNetwork.locations['nam-dinh'];

  const filteredLocations = currentLocations.filter((loc) => {
    const q = searchQuery.toLowerCase();
    return loc.name.toLowerCase().includes(q) || loc.address.toLowerCase().includes(q) || loc.phone.includes(q);
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs font-semibold text-[#005A9E] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
          Mạng lưới VietinBank
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {branchNetwork.title}
        </h2>
        <p className="text-sm text-slate-500">
          {branchNetwork.subtitle}
        </p>
      </div>

      {/* Operating Hours Banner (PDF 4 Page 3 requirement) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#005A9E] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Thời gian làm việc</span>
            <div className="text-sm font-bold text-slate-900">Khung giờ giao dịch tại quầy</div>
          </div>
        </div>

        <div className="text-xs space-y-1 md:border-l md:border-slate-100 md:pl-4">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <CalendarCheck className="w-3.5 h-3.5 text-[#005A9E]" />
            <span>Thứ 2 đến Thứ 6:</span>
          </div>
          <p className="text-slate-600">Sáng: 07h30 - 11h30 | Chiều: 13h30 - 16h30</p>
        </div>

        <div className="text-xs space-y-1 md:border-l md:border-slate-100 md:pl-4">
          <div className="font-bold text-red-600">Thứ 7 & Chủ Nhật:</div>
          <p className="text-slate-500">Nghỉ giao dịch (Hỗ trợ 24/7 qua VietinBank iPay & Hotline 1900 558 868)</p>
        </div>
      </div>

      {/* Branch Selector and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Chọn chi nhánh trong hệ thống 155 chi nhánh VietinBank:
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {branchNetwork.branchList.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBranchId(b.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    selectedBranchId === b.id
                      ? 'bg-[#005A9E] text-white border-[#005A9E] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên PGD, đường phố..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#005A9E] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Selected Branch Details Note */}
        <div className="text-xs text-slate-500 flex items-center gap-2 pt-1 border-t border-slate-100">
          <span>Đang hiển thị danh sách <strong>{filteredLocations.length}</strong> điểm giao dịch tại khu vực:</span>
          <strong className="text-[#005A9E] uppercase">
            {branchNetwork.branchList.find((b) => b.id === selectedBranchId)?.name || 'Nam Định'}
          </strong>
        </div>
      </div>

      {/* Branch Cards Grid (PDF 4 Page 1 & 2 requirements) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((item) => (
          <div
            key={item.stt}
            className="group bg-white border border-slate-200 hover:border-[#005A9E] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Photo */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <SafeImage
                src={item.image}
                fallbackSrc={item.remoteImage}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-[#005A9E] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs">
                Điểm #{item.stt}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005A9E] transition-colors leading-snug">
                  {item.name}
                </h3>

                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item.address}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Phone className="w-4 h-4 text-[#005A9E] shrink-0" />
                  <a
                    href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                    className="font-bold text-[#005A9E] hover:underline"
                    title="Bấm gọi ngay"
                  >
                    Hotline: {item.phone} (Gọi trực tiếp)
                  </a>
                </div>
              </div>

              {/* Action buttons: Direct Call & Google Maps navigation */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                  className="flex-1 py-2.5 bg-sky-50 hover:bg-sky-100 text-[#005A9E] font-bold text-xs rounded-xl border border-sky-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi hotline</span>
                </a>

                <a
                  href={item.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-[#005A9E] hover:bg-[#004a82] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
