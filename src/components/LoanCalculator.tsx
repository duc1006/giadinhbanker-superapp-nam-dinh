import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Calendar,
  Layers,
  ChevronRight,
  TrendingDown,
  Info,
  X,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface ScheduleRow {
  period: number;
  paymentDateStr: string;
  beginningBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  endingBalance: number;
}

export const LoanCalculator: React.FC = () => {
  const { loanCalculator } = contentData;

  // Form states (No sliders as requested by PDF 3!)
  const [assetValueStr, setAssetValueStr] = useState<string>('1,000,000,000');
  const [loanAmountStr, setLoanAmountStr] = useState<string>('500,000,000');
  const [termMonths, setTermMonths] = useState<number>(loanCalculator.defaultTermMonths);
  const [interestRateYear, setInterestRateYear] = useState<number>(loanCalculator.defaultRate);
  const [disbursementDate, setDisbursementDate] = useState<string>('2026-01-10');
  const [repaymentCycleId, setRepaymentCycleId] = useState<string>('monthly');
  const [paymentDayOfMonth, setPaymentDayOfMonth] = useState<number>(25);
  const [roundingMode, setRoundingMode] = useState<'exact' | 'thousand'>('exact');

  // Detail Modal
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Clean numeric parsers
  const parseAmount = (val: string): number => {
    const clean = val.replace(/[^0-9]/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  const assetValue = useMemo(() => parseAmount(assetValueStr), [assetValueStr]);
  const loanAmount = useMemo(() => parseAmount(loanAmountStr), [loanAmountStr]);

  const selectedCycle = useMemo(() => {
    return loanCalculator.repaymentCycles.find((c) => c.id === repaymentCycleId) || loanCalculator.repaymentCycles[0];
  }, [repaymentCycleId, loanCalculator.repaymentCycles]);

  // Total periods
  const totalPeriods = useMemo(() => {
    const periods = Math.ceil(termMonths / selectedCycle.periodMonths);
    return Math.max(1, periods);
  }, [termMonths, selectedCycle.periodMonths]);

  // Periodic interest rate
  const periodicRate = useMemo(() => {
    // Lãi suất năm / divisor
    return (interestRateYear / 100) / selectedCycle.divisor;
  }, [interestRateYear, selectedCycle.divisor]);

  // Rounding function
  const applyRounding = (val: number): number => {
    if (roundingMode === 'thousand') {
      return Math.round(val / 1000) * 1000;
    }
    return Math.round(val);
  };

  // Generate full repayment schedule (PDF 3 business logic)
  const scheduleData = useMemo(() => {
    if (loanAmount <= 0 || totalPeriods <= 0) {
      return { rows: [], totalPrincipal: 0, totalInterest: 0, totalPayment: 0 };
    }

    const rows: ScheduleRow[] = [];
    const basePrincipalPerPeriod = loanAmount / totalPeriods;

    let currentBalance = loanAmount;
    let accumulatedPrincipalPaid = 0;
    let totalInterestAccum = 0;

    // Disbursement Date parse
    const [startYear, startMonth, startDay] = disbursementDate.split('-').map(Number);
    const startDate = new Date(startYear, startMonth - 1, startDay);

    // Period 0 (Disbursement row)
    rows.push({
      period: 0,
      paymentDateStr: startDate.toLocaleDateString('vi-VN'),
      beginningBalance: currentBalance,
      principal: 0,
      interest: 0,
      totalPayment: 0,
      endingBalance: currentBalance
    });

    for (let p = 1; p <= totalPeriods; p++) {
      // Calculate payment date: user preferred day of month, advanced by period
      const targetDate = new Date(startDate);
      targetDate.setMonth(targetDate.getMonth() + p * selectedCycle.periodMonths);
      targetDate.setDate(paymentDayOfMonth);

      // Interest for current period = Beginning Balance * periodicRate
      let periodInterest = applyRounding(currentBalance * periodicRate);

      // Principal for current period
      let periodPrincipal: number;
      if (p === totalPeriods) {
        // Last period adjusts for all rounding discrepancies!
        periodPrincipal = loanAmount - accumulatedPrincipalPaid;
      } else {
        periodPrincipal = applyRounding(basePrincipalPerPeriod);
      }

      accumulatedPrincipalPaid += periodPrincipal;
      const periodTotal = periodPrincipal + periodInterest;
      const endingBalance = Math.max(0, currentBalance - periodPrincipal);

      rows.push({
        period: p,
        paymentDateStr: targetDate.toLocaleDateString('vi-VN'),
        beginningBalance: currentBalance,
        principal: periodPrincipal,
        interest: periodInterest,
        totalPayment: periodTotal,
        endingBalance
      });

      totalInterestAccum += periodInterest;
      currentBalance = endingBalance;
    }

    return {
      rows,
      totalPrincipal: loanAmount,
      totalInterest: totalInterestAccum,
      totalPayment: loanAmount + totalInterestAccum
    };
  }, [loanAmount, totalPeriods, periodicRate, selectedCycle.periodMonths, disbursementDate, paymentDayOfMonth, roundingMode]);

  const firstMonthPayment = scheduleData.rows[1]?.totalPayment || 0;
  const lastMonthPayment = scheduleData.rows[scheduleData.rows.length - 1]?.totalPayment || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs font-semibold text-[#005A9E] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
          Công cụ tính khoản vay VietinBank
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {loanCalculator.title}
        </h2>
        <p className="text-sm text-slate-500">
          {loanCalculator.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (Pure text/number inputs, NO sliders as instructed) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#005A9E]" />
              <span>Thông tin khoản vay</span>
            </h3>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-md">
              Dư nợ giảm dần
            </span>
          </div>

          {/* Giá trị bất động sản / Tài sản đảm bảo */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Giá trị bất động sản / Tài sản (VND)
            </label>
            <div className="relative">
              <input
                type="text"
                value={assetValueStr}
                onChange={(e) => {
                  const num = e.target.value.replace(/[^0-9]/g, '');
                  setAssetValueStr(num ? parseInt(num, 10).toLocaleString('vi-VN') : '');
                }}
                className="w-full px-4 py-3 pr-16 text-sm font-bold text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:border-[#005A9E] focus:outline-hidden"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>
          </div>

          {/* Số tiền vay (dạng nhập số, không kéo thả) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Số tiền vay (VND) <span className="text-red-500">*</span></span>
              {assetValue > 0 && (
                <span className="text-[11px] text-[#005A9E] font-medium">
                  Tỷ lệ vay: {Math.round((loanAmount / assetValue) * 100)}%
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                value={loanAmountStr}
                onChange={(e) => {
                  const num = e.target.value.replace(/[^0-9]/g, '');
                  setLoanAmountStr(num ? parseInt(num, 10).toLocaleString('vi-VN') : '');
                }}
                className="w-full px-4 py-3.5 pr-16 text-base font-bold text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:border-[#005A9E] focus:outline-hidden"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[#005A9E]">
                VND
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Thời gian vay (tháng) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Thời gian vay (Tháng) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="360"
                value={termMonths}
                onChange={(e) => setTermMonths(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:border-[#005A9E] focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400">
                Tương đương: {(termMonths / 12).toFixed(1)} năm
              </span>
            </div>

            {/* Lãi suất (%/năm) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Lãi suất (%/năm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="30"
                value={interestRateYear}
                onChange={(e) => setInterestRateYear(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:border-[#005A9E] focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400">
                Lãi suất kỳ: {(periodicRate * 100).toFixed(2)}% / kỳ
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ngày giải ngân */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Ngày giải ngân</span>
              </label>
              <input
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-semibold text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:border-[#005A9E] focus:outline-hidden"
              />
            </div>

            {/* Chu kỳ trả nợ */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Chu kỳ trả nợ
              </label>
              <select
                value={repaymentCycleId}
                onChange={(e) => setRepaymentCycleId(e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-semibold text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:border-[#005A9E] focus:outline-hidden"
              >
                {loanCalculator.repaymentCycles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} (Lãi năm/{c.divisor})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tùy chọn ngày trả nợ & làm tròn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Ngày trả nợ định kỳ (ngày hàng tháng)
              </label>
              <select
                value={paymentDayOfMonth}
                onChange={(e) => setPaymentDayOfMonth(parseInt(e.target.value, 10))}
                className="w-full px-4 py-2.5 text-sm font-semibold text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:border-[#005A9E] focus:outline-hidden"
              >
                {[5, 10, 15, 20, 25, 28].map((day) => (
                  <option key={day} value={day}>
                    Ngày {day} hằng tháng
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Quy tắc làm tròn
              </label>
              <select
                value={roundingMode}
                onChange={(e) => setRoundingMode(e.target.value as 'exact' | 'thousand')}
                className="w-full px-4 py-2.5 text-sm font-semibold text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:border-[#005A9E] focus:outline-hidden"
              >
                <option value="exact">Làm tròn đến đơn vị đồng (VND)</option>
                <option value="thousand">Làm tròn đến 1.000 đồng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Loan Summary & "Xem chi tiết" Button */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-gradient-to-br from-[#003B70] via-[#005A9E] to-[#0072BC] rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
                Tóm tắt nghĩa vụ trả nợ
              </span>
              <TrendingDown className="w-5 h-5 text-amber-300" />
            </div>

            {/* Số tiền trả kỳ đầu & kỳ cuối */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[11px] text-sky-200 font-medium">Kỳ đầu (cao nhất)</span>
                <div className="text-lg sm:text-xl font-extrabold text-amber-300 font-mono">
                  {firstMonthPayment.toLocaleString('vi-VN')}
                </div>
                <span className="text-[10px] text-sky-200">VND/kỳ</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[11px] text-sky-200 font-medium">Kỳ cuối (thấp nhất)</span>
                <div className="text-lg sm:text-xl font-extrabold text-emerald-300 font-mono">
                  {lastMonthPayment.toLocaleString('vi-VN')}
                </div>
                <span className="text-[10px] text-sky-200">VND/kỳ</span>
              </div>
            </div>

            {/* Tổng lãi & Tổng phải trả */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs text-sky-100 pb-2 border-b border-white/10">
                <span>Tổng tiền lãi phải trả:</span>
                <strong className="text-amber-300 font-mono text-sm">
                  {scheduleData.totalInterest.toLocaleString('vi-VN')} VND
                </strong>
              </div>

              <div className="flex items-center justify-between text-xs text-sky-100 pb-2 border-b border-white/10">
                <span>Tổng tiền gốc phải trả:</span>
                <strong className="text-white font-mono text-sm">
                  {scheduleData.totalPrincipal.toLocaleString('vi-VN')} VND
                </strong>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-white font-bold">Tổng gốc + lãi:</span>
                <strong className="text-xl font-extrabold text-white font-mono">
                  {scheduleData.totalPayment.toLocaleString('vi-VN')} VND
                </strong>
              </div>
            </div>

            {/* Nút "Xem chi tiết" (Step 2 requirement from PDF 3) */}
            <button
              onClick={() => setShowDetailModal(true)}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>XEM CHI TIẾT LỊCH TRẢ NỢ GIẢM DẦN</span>
            </button>
          </div>

          {/* Business rule explainer note */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Info className="w-4 h-4 text-[#005A9E]" />
              <span>Nguyên tắc tính lãi dư nợ giảm dần:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-500 pl-1 leading-relaxed">
              <li>Gốc trả mỗi kỳ = Số tiền vay / Tổng số kỳ trả nợ</li>
              <li>Lãi kỳ hiện tại = Dư nợ đầu kỳ × Lãi suất kỳ</li>
              <li>Tổng tiền trả = Gốc kỳ + Lãi kỳ (giảm dần qua các kỳ)</li>
              <li>Sai lệch do làm tròn được tự động điều chỉnh vào kỳ trả nợ cuối cùng</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Step 2: Amortization Table Modal (PDF 3 requirement) */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold">
                  Bảng tính lịch trả nợ với dư nợ giảm dần
                </h3>
                <p className="text-xs text-slate-300">
                  Số tiền vay: {loanAmount.toLocaleString('vi-VN')} VND · {termMonths} tháng · Lãi suất {interestRateYear}%/năm
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Table matching PDF 3 screenshot */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#003B70] text-white uppercase text-[11px] font-bold">
                    <tr>
                      <th className="py-3 px-3 text-center">Stt</th>
                      <th className="py-3 px-3">Kỳ trả nợ</th>
                      <th className="py-3 px-3 text-right">Số gốc còn lại</th>
                      <th className="py-3 px-3 text-right">Gốc</th>
                      <th className="py-3 px-3 text-right">Lãi</th>
                      <th className="py-3 px-3 text-right">Tổng gốc + Lãi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scheduleData.rows.map((row) => (
                      <tr
                        key={row.period}
                        className={row.period === 0 ? 'bg-slate-50 font-bold text-slate-500' : 'hover:bg-sky-50/40 transition-colors'}
                      >
                        <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                          {row.period}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">
                          {row.paymentDateStr}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                          {row.beginningBalance.toLocaleString('vi-VN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                          {row.principal > 0 ? row.principal.toLocaleString('vi-VN') : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-amber-700">
                          {row.interest > 0 ? row.interest.toLocaleString('vi-VN') : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#005A9E]">
                          {row.totalPayment > 0 ? row.totalPayment.toLocaleString('vi-VN') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Footer Total row matching PDF 3 screenshot */}
                  <tfoot className="bg-slate-800 text-white font-bold text-xs uppercase">
                    <tr>
                      <td colSpan={3} className="py-3.5 px-4 tracking-wider">
                        TỔNG
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-amber-300">
                        {scheduleData.totalPrincipal.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-amber-300">
                        {scheduleData.totalInterest.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-emerald-300 font-extrabold text-sm">
                        {scheduleData.totalPayment.toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                * Bảng tính mang tính chất tham khảo. Quý khách vui lòng liên hệ quầy giao dịch để biết chính xác.
              </span>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2 bg-[#005A9E] text-white text-xs font-bold rounded-xl hover:bg-[#004a82] transition-colors"
              >
                Đóng bảng tính
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
