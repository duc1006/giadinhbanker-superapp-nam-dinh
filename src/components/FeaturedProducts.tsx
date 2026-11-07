import React, { useState } from 'react';
import {
  Sparkles,
  Gift,
  Star,
  ChevronRight,
  Phone,
  X,
  CheckCircle2,
  ExternalLink,
  Tag
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { SafeImage } from './SafeImage';

export const FeaturedProducts: React.FC = () => {
  const { featuredProducts, bankInfo } = contentData;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [interestedProduct, setInterestedProduct] = useState<(typeof featuredProducts.items)[0] | null>(null);
  const [showNoticeModal, setShowNoticeModal] = useState<boolean>(false);
  const [zoomPoster, setZoomPoster] = useState<string | null>(null);

  const filteredItems = selectedCategory === 'all'
    ? featuredProducts.items
    : featuredProducts.items.filter((item) => item.category === selectedCategory);

  const handleInterestClick = (item: (typeof featuredProducts.items)[0]) => {
    setInterestedProduct(item);
    setShowNoticeModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Featured Header Card with gradient & thin red border as requested by PDF 5 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-2 border-red-500/30 rounded-3xl p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold shadow-xs">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{featuredProducts.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {featuredProducts.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {featuredProducts.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-sky-100 flex items-center justify-center text-red-600">
              <Gift className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar (PDF 5 requirement) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {featuredProducts.categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-[#005A9E] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Product Posters Carousel / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white border border-slate-200 hover:border-[#005A9E] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Poster Image Container */}
            <div className="relative bg-slate-100 overflow-hidden aspect-4/3 cursor-pointer"
                 onClick={() => setZoomPoster(item.image)}>
              <SafeImage
                src={item.image}
                fallbackSrc={item.remoteImage}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                {item.categoryLabel}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-semibold underline">
                  Nhấp để phóng to poster
                </span>
              </div>
            </div>

            {/* Poster Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>{item.highlight}</span>
                </span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#005A9E] transition-colors leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Nút "Tôi quan tâm" (PDF 5 requirement) */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleInterestClick(item)}
                  className="flex-1 py-3 bg-[#005A9E] hover:bg-[#004a82] text-white text-xs font-bold rounded-xl shadow-xs transition-colors text-center"
                >
                  Tôi quan tâm
                </button>
                <button
                  onClick={() => setZoomPoster(item.image)}
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                  title="Xem poster chi tiết"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* "Tôi quan tâm" Modal Dialog (Exact text from PDF 5) */}
      {showNoticeModal && interestedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-[#005A9E] bg-sky-50 px-3 py-1 rounded-md">
                Đăng ký quan tâm dịch vụ
              </span>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {interestedProduct.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {interestedProduct.categoryLabel}
                  </p>
                </div>
              </div>

              {/* Exact text mandated by PDF 5 */}
              <div className="p-4 bg-sky-50/80 border border-sky-100 rounded-2xl text-slate-800 text-sm leading-relaxed font-medium">
                Cảm ơn Quý khách đã quan tâm đến sản phẩm/dịch vụ này. Quý khách vui lòng liên hệ cán bộ VietinBank tại quầy để được tư vấn chi tiết.
              </div>

              {/* Contact box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">
                    Liên hệ Chuyên viên tư vấn
                  </span>
                  <div className="text-sm font-bold text-slate-900">
                    {bankInfo.advisor.name}
                  </div>
                  <div className="text-xs font-semibold text-[#005A9E]">
                    SĐT: {bankInfo.advisor.phone}
                  </div>
                </div>

                <a
                  href={`tel:${bankInfo.advisor.phone}`}
                  className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors text-center"
                >
                  Gọi tư vấn viên ngay
                </a>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowNoticeModal(false)}
                className="w-full py-3 bg-[#005A9E] hover:bg-[#004a82] text-white text-xs font-bold rounded-xl transition-colors"
              >
                Đã hiểu, quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Poster Zoom Modal */}
      {zoomPoster && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setZoomPoster(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-4 overflow-hidden shadow-2xl">
            <button
              onClick={() => setZoomPoster(null)}
              className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <SafeImage
              src={zoomPoster}
              alt="Poster chi tiết"
              className="w-auto h-auto max-h-[82vh] max-w-full object-contain mx-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
