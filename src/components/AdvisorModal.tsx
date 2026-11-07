import React from 'react';
import { X, Phone, UserCheck, ShieldCheck, Clock, MapPin, MessageCircle } from 'lucide-react';
import contentData from '../data/contentData.json';

interface AdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvisorModal: React.FC<AdvisorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { bankInfo } = contentData;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#005A9E]">
            <UserCheck className="w-4 h-4" />
            <span>HỖ TRỢ TRỰC TIẾP TẠI QUẦY</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#003B70] to-[#0072BC] text-white flex items-center justify-center text-2xl font-black mx-auto shadow-md border-4 border-white">
            TH
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900">
              {bankInfo.advisor.name}
            </h3>
            <p className="text-xs text-[#005A9E] font-bold mt-0.5">
              {bankInfo.advisor.title} · VietinBank
            </p>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Sẵn sàng tư vấn hồ sơ vay vốn, hướng dẫn thủ tục mở tài khoản, cài đặt sinh trắc học và giải đáp mọi vướng mắc của Quý khách tại quầy giao dịch.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-2.5 text-xs text-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Số điện thoại di động:</span>
            <strong className="text-sm font-bold text-[#005A9E] font-mono">
              {bankInfo.advisor.phone}
            </strong>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
            <span className="text-slate-500">Thời gian hỗ trợ:</span>
            <span className="font-semibold text-slate-800">07:30 - 17:00 (T2 - T6)</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
            <span className="text-slate-500">Khu vực công tác:</span>
            <span className="font-semibold text-slate-800">Quầy giao dịch chi nhánh</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <a
            href={`tel:${bankInfo.advisor.phone}`}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl text-center shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Gọi trực tiếp ({bankInfo.advisor.phone})</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
