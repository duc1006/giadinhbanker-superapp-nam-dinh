import React, { useState } from 'react';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
  PhoneCall,
  Menu,
  X,
  UserCheck
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { SafeImage } from './SafeImage';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenAdvisorModal: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  HelpCircle: <HelpCircle className="w-4 h-4" />,
  Smartphone: <Smartphone className="w-4 h-4" />,
  Gamepad2: <Gamepad2 className="w-4 h-4" />,
  PiggyBank: <PiggyBank className="w-4 h-4" />,
  Calculator: <Calculator className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  MapPin: <MapPin className="w-4 h-4" />
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAdvisorModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { bankInfo, menuTabs } = contentData;

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro banner for counter trust & quick hotline */}
      <div className="bg-gradient-to-r from-[#003B70] via-[#005A9E] to-[#0072BC] text-white text-xs px-4 py-1.5 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wide">VIETINBANK CHI NHÁNH BẮC PHÚ THỌ / NAM ĐỊNH</span>
            <span className="hidden md:inline text-sky-200">|</span>
            <span className="hidden md:inline text-sky-100">Kiosk Tương Tác Khách Hàng Tại Quầy</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${bankInfo.advisor.phone}`}
              className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
              title="Gọi chuyên viên tư vấn"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Chuyên viên: <strong className="font-bold underline">{bankInfo.advisor.name}</strong> ({bankInfo.advisor.phone})</span>
            </a>
            <span className="text-sky-300 hidden sm:inline">·</span>
            <a
              href={`tel:${bankInfo.hotline.replace(/\s+/g, '')}`}
              className="hidden sm:flex items-center gap-1 hover:text-sky-200 transition-colors font-bold tracking-wider"
            >
              <PhoneCall className="w-3 h-3 text-sky-300" />
              <span>{bankInfo.hotline}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Brand Zone */}
          <div
            onClick={() => handleTabClick('faq')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <SafeImage
              src={bankInfo.logo}
              fallbackSrc={bankInfo.remoteLogo}
              alt="VietinBank"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </div>

          {/* Nav links on desktop */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {menuTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#005A9E] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#005A9E] hover:bg-sky-50/60'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-[#005A9E]'}>
                    {iconMap[tab.icon]}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdvisorModal}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#005A9E] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#005A9E]" />
              <span>Hỗ trợ trực tiếp</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Tab Bar for Medium/Tablet screens (lg to xl) */}
      <div className="hidden lg:flex xl:hidden border-t border-slate-100 bg-slate-50/70 px-4 py-2 overflow-x-auto no-scrollbar gap-2">
        {menuTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#005A9E] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-[#005A9E]'
              }`}
            >
              {iconMap[tab.icon]}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in fade-in slide-in-from-top duration-200">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
            Tính năng tương tác tại quầy
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {menuTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full px-3 py-2.5 text-left text-sm font-medium rounded-xl flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-[#005A9E] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-sky-100 text-[#005A9E]'}`}>
                    {iconMap[tab.icon]}
                  </span>
                  <div>
                    <div className="font-semibold">{tab.label}</div>
                    <div className={`text-xs ${isActive ? 'text-sky-100' : 'text-slate-400'} line-clamp-1`}>
                      {tab.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdvisorModal();
              }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-semibold rounded-xl text-center shadow-xs"
            >
              Liên hệ Chuyên viên Trần Hoàng Trung
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
