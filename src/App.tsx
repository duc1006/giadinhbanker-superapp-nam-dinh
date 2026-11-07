import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
  Home
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CustomerFAQ } from './components/CustomerFAQ';
import { DownloadIPay } from './components/DownloadIPay';
import { FlappyGame } from './components/FlappyGame';
import { DepositCalculator } from './components/DepositCalculator';
import { LoanCalculator } from './components/LoanCalculator';
import { FeaturedProducts } from './components/FeaturedProducts';
import { BranchLocations } from './components/BranchLocations';
import { Footer } from './components/Footer';
import { AdvisorModal } from './components/AdvisorModal';
import contentData from './data/contentData.json';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('faq');
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState<boolean>(false);

  // Scroll to top when active tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-12">
            <HeroBanner
              onSelectTab={setActiveTab}
              onOpenAdvisorModal={() => setIsAdvisorModalOpen(true)}
            />
            <CustomerFAQ onBackToMainMenu={() => setActiveTab('faq')} />
          </div>
        );
      case 'faq':
        return <CustomerFAQ onBackToMainMenu={() => setActiveTab('faq')} />;
      case 'download-ipay':
        return <DownloadIPay />;
      case 'game':
        return <FlappyGame onBackToMainMenu={() => setActiveTab('faq')} />;
      case 'deposit':
        return <DepositCalculator />;
      case 'loan':
        return <LoanCalculator />;
      case 'products':
        return <FeaturedProducts />;
      case 'branches':
        return <BranchLocations />;
      default:
        return <CustomerFAQ onBackToMainMenu={() => setActiveTab('faq')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-[#005A9E] selection:text-white pb-20 md:pb-0">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAdvisorModal={() => setIsAdvisorModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Sub-nav quick switcher for fast switching on tablet kiosk */}
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
                activeTab === 'home'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </button>
            {contentData.menuTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#005A9E] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsAdvisorModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 whitespace-nowrap shrink-0"
          >
            <span>Trợ giúp tại quầy: 0973.874.232</span>
          </button>
        </div>

        {renderActiveSection()}
      </main>

      {/* Mobile Floating Bottom Bar for Thumb Reach (Touch-First PWA & Mobile layout) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex flex-col items-center justify-center p-1 min-w-[48px] rounded-lg transition-colors ${
            activeTab === 'faq' ? 'text-[#005A9E] font-bold' : 'text-slate-500'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Hỏi đáp</span>
        </button>

        <button
          onClick={() => setActiveTab('game')}
          className={`flex flex-col items-center justify-center p-1 min-w-[48px] rounded-lg transition-colors ${
            activeTab === 'game' ? 'text-red-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Gamepad2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Minigame</span>
        </button>

        <button
          onClick={() => setActiveTab('deposit')}
          className={`flex flex-col items-center justify-center p-1 min-w-[48px] rounded-lg transition-colors ${
            activeTab === 'deposit' ? 'text-[#005A9E] font-bold' : 'text-slate-500'
          }`}
        >
          <PiggyBank className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Lãi gửi</span>
        </button>

        <button
          onClick={() => setActiveTab('loan')}
          className={`flex flex-col items-center justify-center p-1 min-w-[48px] rounded-lg transition-colors ${
            activeTab === 'loan' ? 'text-[#005A9E] font-bold' : 'text-slate-500'
          }`}
        >
          <Calculator className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Lịch vay</span>
        </button>

        <button
          onClick={() => setActiveTab('branches')}
          className={`flex flex-col items-center justify-center p-1 min-w-[48px] rounded-lg transition-colors ${
            activeTab === 'branches' ? 'text-[#005A9E] font-bold' : 'text-slate-500'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Điểm PGD</span>
        </button>
      </div>

      {/* Footer */}
      <Footer />

      {/* Advisor Popup Modal */}
      <AdvisorModal
        isOpen={isAdvisorModalOpen}
        onClose={() => setIsAdvisorModalOpen(false)}
      />
    </div>
  );
}
