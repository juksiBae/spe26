import { useState, useEffect } from 'react';
import { 
  Play, 
  Flame, 
  Brain, 
  Mic, 
  FileText, 
  ArrowRight, 
  ExternalLink, 
  BookOpen, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Instagram, 
  Sparkles, 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  Award, 
  ChevronRight,
  Menu,
  X,
  Layers,
  Zap,
  Target
} from 'lucide-react';

interface YouthchampProps {
  onBackToSPEPortal: () => void;
}

export default function Youthchamp2027({ onBackToSPEPortal }: YouthchampProps) {
  const [showTeaser, setShowTeaser] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'petrosmart' | 'speech' | 'paper'>('petrosmart');

  // Countdown to November 17, 2026 00:00:00
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    const target = new Date('November 17, 2026 00:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: d.toString().padStart(2, '0'),
        hours: h.toString().padStart(2, '0'),
        minutes: m.toString().padStart(2, '0'),
        seconds: s.toString().padStart(2, '0')
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const registrationLinks = {
    petrosmart: 'https://drive.google.com/drive/folders/1k7yuI4aDqy3AU-3qxyVVFDyld66sLk1L?usp=drive_link',
    speech: 'https://drive.google.com/drive/folders/1W4erN-3JWqQhZlVdx4cVkWZNsNAyd5k0?usp=drive_link',
    paper: 'https://drive.google.com/drive/folders/1Ld6M6-bxTMhMhFIihOafnZbgBhhKcVOZ?usp=drive_link'
  };

  const scrollToYCSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = -80;
      const y = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#1b1c1e] font-sans antialiased overflow-x-hidden selection:bg-[#f25142] selection:text-white relative">
      
      {/* ========================================================================= */}
      {/* 1. TEASER PAGE / VIDEO OVERLAY */}
      {/* ========================================================================= */}
      {showTeaser ? (
        <div className="fixed inset-0 z-[100] bg-[#190508] text-white flex flex-col justify-center items-center overflow-y-auto px-4 py-12">
          {/* Background Poster / Video Simulation */}
          <div 
            className="fixed inset-0 -z-10 bg-cover bg-center filter blur-[2px] brightness-[0.4] opacity-70"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80')` }}
          />
          <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#801026]/90 via-[#f25142]/60 to-[#0d2847]/90 pointer-events-none" />

          <div className="max-w-4xl mx-auto w-full text-center relative z-10 my-auto flex flex-col items-center">
            {/* Flame Logo Icon */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/15 border-2 border-[#ffab00]/70 p-4 shadow-2xl flex items-center justify-center mb-4 backdrop-blur-md">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#801026] via-[#f25142] to-[#ffab00] flex items-center justify-center text-white shadow-inner">
                <Flame className="w-12 h-12 text-[#ffec89] animate-bounce" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#ffab00]/40 text-[#ffab00] text-xs font-black uppercase tracking-widest mb-3 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#ffec89]" />
              SPE PEM Akamigas SC
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-3 bg-gradient-to-r from-white via-[#ffd56b] to-[#ff7a63] bg-clip-text text-transparent">
              Youthchamp 2027
            </h1>

            <p className="text-sm sm:text-lg font-bold text-[#ffab00] max-w-2xl mx-auto leading-snug mb-3">
              "Fueling Young Innovators, Transforming Renewable Energy, Driving a Sustainable Future"
            </p>

            <p className="text-xs sm:text-sm text-[#ffe6db]/90 max-w-2xl mx-auto leading-relaxed mb-6">
              A national academic competition exclusively designed for senior high school students across Indonesia, proudly organized by the SPE PEM Akamigas Student Chapter.
            </p>

            {/* VIMEO VIDEO EMBED PLAYER */}
            <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-2 border-white/20 aspect-video mb-6 relative bg-black">
              <iframe
                src="https://player.vimeo.com/video/1149964630?h=79298cbc66&title=0&byline=0&portrait=0&badge=0"
                className="w-full h-full"
                allow="fullscreen; picture-in-picture"
                allowFullScreen
                title="SPE PEM Akamigas Youthchamp Teaser"
              />
            </div>

            {/* Countdown Box */}
            <div className="w-full max-w-2xl p-5 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-md mb-6">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#ffe6db] mb-3 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-[#ffab00]" />
                Registration Open Batch 1 Starts In:
              </h3>
              <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
                <div className="bg-white/15 px-4 py-2.5 rounded-xl border border-white/20 min-w-[70px] sm:min-w-[85px] text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#ffab00] leading-none">{timeLeft.days}</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-200 mt-1">Days</div>
                </div>
                <div className="bg-white/15 px-4 py-2.5 rounded-xl border border-white/20 min-w-[70px] sm:min-w-[85px] text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#ffab00] leading-none">{timeLeft.hours}</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-200 mt-1">Hours</div>
                </div>
                <div className="bg-white/15 px-4 py-2.5 rounded-xl border border-white/20 min-w-[70px] sm:min-w-[85px] text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#ffab00] leading-none">{timeLeft.minutes}</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-200 mt-1">Minutes</div>
                </div>
                <div className="bg-white/15 px-4 py-2.5 rounded-xl border border-white/20 min-w-[70px] sm:min-w-[85px] text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#ffab00] leading-none">{timeLeft.seconds}</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-200 mt-1">Seconds</div>
                </div>
              </div>
            </div>

            {/* Enter Website Button */}
            <button
              onClick={() => {
                setShowTeaser(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#f25142] to-[#ff8f00] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-2xl shadow-[#f25142]/60 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-[#ffab00]/50"
            >
              <span>Enter Youthchamp 2027 Main Portal</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Contact & Back to SPE */}
            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-[#ffd56b]">
              <a href="https://instagram.com/YouthChamp2026" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1.5">
                <Instagram className="w-4 h-4" /> @YouthChamp2026
              </a>
              <a href="mailto:youthchamp.2026@gmail.com" className="hover:underline flex items-center gap-1.5">
                <Mail className="w-4 h-4" /> youthchamp.2026@gmail.com
              </a>
            </div>

            <button
              onClick={onBackToSPEPortal}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/40 border border-white/20 text-slate-200 hover:text-[#ffab00] text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to SPE PEM Akamigas Main Portal</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* 2. MAIN YOUTHCHAMP WEBSITE */}
      {/* ========================================================================= */}
      
      {/* Floating Teaser Toggle Button */}
      <button
        onClick={() => {
          setShowTeaser(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full bg-gradient-to-r from-[#801026] via-[#f25142] to-[#ffab00] text-white flex items-center justify-center shadow-2xl shadow-[#f25142]/60 hover:scale-110 active:scale-95 transition-all cursor-pointer ring-2 ring-white/60"
        title="Open Teaser Video & Countdown"
      >
        <Play className="w-5 h-5 fill-current ml-0.5" />
      </button>

      {/* Header & Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-md border-b border-[#f25142]/20 py-3.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f25142] to-[#ffab00] flex items-center justify-center text-white shadow-md">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#c2203d]">Youthchamp</span>
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#801026] via-[#f25142] to-[#ffab00] text-white text-xs font-bold">2027</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5">
            <button onClick={() => scrollToYCSection('yc-home')} className="text-xs font-bold text-slate-700 hover:text-[#c2203d] transition-colors cursor-pointer">Home</button>
            <button onClick={() => scrollToYCSection('yc-about')} className="text-xs font-bold text-slate-700 hover:text-[#c2203d] transition-colors cursor-pointer">About</button>
            <button onClick={() => scrollToYCSection('yc-theme')} className="text-xs font-bold text-slate-700 hover:text-[#c2203d] transition-colors cursor-pointer">Theme & Philosophy</button>
            <button onClick={() => scrollToYCSection('yc-categories')} className="text-xs font-bold text-slate-700 hover:text-[#c2203d] transition-colors cursor-pointer">Categories</button>
            <button onClick={() => scrollToYCSection('yc-timeline')} className="text-xs font-bold text-slate-700 hover:text-[#c2203d] transition-colors cursor-pointer">Timeline</button>
            <button onClick={() => scrollToYCSection('yc-registration')} className="text-xs font-bold text-[#c2203d] hover:text-[#801026] transition-colors cursor-pointer">Registration</button>
            
            <button 
              onClick={() => setShowTeaser(true)} 
              className="px-3 py-1.5 rounded-full bg-[#f25142]/10 text-[#c2203d] text-xs font-bold hover:bg-[#f25142]/20 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" /> Teaser
            </button>

            <button 
              onClick={onBackToSPEPortal}
              className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" /> SPE Portal
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-100 text-[#c2203d] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-6 py-4 space-y-3 shadow-xl animate-in fade-in">
            <button onClick={() => scrollToYCSection('yc-home')} className="block w-full text-left font-bold text-sm text-slate-800">Home</button>
            <button onClick={() => scrollToYCSection('yc-about')} className="block w-full text-left font-bold text-sm text-slate-800">About</button>
            <button onClick={() => scrollToYCSection('yc-theme')} className="block w-full text-left font-bold text-sm text-slate-800">Theme & Philosophy</button>
            <button onClick={() => scrollToYCSection('yc-categories')} className="block w-full text-left font-bold text-sm text-slate-800">Categories</button>
            <button onClick={() => scrollToYCSection('yc-timeline')} className="block w-full text-left font-bold text-sm text-slate-800">Timeline</button>
            <button onClick={() => scrollToYCSection('yc-registration')} className="block w-full text-left font-bold text-sm text-[#c2203d]">Registration</button>
            <div className="pt-2 flex flex-col gap-2">
              <button onClick={() => setShowTeaser(true)} className="py-2 text-center rounded-xl bg-[#f25142]/10 text-[#c2203d] font-bold text-xs">
                Open Teaser Video
              </button>
              <button onClick={onBackToSPEPortal} className="py-2 text-center rounded-xl bg-blue-600 text-white font-bold text-xs">
                Return to SPE Portal
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="yc-home" className="py-20 lg:py-28 bg-gradient-to-br from-[#180509] via-[#360c14] to-[#0d2847] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(242,81,66,0.25),transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#ffab00]/40 text-[#ffab00] text-xs font-black uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" /> SPE PEM Akamigas SC
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight mb-4 bg-gradient-to-r from-white via-[#ffe28a] to-[#ff725c] bg-clip-text text-transparent">
            YOUTHCHAMP 2027
          </h1>
          <p className="text-lg sm:text-2xl font-bold text-[#ffab00] max-w-3xl mx-auto leading-snug mb-5">
            "Fueling Young Innovators, Transforming Renewable Energy, Driving a Sustainable Future"
          </p>
          <p className="text-sm sm:text-base text-[#ffe6db]/90 max-w-2xl mx-auto leading-relaxed mb-8">
            Youthchamp is a national academic competition exclusively designed for senior high school students, proudly organized by the SPE PEM Akamigas Student Chapter.
          </p>

          <div className="flex justify-center gap-3 sm:gap-4 flex-wrap mb-8">
            <div className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-bold flex items-center gap-2 text-[#ffc4be]">
              <Brain className="w-4 h-4 text-[#f25142]" /> Petrosmart
            </div>
            <div className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-bold flex items-center gap-2 text-[#ffe599]">
              <Mic className="w-4 h-4 text-[#ffab00]" /> Speech Comp.
            </div>
            <div className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-bold flex items-center gap-2 text-[#bad9ff]">
              <FileText className="w-4 h-4 text-[#58c9f3]" /> Paper & Poster
            </div>
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => scrollToYCSection('yc-registration')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#f25142] to-[#ff8f00] text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-[#f25142]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Register Now
            </button>
            <button
              onClick={() => scrollToYCSection('yc-categories')}
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm transition-all cursor-pointer"
            >
              Competition Categories
            </button>
          </div>
        </div>
      </section>

      {/* INTRODUCTION / ABOUT */}
      <section id="yc-about" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#801026] via-[#f25142] to-[#ffab00] bg-clip-text text-transparent inline-block mb-3">
            Introduction
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Discover Youthchamp 2027 as the catalyst for young talents in the national and global energy sector.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-video relative">
            <img
              src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
              alt="Youthchamp Mascot"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <span className="text-[#ffab00] font-bold text-xs uppercase tracking-wider">Official Mascot & Identity</span>
                <h4 className="text-lg font-bold">Youthchamp 2027</h4>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
            <h3 className="text-2xl font-black text-[#801026]">About Youthchamp 2027</h3>
            <p>
              Youthchamp is a premier national academic competition exclusively designed for senior high school students, proudly organized by the SPE PEM Akamigas Student Chapter. This initiative inspires and empowers the next generation to explore the frontiers of energy, science, and innovation.
            </p>
            <p>
              Through this competition, senior high school students from across the country are invited to hone their analytical thinking, problem-solving creativity, leadership, and scientific communication in addressing the challenges of global energy transitions.
            </p>
            <div className="p-4 rounded-2xl bg-[#fff2ed] border-l-4 border-[#f25142]">
              <h5 className="font-bold text-[#801026] text-sm">SPE PEM Akamigas Student Chapter</h5>
              <p className="text-xs text-slate-600 mt-1">
                The premier student chapter affiliated with SPE International, dedicated to bridging academic energy education with industry workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GRAND THEME & 3 SUBTHEMES */}
      <section id="yc-theme" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-[#c2203d] mb-3">Grand Theme 2027</h2>
            <p className="text-lg sm:text-xl font-bold text-[#801026] max-w-3xl mx-auto">
              "Fueling Young Innovators, Transforming Renewable Energy, Driving a Sustainable Future"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#fffdfc] border-t-4 border-[#f25142] shadow-lg text-center hover:-translate-y-2 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#f25142] flex items-center justify-center mx-auto mb-4">
                <Flame className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2">Addressing Oil & Gas Transition</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tackling complexities and opportunities in transitioning conventional energy toward sustainable multi-source systems.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fffdfc] border-t-4 border-[#f25142] shadow-lg text-center hover:-translate-y-2 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#f25142] flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2">The Acute Need for Change Agents</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The urgent requirement for young talents to pioneer technological breakthroughs and clean energy solutions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fffdfc] border-t-4 border-[#f25142] shadow-lg text-center hover:-translate-y-2 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#f25142] flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2">The Urgency of Time for Future</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accelerating immediate actions and collaborative research to safeguard long-term energy sustainability.
              </p>
            </div>
          </div>

          {/* THEME PHILOSOPHY 3 PILLARS */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#f25142]/20 shadow-md flex flex-col justify-between">
              <div>
                <h4 className="font-black text-[#801026] text-lg mb-2">1. Fueling Young Innovators</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  <strong>Philosophy:</strong> Young innovators are powerful engines, and this event serves as high-octane fuel to ignite their untapped potential.
                </p>
              </div>
              <div className="p-3 bg-[#fff8f5] rounded-xl border-l-3 border-[#f25142] text-xs text-[#801026]">
                <strong>Logo Relation:</strong> Red symbolizes the courageous <em>"First Spark"</em> of innovation.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#f25142]/20 shadow-md flex flex-col justify-between">
              <div>
                <h4 className="font-black text-[#801026] text-lg mb-2">2. Transforming Renewable Energy</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  <strong>Philosophy:</strong> Signaling radical transformation in the energy landscape integrated smartly with clean renewables.
                </p>
              </div>
              <div className="p-3 bg-[#fff8f5] rounded-xl border-l-3 border-[#f25142] text-xs text-[#801026]">
                <strong>Logo Relation:</strong> Red embodies <em>"Urgency & Courage"</em> in disrupting legacy paradigms.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#f25142]/20 shadow-md flex flex-col justify-between">
              <div>
                <h4 className="font-black text-[#801026] text-lg mb-2">3. Driving a Sustainable Future</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  <strong>Philosophy:</strong> Youth are drivers shaping the course toward an equitable, clean energy horizon.
                </p>
              </div>
              <div className="p-3 bg-[#fff8f5] rounded-xl border-l-3 border-[#f25142] text-xs text-[#801026]">
                <strong>Logo Relation:</strong> Orange gradient represents <em>"Progress & Bright Horizon"</em>.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPETITION CATEGORIES */}
      <section id="yc-categories" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-[#c2203d] mb-3">Competition Categories</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Select your category, review the Heyzine Flipbook Guidebook, and submit your registration.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('petrosmart')}
            className={`px-6 py-3 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'petrosmart'
                ? 'bg-gradient-to-r from-[#801026] to-[#f25142] text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-[#f25142]'
            }`}
          >
            <Brain className="w-4 h-4" /> Petrosmart
          </button>
          <button
            onClick={() => setSelectedCategory('speech')}
            className={`px-6 py-3 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'speech'
                ? 'bg-gradient-to-r from-[#801026] to-[#f25142] text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-[#f25142]'
            }`}
          >
            <Mic className="w-4 h-4" /> Speech Competition
          </button>
          <button
            onClick={() => setSelectedCategory('paper')}
            className={`px-6 py-3 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'paper'
                ? 'bg-gradient-to-r from-[#801026] to-[#f25142] text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-[#f25142]'
            }`}
          >
            <FileText className="w-4 h-4" /> Scientific Paper & Poster
          </button>
        </div>

        {/* Dynamic Category Details */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#f25142]/20">
          {selectedCategory === 'petrosmart' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="px-3.5 py-1 rounded-full bg-orange-100 text-[#f25142] text-xs font-black uppercase tracking-wider mb-4 inline-block">
                  Category 01
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#801026] mb-4">Petrosmart Competition</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  A high-intensity smart quiz competition testing fundamental knowledge in petroleum science, physics, chemistry, thermodynamics, and the global energy transition for senior high school teams.
                </p>

                <div className="space-y-3 mb-8 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Team Composition: 3 active senior high school students</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Multiple Stages: Preliminary Online Quiz, Semi-Finals, & Grand Final</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://heyzine.com/flip-book/f76a5a2283.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#801026] hover:bg-[#a61533] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                  >
                    <BookOpen className="w-4 h-4 text-[#ffab00]" />
                    <span>Open Flipbook Guidebook</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={registrationLinks.petrosmart}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#f25142] to-[#ff8f00] text-white text-xs font-black uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
                  >
                    <span>Register Petrosmart</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="h-72 rounded-2xl overflow-hidden bg-slate-900 relative shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
                  alt="Petrosmart"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            </div>
          )}

          {selectedCategory === 'speech' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="px-3.5 py-1 rounded-full bg-orange-100 text-[#ffab00] text-xs font-black uppercase tracking-wider mb-4 inline-block">
                  Category 02
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#801026] mb-4">Speech Competition</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  An English speech contest empowering students to articulate persuasive arguments and innovative viewpoints regarding sustainable energy solutions, net-zero initiatives, and global climate responsibilities.
                </p>

                <div className="space-y-3 mb-8 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Individual Entry: 1 senior high school student</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Language: 100% English Delivery & Q&A Session</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://heyzine.com/flip-book/4249a5bba1.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#801026] hover:bg-[#a61533] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                  >
                    <BookOpen className="w-4 h-4 text-[#ffab00]" />
                    <span>Open Flipbook Guidebook</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={registrationLinks.speech}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#f25142] to-[#ff8f00] text-white text-xs font-black uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
                  >
                    <span>Register Speech</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="h-72 rounded-2xl overflow-hidden bg-slate-900 relative shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80"
                  alt="Speech Competition"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            </div>
          )}

          {selectedCategory === 'paper' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="px-3.5 py-1 rounded-full bg-blue-100 text-[#0d2847] text-xs font-black uppercase tracking-wider mb-4 inline-block">
                  Category 03
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#801026] mb-4">Scientific Paper & Poster</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Conduct original scientific research, author comprehensive papers, and present visual infographics on cutting-edge renewable technology, CCUS applications, or bio-energy solutions.
                </p>

                <div className="space-y-3 mb-8 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Team: 2-3 senior high school students</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Full Paper Submission & Poster Defense Session</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://heyzine.com/flip-book/bc1c13bf69.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#801026] hover:bg-[#a61533] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                  >
                    <BookOpen className="w-4 h-4 text-[#ffab00]" />
                    <span>Open Flipbook Guidebook</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={registrationLinks.paper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#f25142] to-[#ff8f00] text-white text-xs font-black uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
                  >
                    <span>Register Paper & Poster</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="h-72 rounded-2xl overflow-hidden bg-slate-900 relative shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"
                  alt="Scientific Paper"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* TIMELINE */}
      <section id="yc-timeline" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-[#c2203d] mb-3">Official Timeline</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm">
              Mark these essential dates for registration, submission deadlines, semi-finals, and awarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Open Registration Batch 1", date: "Nov 17 - Dec 15, 2026", desc: "Early bird registration window for all three branches." },
              { title: "Open Registration Batch 2", date: "Dec 16 - Jan 10, 2027", desc: "Regular registration phase and document submission." },
              { title: "Technical Meeting", date: "Jan 18, 2027", desc: "Comprehensive briefing on rules and evaluation criteria." },
              { title: "Preliminary Stage (Online)", date: "Jan 24 - Jan 28, 2027", desc: "Online quiz assessments and initial paper screening." },
              { title: "Announcement of Finalists", date: "Feb 05, 2027", desc: "Release of official top qualifiers for the grand finals." },
              { title: "Grand Final & Awarding", date: "Feb 20, 2027", desc: "Live stage presentations, final speeches, and awarding ceremony." }
            ].map((tm, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#fffaf8] border border-[#f25142]/20 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#f25142] bg-orange-100 px-3 py-1 rounded-full mb-3 inline-block">
                  Stage 0{idx + 1}
                </span>
                <h4 className="font-extrabold text-[#801026] text-base mb-1">{tm.title}</h4>
                <div className="text-xs font-bold text-[#ffab00] mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{tm.date}</span>
                </div>
                <p className="text-xs text-slate-600">{tm.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ONLINE REGISTRATION CTA SECTION */}
      <section id="yc-registration" className="py-20 bg-gradient-to-br from-[#801026] via-[#f25142] to-[#0d2847] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#ffab00] text-xs font-black uppercase tracking-widest mb-4 inline-block">
            Online Registration
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight">
            Ready to become the Next Energy Pioneer?
          </h2>
          <p className="text-sm sm:text-base text-[#ffe6db]/90 max-w-2xl mx-auto mb-8">
            Select your category to access registration folders, download template documents, and submit your team's application.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
            <a
              href={registrationLinks.petrosmart}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white flex flex-col items-center gap-2 transition-all hover:scale-105"
            >
              <Brain className="w-6 h-6 text-[#ffab00]" />
              <span className="font-bold text-sm">Petrosmart</span>
              <span className="text-[10px] text-slate-300">Open Drive Folder ↗</span>
            </a>
            <a
              href={registrationLinks.speech}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white flex flex-col items-center gap-2 transition-all hover:scale-105"
            >
              <Mic className="w-6 h-6 text-[#ffab00]" />
              <span className="font-bold text-sm">Speech Competition</span>
              <span className="text-[10px] text-slate-300">Open Drive Folder ↗</span>
            </a>
            <a
              href={registrationLinks.paper}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white flex flex-col items-center gap-2 transition-all hover:scale-105"
            >
              <FileText className="w-6 h-6 text-[#ffab00]" />
              <span className="font-bold text-sm">Paper & Poster</span>
              <span className="text-[10px] text-slate-300">Open Drive Folder ↗</span>
            </a>
          </div>

          <button
            onClick={onBackToSPEPortal}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#801026] hover:bg-slate-100 font-extrabold text-xs uppercase tracking-wider shadow-2xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to SPE PEM Akamigas Main Portal</span>
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#180509] text-white py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f25142] flex items-center justify-center text-white font-black">
              YC
            </div>
            <div>
              <div className="text-white font-bold">Youthchamp 2027</div>
              <div>SPE PEM Akamigas Student Chapter</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://instagram.com/YouthChamp2026" target="_blank" rel="noopener noreferrer" className="hover:text-[#ffab00] flex items-center gap-1">
              <Instagram className="w-4 h-4" /> @YouthChamp2026
            </a>
            <a href="mailto:youthchamp.2026@gmail.com" className="hover:text-[#ffab00] flex items-center gap-1">
              <Mail className="w-4 h-4" /> Contact Email
            </a>
          </div>

          <div>
            &copy; {new Date().getFullYear()} Youthchamp SPE PEM Akamigas SC. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
