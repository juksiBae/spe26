import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import SponsorDivider from './components/SponsorDivider';
import RewardsSection from './components/RewardsSection';
import AboutSection from './components/AboutSection';
import StatsGrid from './components/StatsGrid';
import ChapterSection from './components/ChapterSection';
import VisionMission from './components/VisionMission';
import CoreValues from './components/CoreValues';
import NewsSection from './components/NewsSection';
import JoinForm from './components/JoinForm';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import speHeroBg from './assets/images/spe_hero_bg_1782489705345.jpg';

export default function App() {
  const isCurrentlyAdminPath = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path === '/admin' || path.startsWith('/admin/') || hash === '#admin';
  };

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(isCurrentlyAdminPath);
  const [bgImage, setBgImage] = useState<string>(() => {
    return localStorage.getItem('spe_custom_bg') || speHeroBg;
  });

  useEffect(() => {
    const handleUrlChange = () => {
      setIsAdminOpen(isCurrentlyAdminPath());
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleExitAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.pathname.toLowerCase().startsWith('/admin')) {
      window.history.pushState({}, '', '/');
    }
    if (window.location.hash.toLowerCase() === '#admin') {
      window.history.pushState({}, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminToggle = () => {
    if (isAdminOpen) {
      handleExitAdmin();
    } else {
      setIsAdminOpen(true);
      window.history.pushState({}, '', '/admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveCustomBg = (url: string) => {
    if (!url.trim()) return;
    setBgImage(url);
    localStorage.setItem('spe_custom_bg', url);
  };

  const handleResetBg = () => {
    setBgImage(speHeroBg);
    localStorage.removeItem('spe_custom_bg');
  };

  return (
    <div className="min-h-screen relative font-sans antialiased text-slate-100 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* 
        Global User Photo Background with Translucent Aqua Nebula Blue Gradient Overlay
      */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-20 transition-all duration-700"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Semi-transparent Aqua Nebula dark gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#061826]/96 via-[#061826]/90 to-[#1C4E75]/80 -z-10 backdrop-blur-[1px] pointer-events-none" />

      {/* Cyber ambient glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#2FA0C6]/12 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#58C9F3]/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-10 w-[400px] h-[400px] bg-[#7FFFD4]/8 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Navbar onAdminToggle={handleAdminToggle} isAdminOpen={isAdminOpen} />
      
      {isAdminOpen ? (
        <div className="pt-20 relative z-10">
          <AdminPanel 
            onExit={handleExitAdmin} 
            currentBgImage={bgImage}
            onUpdateBgImage={handleSaveCustomBg}
            onResetBgImage={handleResetBg}
          />
        </div>
      ) : (
        <main className="relative z-10 w-full">
          <HeroSlider />
          <SponsorDivider />
          <RewardsSection />
          <AboutSection />
          <StatsGrid />
          <ChapterSection />
          <VisionMission />
          <CoreValues />
          <NewsSection />
          <JoinForm />
        </main>
      )}

      <Footer onAdminToggle={handleAdminToggle} />
    </div>
  );
}

