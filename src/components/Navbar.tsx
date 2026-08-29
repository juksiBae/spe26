import { useState, useEffect } from 'react';
import { Menu, X, Shield, Settings } from 'lucide-react';

const SPE_PEM_AKAMIGAS_LOGO = "https://res.cloudinary.com/dshbbyr3e/image/upload/v1788004945/spe_lhelnj.png";

interface NavbarProps {
  onAdminToggle?: () => void;
  isAdminOpen?: boolean;
}

export default function Navbar({ onAdminToggle, isAdminOpen }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Determine active section
      const sections = ['home', 'about', 'global', 'akamigas', 'vision', 'nexus', 'news', 'contact'];
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About SPE' },
    { id: 'global', label: 'SPE Global' },
    { id: 'akamigas', label: 'SPE PEM' },
    { id: 'vision', label: 'Vision' },
    { id: 'nexus', label: '#NexusInAction' },
    { id: 'news', label: 'News' },
    { id: 'contact', label: 'Register' },
  ];

  const handleNavClick = (id: string) => {
    setIsMenuOpen(false);
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
    <header className={`fixed top-0 left-0 w-full z-50 p-4 transition-all duration-300 ${isScrolled ? 'py-2 bg-[#061826]/90 backdrop-blur-md shadow-lg shadow-[#061826]/80 border-b border-[#1C4E75]/50' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-3 bg-[#061826]/60 backdrop-blur-md rounded-full border border-[#2FA0C6]/30 shadow-xl shadow-[#061826]/40 transition-all duration-300">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1C4E75] via-[#2FA0C6] to-[#061826] flex items-center justify-center shadow-lg border border-[#58C9F3]/50 overflow-hidden p-1.5 transition-transform duration-300 hover:scale-105 ring-2 ring-[#7FFFD4]/30" title="SPE PEM Akamigas Student Chapter">
            <img 
              src={SPE_PEM_AKAMIGAS_LOGO} 
              alt="SPE PEM Akamigas Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base md:text-lg tracking-tight leading-tight text-white">
              SPE PEM Akamigas
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#FFEC89] to-[#58C9F3] bg-clip-text text-transparent">
              Student Chapter
            </span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1.5">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-full font-semibold text-sm transition-all duration-300 cursor-pointer ${
                    activeSection === item.id && !isAdminOpen
                      ? 'bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] text-[#061826] font-black shadow-lg shadow-[#FFEC89]/20 scale-105'
                      : 'text-[#BDE5FF]/90 hover:text-[#FFEC89] hover:bg-[#1C4E75]/40'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Admin Toggle Button (Desktop) */}
          {onAdminToggle && (
            <button
              onClick={onAdminToggle}
              className={`ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                isAdminOpen
                  ? 'bg-gradient-to-r from-[#FFEC89] to-[#7FFFD4] text-[#061826] shadow-lg shadow-[#FFEC89]/30 ring-2 ring-[#FFEC89]'
                  : 'bg-[#1C4E75]/80 hover:bg-[#2FA0C6] text-[#FFEC89] hover:text-[#061826] border border-[#FFEC89]/40 hover:border-[#FFEC89] shadow-md'
              }`}
              title={isAdminOpen ? "Kembali ke Website" : "Buka Panel Admin"}
            >
              {isAdminOpen ? <Settings className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
              <span>{isAdminOpen ? 'Close Admin' : 'Admin'}</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle & Admin Quick Access */}
        <div className="flex lg:hidden items-center gap-2">
          {onAdminToggle && (
            <button
              onClick={onAdminToggle}
              className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1 border ${
                isAdminOpen
                  ? 'bg-[#FFEC89] text-[#061826] border-[#FFEC89]'
                  : 'bg-[#1C4E75]/70 text-[#FFEC89] border-[#FFEC89]/40'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full transition-all duration-300 bg-[#1C4E75]/60 border border-[#2FA0C6]/40 text-[#58C9F3]"
          >
            {isMenuOpen ? <X className="w-5 h-5 text-[#FFEC89]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Links */}
      {isMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-[#061826]/95 backdrop-blur-xl border border-[#2FA0C6]/30 p-6 rounded-3xl shadow-2xl shadow-[#061826] flex flex-col gap-3 lg:hidden animate-in fade-in slide-in-from-top-5 duration-300">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full py-3 px-6 rounded-xl text-left font-bold transition-all duration-300 ${
                activeSection === item.id && !isAdminOpen
                  ? 'bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] text-[#061826] font-extrabold shadow-lg shadow-[#FFEC89]/20'
                  : 'text-[#BDE5FF] hover:bg-[#1C4E75]/40 hover:text-[#FFEC89]'
              }`}
            >
              {item.label}
            </button>
          ))}

          {onAdminToggle && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onAdminToggle();
              }}
              className={`w-full py-3 px-6 rounded-xl text-left font-bold flex items-center justify-between transition-all duration-300 border ${
                isAdminOpen
                  ? 'bg-[#FFEC89] text-[#061826] border-[#FFEC89]'
                  : 'bg-[#1C4E75]/60 text-[#FFEC89] border-[#FFEC89]/40 hover:bg-[#1C4E75]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {isAdminOpen ? 'Close Admin Panel' : 'Open Admin Panel'}
              </span>
              <span className="text-xs bg-[#061826]/50 px-2 py-0.5 rounded text-[#7FFFD4]">CMS</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
