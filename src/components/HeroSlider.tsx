import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Award, Sparkles, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, INITIAL_SLIDES } from '../firebase';
import { HeroSlide } from '../types';
import speHeroBg from '../assets/images/spe_hero_bg_1782489705345.jpg';
import speLabBg from '../assets/images/spe_lab_bg_1782489725520.jpg';
import speRewardTrophy from '../assets/images/spe_reward_trophy_1782742761615.jpg';

const SPE_PEM_AKAMIGAS_LOGO = "https://res.cloudinary.com/dshbbyr3e/image/upload/v1788004945/spe_lhelnj.png";

// Helper to resolve local assets or remote URLs
function resolveImage(img: string | undefined, title?: string): string {
  if (!img) {
    if (title?.toLowerCase().includes('award') || title?.toLowerCase().includes('trophy')) return speRewardTrophy;
    return speHeroBg;
  }
  if (img.includes('spe_reward_trophy') || img.includes('trophy') || img.includes('award')) return speRewardTrophy;
  if (img.includes('spe_lab_bg') || img.includes('lab')) return speLabBg;
  if (img.includes('spe_hero_bg')) return speHeroBg;
  return img;
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Subscribe to slides in Firestore with fallback to INITIAL_SLIDES
  useEffect(() => {
    try {
      const q = query(collection(db, 'hero_slides'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched = snapshot.docs
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
              .filter((s: any) => !s.isDeleted) as HeroSlide[];

            if (fetched.length > 0) {
              setSlides(fetched);
              return;
            }
          }
          setSlides(
            INITIAL_SLIDES.map((s, idx) => ({
              id: `init-${idx}`,
              ...s,
            })) as HeroSlide[]
          );
        },
        (error) => {
          console.warn("Firestore hero_slides listener fallback:", error);
          setSlides(
            INITIAL_SLIDES.map((s, idx) => ({
              id: `init-${idx}`,
              ...s,
            })) as HeroSlide[]
          );
        }
      );
      return () => unsubscribe();
    } catch (e) {
      setSlides(
        INITIAL_SLIDES.map((s, idx) => ({
          id: `init-${idx}`,
          ...s,
        })) as HeroSlide[]
      );
    }
  }, []);

  const activeSlides = slides.length > 0 ? slides : (INITIAL_SLIDES.map((s, idx) => ({ id: `init-${idx}`, ...s })) as HeroSlide[]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  // Autoplay slider automatically every 5 seconds without timer progress animation
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 5000); // changes every 5 seconds

    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  const scrollToSection = (id: string | undefined) => {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -85;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const isAwardSlide = currentSlide?.title?.toLowerCase().includes('award') || currentSlide?.subtitle?.toLowerCase().includes('award');

  return (
    <section
      id="home"
      className="relative min-h-[92vh] lg:min-h-screen overflow-hidden bg-[#061826] flex flex-col justify-between pt-28 pb-8 sm:pt-32 sm:pb-12 text-white"
    >
      {/* Background Animated Full-Bleed Slider with Clear Photo Display Behind Text */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide?.id || currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.85, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            {/* Real Image tag for reliable loading and high-definition clarity */}
            <img
              src={resolveImage(currentSlide?.image, currentSlide?.title)}
              alt={currentSlide?.title || "SPE Hero Background"}
              className="w-full h-full object-cover object-center transform scale-[1.02] filter brightness-[0.75] contrast-[1.1] saturate-[1.15]"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src !== speHeroBg) {
                  target.src = speHeroBg;
                }
              }}
            />
            
            {/* Subtle Gradient Overlays to keep text high contrast and readable while showing photo clearly */}
            <div className="absolute inset-0 bg-[#061826]/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061826] via-transparent to-[#061826]/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#061826]/75 via-transparent to-[#061826]/75" />
            
            {/* Subtle Ambient Lighting Accents */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#FFEC89]/15 via-[#2FA0C6]/12 to-transparent rounded-full blur-[130px]" />
            <div className="absolute bottom-16 right-1/4 w-[450px] h-[450px] bg-[#58C9F3]/12 rounded-full blur-[140px]" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Side Arrow Navigation Buttons (Desktop) */}
      <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-6 z-30">
        <button
          onClick={handlePrev}
          className="w-13 h-13 rounded-full bg-[#061826]/80 hover:bg-[#1C4E75] border border-[#2FA0C6]/40 hover:border-[#FFEC89]/60 text-[#BDE5FF] hover:text-[#FFEC89] flex items-center justify-center transition-all duration-300 shadow-2xl shadow-[#061826] backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95 group"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>
      <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 right-6 z-30">
        <button
          onClick={handleNext}
          className="w-13 h-13 rounded-full bg-[#061826]/80 hover:bg-[#1C4E75] border border-[#2FA0C6]/40 hover:border-[#FFEC89]/60 text-[#BDE5FF] hover:text-[#FFEC89] flex items-center justify-center transition-all duration-300 shadow-2xl shadow-[#061826] backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95 group"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Main Slide Text Content Centered Directly Over Background Image */}
      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 my-auto z-20 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide?.id || currentIndex}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center space-y-6"
          >
            {/* Top Subtitle Badge with Butter & Aqua Gradient Glow */}
            <div className="inline-flex items-center gap-3 px-4 sm:px-5 py-2 rounded-full bg-[#061826]/85 border border-[#FFEC89]/40 text-[#FFEC89] text-xs sm:text-sm font-extrabold uppercase tracking-widest backdrop-blur-md shadow-2xl shadow-[#061826]/80 ring-1 ring-[#FFEC89]/20">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-[#1C4E75] via-[#2FA0C6] to-[#061826] p-1 flex items-center justify-center border border-[#58C9F3]/60 shadow-inner">
                <img src={SPE_PEM_AKAMIGAS_LOGO} alt="SPE PEM Akamigas" className="w-full h-full object-contain" />
              </div>
              <span>{currentSlide?.subtitle || 'SPE PEM Akamigas Student Chapter'}</span>
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FFEC89] to-[#7FFFD4] animate-pulse shadow-sm shadow-[#FFEC89]" />
              {isAwardSlide && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-black text-[#FFEC89] bg-[#FFEC89]/15 border border-[#FFEC89]/30 px-2 py-0.5 rounded-full">
                  <Award className="w-3 h-3 text-[#FFEC89]" />
                  Honor Award
                </span>
              )}
            </div>

            {/* Main Headline with Butter and Aqua Gradients */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.12] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] max-w-4xl">
              {currentSlide?.title === "SPE Outstanding Student Chapter Award" ? (
                <>
                  <span className="text-white">SPE Outstanding </span>
                  <span className="bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] bg-clip-text text-transparent drop-shadow-md">
                    Student Chapter Award
                  </span>
                </>
              ) : currentSlide?.title === "Society of Petroleum Engineers" ? (
                <>
                  <span className="text-white">Society of </span>
                  <span className="bg-gradient-to-r from-[#58C9F3] via-[#7FFFD4] to-[#FFEC89] bg-clip-text text-transparent drop-shadow-md">
                    Petroleum Engineers
                  </span>
                </>
              ) : currentSlide?.title === "SPE PEM Akamigas SC" ? (
                <>
                  <span className="text-white">SPE PEM </span>
                  <span className="bg-gradient-to-r from-[#58C9F3] via-[#FFEC89] to-[#7FFFD4] bg-clip-text text-transparent drop-shadow-md">
                    Akamigas SC
                  </span>
                </>
              ) : currentSlide?.title?.includes("#NexusInAction") ? (
                <>
                  <span className="text-white">#Nexus</span>
                  <span className="bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] bg-clip-text text-transparent drop-shadow-md">
                    InAction
                  </span>
                </>
              ) : (
                currentSlide?.title
              )}
            </h1>

            {/* Narrative / Description */}
            <p className="text-[#BDE5FF] text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-3xl mx-auto px-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              {currentSlide?.description}
            </p>

            {/* Call-to-Action Buttons with Butter Gold Gradient Elements */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              {currentSlide?.cta1 && (
                <button
                  onClick={() => scrollToSection(currentSlide.cta1Link || 'akamigas')}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] text-[#061826] hover:brightness-110 font-black text-sm sm:text-base tracking-wide transition-all duration-300 shadow-2xl shadow-[#FFEC89]/25 hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-[#FFEC89]/50"
                >
                  <Sparkles className="w-4 h-4 text-[#061826]" />
                  {currentSlide.cta1}
                  <ArrowRight className="w-4 h-4 text-[#061826]" />
                </button>
              )}

              {currentSlide?.cta2 ? (
                <button
                  onClick={() => scrollToSection(currentSlide.cta2Link || 'nexus')}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#1C4E75]/80 hover:bg-[#1C4E75] border border-[#2FA0C6]/50 hover:border-[#FFEC89]/60 text-[#BDE5FF] hover:text-[#FFEC89] font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md shadow-xl"
                >
                  {currentSlide.cta2 === "#NexusInAction" && <Flame className="w-4 h-4 text-[#FFEC89]" />}
                  {currentSlide.cta2}
                </button>
              ) : (
                <button
                  onClick={() => scrollToSection('contact')}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#1C4E75]/80 hover:bg-[#1C4E75] border border-[#2FA0C6]/50 hover:border-[#FFEC89]/60 text-[#BDE5FF] hover:text-[#FFEC89] font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md shadow-xl"
                >
                  Join Member
                </button>
              )}

              <button
                onClick={() => scrollToSection('news')}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#061826]/80 hover:bg-[#1C4E75]/60 border border-[#7FFFD4]/50 hover:border-[#7FFFD4] text-[#7FFFD4] hover:text-white font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md shadow-xl"
              >
                Latest News
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Minimal Discreet Slide Indicator Dots & Quick Arrows */}
      <div className="relative z-20 w-full flex items-center justify-center gap-3 pb-6 pt-4">
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="lg:hidden p-1.5 rounded-full bg-[#1C4E75]/60 hover:bg-[#1C4E75] border border-[#2FA0C6]/40 text-[#BDE5FF] hover:text-[#FFEC89] transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          {activeSlides.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-8 sm:w-10 h-2.5 bg-gradient-to-r from-[#FFEC89] to-[#7FFFD4] ring-1 ring-[#FFEC89]/50 shadow-md shadow-[#FFEC89]/30'
                    : 'w-2.5 h-2.5 bg-[#1C4E75]/80 hover:bg-[#2FA0C6] hover:scale-125'
                }`}
              />
            );
          })}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="lg:hidden p-1.5 rounded-full bg-[#1C4E75]/60 hover:bg-[#1C4E75] border border-[#2FA0C6]/40 text-[#BDE5FF] hover:text-[#FFEC89] transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

