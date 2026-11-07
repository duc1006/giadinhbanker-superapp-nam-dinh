import React, { useState, useMemo } from 'react';
import {
  PiggyBank,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Coins,
  Calendar,
  CheckCircle2,
  Video
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const DepositCalculator: React.FC = () => {
  const { depositCalculator } = contentData;

  // States
  const [depositAmountStr, setDepositAmountStr] = useState<string>('100,000,000');
  const [selectedTermMonths, setSelectedTermMonths] = useState<number>(depositCalculator.defaultTermMonths);
  const [customRateStr, setCustomRateStr] = useState<string>('4.7');
  const [errors, setErrors] = useState<{ amount?: string; term?: string; rate?: string }>({});

  // Parse clean numbers
  const parseAmount = (val: string): number => {
    const clean = val.replace(/[^0-9]/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  const amount = useMemo(() => parseAmount(depositAmountStr), [depositAmountStr]);
  const rate = useMemo(() => parseFloat(customRateStr) || 0, [customRateStr]);

  // Handle amount change with VND formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Disallow non-numeric except commas/dots
    const digitsOnly = raw.replace(/[^0-9]/g, '');
    if (!digitsOnly) {
      setDepositAmountStr('');
      setErrors((prev) => ({ ...prev, amount: depositCalculator.messages.invalidAmount }));
      return;
    }
    const num = parseInt(digitsOnly, 10);
    setDepositAmountStr(num.toLocaleString('vi-VN'));

    if (num < depositCalculator.minAmount) {
      setErrors((prev) => ({
        ...prev,
        amount: `Số tiền gửi tối thiểu là ${depositCalculator.minAmount.toLocaleString('vi-VN')} VND`
      }));
    } else {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  // Handle term selection
  const handleTermSelect = (termMonths: number) => {
    setSelectedTermMonths(termMonths);
    const matchedTerm = depositCalculator.terms.find((t) => t.months === termMonths);
    if (matchedTerm) {
      setCustomRateStr(matchedTerm.rate.toFixed(1));
    }
    setErrors((prev) => ({ ...prev, term: undefined }));
  };

  // Handle rate change
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomRateStr(val);
    const num = parseFloat(val);
    if (isNaN(num) || num < 0 || num > 20) {
      setErrors((prev) => ({ ...prev, rate: depositCalculator.messages.invalidRate }));
    } else {
      setErrors((prev) => ({ ...prev, rate: undefined }));
    }
  };

  // Quick preset amount buttons
  const setQuickAmount = (val: number) => {
    setDepositAmountStr(val.toLocaleString('vi-VN'));
    setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  // Calculations: Lãi sau = Số tiền * Lãi suất (%) / 12 * Kỳ hạn (tháng)
  const interestEarned = useMemo(() => {
    if (amount <= 0 || rate <= 0 || selectedTermMonths <= 0) return 0;
    // (Amount * (rate / 100) * (selectedTermMonths * 30)) / 365 or simplified monthly
    return Math.round((amount * (rate / 100) * selectedTermMonths) / 12);
  }, [amount, rate, selectedTermMonths]);

  const totalPayout = useMemo(() => {
    return amount + interestEarned;
  }, [amount, interestEarned]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs font-semibold text-[#005A9E] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
          Công cụ tài chính VietinBank
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {depositCalculator.title}
        </h2>
        <p className="text-sm text-slate-500">
          {depositCalculator.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (PDF 2 layout) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-[#005A9E]" />
              <span>Tiền gửi dự tính</span>
            </h3>
            <span className="text-xs text-slate-400">Trả lãi cuối kỳ</span>
          </div>

          {/* Input 1: Số tiền gửi */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Số tiền gửi (VND) <span className="text-red-500">*</span></span>
              <span className="text-[11px] text-slate-400">Tối thiểu: 1.000.000 VND</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={depositAmountStr}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền gửi"
                className={`w-full px-4 py-3.5 pr-16 text-base font-bold text-slate-900 bg-slate-50/70 border rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#005A9E]/20 transition-all ${
                  errors.amount ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-[#005A9E]'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400">
                VND
              </span>
            </div>
            {errors.amount && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.amount}</span>
              </p>
            )}

            {/* Quick Amount presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[20000000, 50000000, 100000000, 500000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setQuickAmount(preset)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-[#005A9E] text-slate-600 transition-colors"
                >
                  +{preset >= 100000000 ? `${preset / 1000000000 >= 1 ? `${preset / 1000000000} Tỷ` : `${preset / 1000000} Tr`}` : `${preset / 1000000} Tr`}
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: Kỳ hạn gửi */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Kỳ hạn gửi (Tháng) <span className="text-red-500">*</span></span>
              <span className="text-[11px] text-[#005A9E] font-medium">Chọn kỳ hạn phù hợp</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {depositCalculator.terms.map((t) => (
                <button
                  key={t.months}
                  type="button"
                  onClick={() => handleTermSelect(t.months)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 border ${
                    selectedTermMonths === t.months
                      ? 'bg-[#005A9E] text-white border-[#005A9E] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{t.label}</span>
                  <span className={`text-[10px] ${selectedTermMonths === t.months ? 'text-sky-200' : 'text-slate-400'}`}>
                    {t.rate}%/năm
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Input 3: Lãi suất */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Lãi suất áp dụng (%/năm) <span className="text-red-500">*</span></span>
              <span className="text-[11px] text-slate-400">Tự động lấy theo biểu lãi suất</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={customRateStr}
                onChange={handleRateChange}
                className={`w-full px-4 py-3.5 pr-20 text-base font-bold text-slate-900 bg-slate-50/70 border rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#005A9E]/20 transition-all ${
                  errors.rate ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-[#005A9E]'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                %/năm
              </span>
            </div>
            {errors.rate && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.rate}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Result Card (PDF 2 layout) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-gradient-to-br from-[#003B70] via-[#005A9E] to-[#0072BC] rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
                Kết quả dự tính
              </span>
              <Coins className="w-5 h-5 text-amber-300" />
            </div>

            {/* Tiền lãi dự tính */}
            <div className="space-y-1 bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/10">
              <span className="text-xs text-sky-200 font-medium">Tiền lãi dự tính</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono tracking-tight">
                {interestEarned.toLocaleString('vi-VN')} <span className="text-sm text-white font-sans">VND</span>
              </div>
            </div>

            {/* Tổng tiền khi đáo hạn */}
            <div className="space-y-1 bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/10">
              <span className="text-xs text-sky-200 font-medium">Tổng tiền nhận được (Gốc + Lãi)</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                {totalPayout.toLocaleString('vi-VN')} <span className="text-sm text-sky-200 font-sans">VND</span>
              </div>
            </div>

            {/* Summary bullet breakdown */}
            <div className="text-xs text-sky-100 space-y-2 pt-2 border-t border-white/10">
              <div className="flex justify-between">
                <span>Số tiền gửi gốc:</span>
                <strong className="text-white font-mono">{amount.toLocaleString('vi-VN')} VND</strong>
              </div>
              <div className="flex justify-between">
                <span>Kỳ hạn gửi:</span>
                <strong className="text-white">{selectedTermMonths} Tháng</strong>
              </div>
              <div className="flex justify-between">
                <span>Lãi suất cam kết:</span>
                <strong className="text-white font-mono">{rate}% / năm</strong>
              </div>
            </div>
          </div>

          {/* Video Guide Link on TikTok (PDF 2 requirement) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Video hướng dẫn gửi tiết kiệm
                </h4>
                <p className="text-[11px] text-slate-500">
                  Mẹo gửi tiết kiệm thông minh tối ưu tiền lời
                </p>
              </div>
            </div>

            <a
              href={depositCalculator.videoGuideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
            >
              <span>Xem TikTok</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* VietinBank Interest Rate Reference Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Biểu lãi suất tiền gửi tiết kiệm tham khảo VietinBank
            </h3>
            <p className="text-xs text-slate-500">
              Áp dụng cho khách hàng cá nhân gửi tại quầy (trả lãi sau)
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Cập nhật mới nhất
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600">
                <th className="py-3 px-4 font-bold">Kỳ hạn</th>
                <th className="py-3 px-4 font-bold">Lãi suất (%/năm)</th>
                <th className="py-3 px-4 font-bold">Phương thức trả lãi</th>
                <th className="py-3 px-4 font-bold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {depositCalculator.terms.map((t) => (
                <tr key={t.months} className="hover:bg-sky-50/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {t.label}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#005A9E]">
                    {t.rate.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    Cuối kỳ
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleTermSelect(t.months)}
                      className="px-3 py-1 text-xs font-semibold text-[#005A9E] hover:underline"
                    >
                      Áp dụng kỳ hạn này
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
