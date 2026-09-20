import { motion } from 'motion/react';
import { Sparkles, Handshake, ArrowRight } from 'lucide-react';

export default function SponsorDivider() {
  const sponsorData = {
    name: 'Official Sponsor',
    logo: 'https://res.cloudinary.com/dshbbyr3e/image/upload/v1789900990/WhatsApp_Image_2026-09-20_at_13.13.03_dul8f6.jpg',
    tier: 'Official Partner',
  };

  // Repeated items for seamless infinite runner loop
  const baseItems = Array.from({ length: 6 }).map((_, idx) => ({
    ...sponsorData,
    id: `sponsor-item-${idx}`,
  }));
  const runnerItems = [...baseItems, ...baseItems];

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="sponsors" 
      className="bg-[#061826]/95 backdrop-blur-md py-12 md:py-16 border-y border-[#1C4E75]/80 relative overflow-hidden text-white"
    >
      {/* Background radial highlights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,160,198,0.14),transparent_65%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-gradient-to-r from-[#FFEC89]/10 via-[#2FA0C6]/10 to-[#7FFFD4]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Cyber Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(47,160,198,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(47,160,198,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-10">
          <span className="px-4 py-1.5 rounded-full bg-[#1C4E75]/60 border border-[#2FA0C6]/50 text-[#7FFFD4] font-extrabold text-xs uppercase tracking-widest mb-3 inline-flex items-center gap-2 shadow-lg ring-1 ring-[#7FFFD4]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#FFEC89] animate-pulse" />
            Official Sponsors & Partners
          </span>
          
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            <span>Didukung & Disponsori </span>
            <span className="bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] bg-clip-text text-transparent">
              Oleh
            </span>
          </h3>
          
          <p className="text-[#BDE5FF]/85 text-xs sm:text-sm max-w-xl mt-2.5 leading-relaxed">
            Apresiasi dan terima kasih kepada mitra resmi yang bersinergi mendukung perkembangan inovasi dan kompetensi mahasiswa SPE PEM Akamigas.
          </p>
          
          <div className="w-20 h-1 bg-gradient-to-r from-[#2FA0C6] via-[#FFEC89] to-[#7FFFD4] rounded-full mt-4" />
        </div>
      </div>

      {/* Infinite Slide Runner Marquee with Medium-Sized Cards */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Left & Right Fade Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-40 bg-gradient-to-r from-[#061826] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-40 bg-gradient-to-l from-[#061826] to-transparent z-20 pointer-events-none" />

        {/* Continuous Animated Track */}
        <div className="flex w-max">
          <motion.div
            className="flex gap-8 sm:gap-12 md:gap-16 pr-8 sm:pr-12 md:pr-16 items-center"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              ease: 'linear',
              duration: 25,
              repeat: Infinity,
            }}
          >
            {runnerItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="shrink-0 flex items-center justify-center py-2 px-4 transition-transform duration-300 hover:scale-110 cursor-pointer"
              >
                <img
                  src={item.logo}
                  alt={item.name}
                  className="h-12 sm:h-14 md:h-16 w-auto max-w-[220px] object-contain filter drop-shadow-md transition-all duration-300 hover:brightness-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Call-to-action for Partnership */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center">
          <span className="text-xs sm:text-sm text-[#BDE5FF]/70 font-medium">
            Tertarik berkolaborasi dan menjadi mitra sponsor SPE PEM Akamigas?
          </span>
          <button
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C4E75]/70 hover:bg-[#1C4E75] border border-[#2FA0C6]/50 hover:border-[#FFEC89]/60 text-[#FFEC89] hover:text-white text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shadow-md hover:scale-105"
          >
            <Handshake className="w-4 h-4 text-[#FFEC89]" />
            <span>Ajukan Kemitraan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}


