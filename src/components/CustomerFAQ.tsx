import React, { useState } from 'react';
import {
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Phone,
  Play,
  RotateCcw,
  Sparkles,
  Maximize2,
  X
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { SafeImage } from './SafeImage';

interface CustomerFAQProps {
  onBackToMainMenu: () => void;
}

export const CustomerFAQ: React.FC<CustomerFAQProps> = ({ onBackToMainMenu }) => {
  const { faqSection, bankInfo } = contentData;
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'satisfied' | 'need-help'>('idle');
  const [showEndDialog, setShowEndDialog] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  const selectedTopic = faqSection.topics.find((t) => t.id === selectedTopicId);

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    setCurrentStepIndex(0);
    setFeedbackStatus('idle');
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleResetTopic = () => {
    setSelectedTopicId(null);
    setCurrentStepIndex(0);
    setFeedbackStatus('idle');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* If no topic selected, show 4 main cards */}
      {!selectedTopic ? (
        <div className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-[#005A9E] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Hỗ trợ tự phục vụ tại quầy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {faqSection.question}
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto">
              {faqSection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {faqSection.topics.map((topic, index) => (
              <div
                key={topic.id}
                onClick={() => handleSelectTopic(topic.id)}
                className="group relative bg-white border border-slate-200 hover:border-[#005A9E] rounded-2xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#005A9E] bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                      {topic.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Mục 0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#005A9E] transition-colors flex items-center justify-between">
                    <span>{topic.title}</span>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#005A9E] transition-transform group-hover:translate-x-1" />
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {topic.summary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {topic.steps.length} bước thực hiện
                  </span>
                  <span className="font-semibold text-[#005A9E] group-hover:underline flex items-center gap-1">
                    Xem hướng dẫn chi tiết
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick contact strip */}
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-sky-50 to-indigo-50/50 border border-sky-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-11 h-11 rounded-xl bg-white shadow-xs border border-sky-100 flex items-center justify-center text-[#005A9E] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Cần hỗ trợ trực tiếp từ nhân viên VietinBank?
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Chuyên viên tư vấn: <strong>{bankInfo.advisor.name}</strong> – Hotline:{' '}
                  <a href={`tel:${bankInfo.advisor.phone}`} className="text-[#005A9E] font-semibold underline">
                    {bankInfo.advisor.phone}
                  </a>
                </p>
              </div>
            </div>
            <a
              href={`tel:${bankInfo.advisor.phone}`}
              className="px-4 py-2.5 bg-[#005A9E] hover:bg-[#004a82] text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap shadow-xs"
            >
              Gọi ngay chuyên viên
            </a>
          </div>
        </div>
      ) : (
        /* Detailed Step-by-Step Guide view */
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header Bar of the guide */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleResetTopic}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Chọn mục khác</span>
              </button>
              <div>
                <span className="text-xs text-[#005A9E] font-semibold">{selectedTopic.badge}</span>
                <h2 className="text-xl font-bold text-slate-900">{selectedTopic.title}</h2>
              </div>
            </div>

            {/* Video button */}
            <a
              href={selectedTopic.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              title="Mở video hướng dẫn trên YouTube"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Xem video YouTube</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

          {/* Steps Navigator Tabs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {selectedTopic.steps.map((st, idx) => (
                <button
                  key={st.step}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${
                    currentStepIndex === idx
                      ? 'bg-[#005A9E] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold ${
                      currentStepIndex === idx ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {st.step}
                  </span>
                  <span>{st.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Step Spotlight View */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Left Column: Instruction Content */}
              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#005A9E] tracking-wider uppercase">
                    <span>Bước {currentStepIndex + 1} / {selectedTopic.steps.length}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {selectedTopic.steps[currentStepIndex].title}
                  </h3>

                  <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-xl text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
                    {selectedTopic.steps[currentStepIndex].content}
                  </div>
                </div>

                {/* Step Navigation Controls */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    disabled={currentStepIndex === 0}
                    onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      currentStepIndex === 0
                        ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Bước trước</span>
                  </button>

                  <span className="text-xs text-slate-400 font-medium">
                    {currentStepIndex + 1} trên {selectedTopic.steps.length}
                  </span>

                  <button
                    disabled={currentStepIndex === selectedTopic.steps.length - 1}
                    onClick={() => setCurrentStepIndex((prev) => Math.min(selectedTopic.steps.length - 1, prev + 1))}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      currentStepIndex === selectedTopic.steps.length - 1
                        ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                        : 'bg-[#005A9E] hover:bg-[#004a82] text-white shadow-xs'
                    }`}
                  >
                    <span>Bước kế tiếp</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Step Image */}
              <div className="lg:col-span-6 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-6 flex flex-col items-center justify-center relative min-h-[340px]">
                <div className="relative group max-w-sm w-full mx-auto">
                  <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                    <SafeImage
                      src={selectedTopic.steps[currentStepIndex].image}
                      fallbackSrc={selectedTopic.steps[currentStepIndex].remoteImage}
                      alt={selectedTopic.steps[currentStepIndex].title}
                      className="w-full h-auto max-h-[380px] object-contain mx-auto rounded-xl cursor-zoom-in"
                      onClick={() =>
                        setPreviewImage({
                          src: selectedTopic.steps[currentStepIndex].image,
                          alt: selectedTopic.steps[currentStepIndex].title
                        })
                      }
                    />
                  </div>
                  <button
                    onClick={() =>
                      setPreviewImage({
                        src: selectedTopic.steps[currentStepIndex].image,
                        alt: selectedTopic.steps[currentStepIndex].title
                      })
                    }
                    className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg text-xs flex items-center gap-1 backdrop-blur-xs transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Phóng to</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-3 text-center">
                  Nhấp vào ảnh để xem kích thước lớn
                </p>
              </div>
            </div>
          </div>

          {/* All Steps Gallery for quick scan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Toàn bộ lộ trình hướng dẫn ({selectedTopic.steps.length} bước)</span>
              <a
                href={selectedTopic.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-red-600" />
                <span>Xem trên YouTube</span>
              </a>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {selectedTopic.steps.map((st, idx) => (
                <button
                  key={st.step}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    currentStepIndex === idx
                      ? 'border-[#005A9E] bg-sky-50 ring-2 ring-[#005A9E]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-[11px] font-bold text-slate-500 mb-1">
                    Bước {st.step}
                  </div>
                  <div className="h-16 w-full rounded-lg overflow-hidden bg-slate-100 mb-1 flex items-center justify-center">
                    <SafeImage
                      src={st.image}
                      fallbackSrc={st.remoteImage}
                      alt={st.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] text-slate-600 line-clamp-2 leading-tight">
                    {st.content}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Required Feedback Section from PDF 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-5">
            <div className="max-w-xl mx-auto space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                {faqSection.feedbackText}
              </h3>
              <p className="text-xs text-slate-500">
                Ý kiến của Quý khách giúp VietinBank không ngừng nâng cao chất lượng dịch vụ
              </p>
            </div>

            {/* If user hasn't selected feedback yet */}
            {feedbackStatus === 'idle' ? (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setFeedbackStatus('satisfied')}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã ổn, tôi đã làm được</span>
                </button>
                <button
                  onClick={() => setFeedbackStatus('need-help')}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Chưa ổn, cần hỗ trợ thêm</span>
                </button>
              </div>
            ) : feedbackStatus === 'satisfied' ? (
              /* User clicked "Đã ổn" */
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 max-w-xl mx-auto space-y-3 animate-in fade-in">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-emerald-900">
                  {faqSection.feedbackSuccessMessage}
                </p>
                <p className="text-xs text-emerald-700">
                  Quý khách có thể quay lại danh sách câu hỏi hoặc chọn các tiện ích khác tại quầy.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={handleResetTopic}
                    className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition-colors"
                  >
                    Quay lại câu hỏi khác
                  </button>
                  <button
                    onClick={onBackToMainMenu}
                    className="px-4 py-2 bg-white text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-50"
                  >
                    Về trang chủ Kiosk
                  </button>
                </div>
              </div>
            ) : (
              /* User clicked "Chưa ổn" - PDF 1 requirement text */
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-2xl mx-auto space-y-4 animate-in fade-in text-left">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 shrink-0 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-amber-900">
                      Hỗ trợ trực tiếp từ Chuyên viên tư vấn
                    </h4>
                    <p className="text-sm text-amber-800 leading-relaxed font-medium">
                      “{faqSection.feedbackNeedHelpMessage}”
                    </p>
                  </div>
                </div>

                <div className="bg-white/80 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Chuyên viên phụ trách</span>
                    <div className="text-base font-bold text-slate-900">{bankInfo.advisor.name}</div>
                    <div className="text-xs text-slate-600">Số điện thoại: <strong>{bankInfo.advisor.phone}</strong></div>
                  </div>
                  <a
                    href={`tel:${bankInfo.advisor.phone}`}
                    className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl text-center shadow-xs transition-colors"
                  >
                    Gọi điện hỗ trợ ngay
                  </a>
                </div>
              </div>
            )}

            {/* Navigation options: "Quay lại menu chính" & "Kết thúc cuộc trò chuyện" */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onBackToMainMenu}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Quay lại menu chính</span>
              </button>
              <button
                onClick={() => setShowEndDialog(true)}
                className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Kết thúc cuộc trò chuyện
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End Conversation Modal (PDF 1 requirement) */}
      {showEndDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-sky-100 text-[#005A9E] mx-auto flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#005A9E]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                Cảm ơn Quý khách!
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {faqSection.endConversationMessage}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-500">
              Ngân hàng TMCP Công Thương Việt Nam – Nâng giá trị cuộc sống.
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEndDialog(false);
                  handleResetTopic();
                  onBackToMainMenu();
                }}
                className="flex-1 py-3 bg-[#005A9E] hover:bg-[#004a82] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Về màn hình chính
              </button>
              <button
                onClick={() => setShowEndDialog(false)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-4 overflow-hidden shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <SafeImage
              src={previewImage.src}
              alt={previewImage.alt}
              className="w-auto h-auto max-h-[80vh] max-w-full object-contain mx-auto rounded-lg"
            />
            <p className="text-xs text-center text-slate-600 mt-2 font-medium">
              {previewImage.alt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
