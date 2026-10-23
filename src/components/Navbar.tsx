import { useState, useEffect } from 'react';
import { Menu, X, Shield, Settings, Flame, FileText } from 'lucide-react';

const SPE_PEM_AKAMIGAS_LOGO = "https://res.cloudinary.com/dshbbyr3e/image/upload/v1788004945/spe_lhelnj.png";

interface NavbarProps {
  onAdminToggle?: () => void;
  isAdminOpen?: boolean;
  onOpenPortalForm?: () => void;
  onOpenYouthchamp?: () => void;
  currentView?: 'home' | 'portal-form' | 'youthchamp';
}

export default function Navbar({ 
  onAdminToggle, 
  isAdminOpen, 
  onOpenPortalForm, 
  onOpenYouthchamp,
  currentView = 'home'
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isAdminParamPresent, setIsAdminParamPresent] = useState(false);

  useEffect(() => {
    // Check if ?admin=1 is in URL search params
    const checkAdminParam = () => {
      if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        const hasAdminParam = searchParams.get('admin') === '1' || searchParams.get('admin') === 'true';
        const isPathAdmin = window.location.pathname.toLowerCase().startsWith('/admin') || window.location.hash.toLowerCase() === '#admin';
        setIsAdminParamPresent(hasAdminParam || isPathAdmin);
      }
    };

    checkAdminParam();
    window.addEventListener('popstate', checkAdminParam);
    window.addEventListener('hashchange', checkAdminParam);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Determine active section
      const sections = ['home', 'about', 'global', 'akamigas', 'vision', 'nexus', 'news', 'trivia', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', checkAdminParam);
      window.removeEventListener('hashchange', checkAdminParam);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About SPE' },
    { id: 'global', label: 'SPE Global' },
    { id: 'akamigas', label: 'SPE PEM' },
    { id: 'vision', label: 'Vision' },
    { id: 'nexus', label: '#NexusInAction' },
    { id: 'news', label: 'News' },
    { id: 'trivia', label: 'SpeTrivia' },
    { id: 'contact', label: 'Register' },
  ];

  const handleNavClick = (id: string) => {
    setIsMenuOpen(false);
    if (currentView !== 'home') {
      window.location.hash = id;
      window.location.reload();
      return;
    }
    if (isAdminOpen && onAdminToggle) {
      onAdminToggle();
    }
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // offset for the fixed navbar height
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 p-3 sm:p-4 transition-all duration-300 ${isScrolled ? 'py-2 bg-[#061826]/90 backdrop-blur-md shadow-lg shadow-[#061826]/80 border-b border-[#1C4E75]/50' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-2.5 bg-[#061826]/75 backdrop-blur-md rounded-full border border-[#2FA0C6]/30 shadow-xl shadow-[#061826]/40 transition-all duration-300">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#1C4E75] via-[#2FA0C6] to-[#061826] flex items-center justify-center shadow-lg border border-[#58C9F3]/50 overflow-hidden p-1.5 transition-transform duration-300 hover:scale-105 ring-2 ring-[#7FFFD4]/30" title="SPE PEM Akamigas Student Chapter">
            <img 
              src={SPE_PEM_AKAMIGAS_LOGO} 
              alt="SPE PEM Akamigas Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm sm:text-base md:text-lg tracking-tight leading-tight text-white">
              SPE PEM Akamigas
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#FFEC89] to-[#58C9F3] bg-clip-text text-transparent">
              Student Chapter
            </span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden xl:flex items-center gap-1">
          <ul className="flex items-center gap-0.5">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                    activeSection === item.id && !isAdminOpen && currentView === 'home'
                      ? 'bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] text-[#061826] font-black shadow-lg shadow-[#FFEC89]/20 scale-105'
                      : 'text-[#BDE5FF]/90 hover:text-[#FFEC89] hover:bg-[#1C4E75]/40'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Sub-App Action Buttons (Youthchamp 2027 & Portal Form) */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Youthchamp 2027 Button */}
          {onOpenYouthchamp && (
            <button
              onClick={onOpenYouthchamp}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#f25142] to-[#ff8f00] text-white hover:brightness-110 shadow-lg shadow-[#f25142]/30 transition-all cursor-pointer hover:scale-105 active:scale-95 ring-1 ring-[#ffab00]/50"
              title="Open Youthchamp 2027 Portal"
            >
              <Flame className="w-3.5 h-3.5 text-[#ffec89] animate-pulse" />
              <span>Youthchamp</span>
            </button>
          )}

          {/* Portal Form Button */}
          {onOpenPortalForm && (
            <button
              onClick={onOpenPortalForm}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#1C4E75]/80 hover:bg-[#2FA0C6] text-[#7FFFD4] hover:text-[#061826] border border-[#2FA0C6]/50 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
              title="Open Portal Form & Proposal"
            >
              <FileText className="w-3.5 h-3.5 text-[#FFEC89]" />
              <span>Portal Form</span>
            </button>
          )}

          {/* Admin Toggle Button (ONLY SHOWN IF ?admin=1 is present) */}
          {isAdminParamPresent && onAdminToggle && (
            <button
              onClick={onAdminToggle}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                isAdminOpen
                  ? 'bg-gradient-to-r from-[#FFEC89] to-[#7FFFD4] text-[#061826] shadow-lg shadow-[#FFEC89]/30 ring-2 ring-[#FFEC89]'
                  : 'bg-[#1C4E75]/80 hover:bg-[#2FA0C6] text-[#FFEC89] hover:text-[#061826] border border-[#FFEC89]/40 hover:border-[#FFEC89] shadow-md'
              }`}
              title={isAdminOpen ? "Return to Main Website" : "Open Admin Panel"}
            >
              {isAdminOpen ? <Settings className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
              <span>{isAdminOpen ? 'Close Admin' : 'Admin'}</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle & Action Buttons */}
        <div className="flex xl:hidden items-center gap-1.5">
          {/* Mobile Quick Youthchamp */}
          {onOpenYouthchamp && (
            <button
              onClick={onOpenYouthchamp}
              className="sm:hidden px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#f25142] to-[#ff8f00] text-white shadow-md flex items-center gap-1"
            >
              <Flame className="w-3 h-3 text-[#ffec89]" />
              <span>YC 27</span>
            </button>
          )}

          {/* Admin button for mobile if ?admin=1 */}
          {isAdminParamPresent && onAdminToggle && (
            <button
              onClick={onAdminToggle}
              className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all flex items-center gap-1 border ${
                isAdminOpen
                  ? 'bg-[#FFEC89] text-[#061826] border-[#FFEC89]'
                  : 'bg-[#1C4E75]/70 text-[#FFEC89] border-[#FFEC89]/40'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Admin</span>
            </button>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full transition-all duration-300 bg-[#1C4E75]/60 border border-[#2FA0C6]/40 text-[#58C9F3] cursor-pointer"
          >
            {isMenuOpen ? <X className="w-5 h-5 text-[#FFEC89]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Links Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-[#061826]/95 backdrop-blur-xl border border-[#2FA0C6]/30 p-6 rounded-3xl shadow-2xl shadow-[#061826] flex flex-col gap-2.5 xl:hidden animate-in fade-in slide-in-from-top-5 duration-300">
          
          {/* Sub-App Buttons in Mobile Menu */}
          <div className="grid grid-cols-2 gap-2 pb-2 mb-2 border-b border-[#1C4E75]/80">
            {onOpenYouthchamp && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenYouthchamp();
                }}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#f25142] to-[#ff8f00] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Flame className="w-4 h-4 text-[#ffec89]" />
                Youthchamp 2027
              </button>
            )}
            {onOpenPortalForm && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenPortalForm();
                }}
                className="py-2.5 px-3 rounded-xl bg-[#1C4E75] text-[#7FFFD4] font-extrabold text-xs flex items-center justify-center gap-1.5 border border-[#2FA0C6]/50 shadow-md cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#FFEC89]" />
                Portal Form
              </button>
            )}
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full py-2.5 px-5 rounded-xl text-left font-bold transition-all duration-300 text-sm ${
                activeSection === item.id && !isAdminOpen
                  ? 'bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] text-[#061826] font-extrabold shadow-lg shadow-[#FFEC89]/20'
                  : 'text-[#BDE5FF] hover:bg-[#1C4E75]/40 hover:text-[#FFEC89]'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Admin Option if ?admin=1 */}
          {isAdminParamPresent && onAdminToggle && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onAdminToggle();
              }}
              className={`w-full py-3 px-5 rounded-xl text-left font-bold flex items-center justify-between transition-all duration-300 border mt-2 ${
                isAdminOpen
                  ? 'bg-[#FFEC89] text-[#061826] border-[#FFEC89]'
                  : 'bg-[#1C4E75]/60 text-[#FFEC89] border-[#FFEC89]/40 hover:bg-[#1C4E75]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {isAdminOpen ? 'Close Admin Panel' : 'Open Admin Panel (?admin=1)'}
              </span>
              <span className="text-xs bg-[#061826]/50 px-2 py-0.5 rounded text-[#7FFFD4]">CMS</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
