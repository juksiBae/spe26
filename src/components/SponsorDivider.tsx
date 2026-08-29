import { motion } from 'motion/react';
import { Sparkles, Zap, Flame, Globe2, Award, Activity, Compass, Rocket } from 'lucide-react';

export default function SponsorDivider() {
  const nexusItems = [
    {
      tag: "#NexusInAction",
      title: "Energy Transition Leadership",
      desc: "Championing technical competence & clean-tech modules",
      icon: Flame,
      color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400"
    },
    {
      tag: "#NexusInAction",
      title: "Global Chapter Connectivity",
      desc: "Bridging 140K+ international energy professionals",
      icon: Globe2,
      color: "from-indigo-500/20 to-blue-500/10 border-indigo-500/30 text-indigo-400"
    },
    {
      tag: "#NexusInAction",
      title: "Subsurface Research & Tech",
      desc: "Advanced petrophysics & reservoir simulations",
      icon: Zap,
      color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400"
    },
    {
      tag: "#NexusInAction",
      title: "Gold Standard Chapter",
      desc: "Award-winning student development in PEM Akamigas",
      icon: Award,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400"
    },
    {
      tag: "#NexusInAction",
      title: "Coastal Care & Sustainability",
      desc: "Mangrove restoration & environmental drives",
      icon: Compass,
      color: "from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400"
    },
    {
      tag: "#NexusInAction",
      title: "PetroTalent Acceleration",
      desc: "Industry mentoring & OnePetro research access",
      icon: Rocket,
      color: "from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400"
    },
    {
      tag: "#NexusInAction",
      title: "Active Field Operations",
      desc: "Connecting theoretical study with real rig practices",
      icon: Activity,
      color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400"
    }
  ];

  // Triplicate the array for seamless infinite marquee loop
  const duplicatedItems = [...nexusItems, ...nexusItems, ...nexusItems];

  return (
    <section className="bg-[#061826]/90 backdrop-blur-md py-12 md:py-16 border-y border-[#1C4E75]/80 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,160,198,0.12),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 md:mb-10">
        <div className="flex flex-col items-center text-center">
          <span className="px-4 py-1.5 rounded-full bg-[#1C4E75]/50 border border-[#2FA0C6]/40 text-[#7FFFD4] font-extrabold text-xs uppercase tracking-widest mb-3 inline-flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#7FFFD4] animate-pulse" />
            Gerakan & Aksi Nyata Kami
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            <span className="text-white">#Nexus</span>
            <span className="bg-gradient-to-r from-[#58C9F3] via-[#7FFFD4] to-[#BDE5FF] bg-clip-text text-transparent">InAction</span>
          </h3>
          <p className="text-[#BDE5FF]/80 text-xs sm:text-sm max-w-xl mt-2">
            Menggerakkan masa depan industri energi melalui kompetensi teknis, kolaborasi global, dan kepemimpinan berkelanjutan.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#2FA0C6] via-[#58C9F3] to-[#7FFFD4] rounded-full mt-4" />
        </div>
      </div>

      {/* Marquee Container with fade gradient overlays */}
      <div className="relative w-full overflow-hidden py-2">
        {/* Left Fade Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 bg-gradient-to-r from-[#061826] to-transparent z-10 pointer-events-none" />
        {/* Right Fade Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 bg-gradient-to-l from-[#061826] to-transparent z-10 pointer-events-none" />

        {/* Scrolling Inner Container */}
        <div className="flex w-max">
          <motion.div
            className="flex gap-4 sm:gap-6 pr-4 sm:pr-6"
            animate={{ x: ["0%", "-33.333%"] }}
            transition={{
              ease: "linear",
              duration: 28,
              repeat: Infinity,
            }}
          >
            {duplicatedItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 rounded-2xl bg-slate-900/60 border transition-all duration-300 min-w-[260px] sm:min-w-[300px] md:min-w-[340px] group cursor-pointer backdrop-blur-sm hover:scale-[1.02] bg-gradient-to-r ${item.color}`}
                >
                  {/* Icon Frame */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950/80 flex items-center justify-center p-2 border border-white/10 shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  {/* Text Content */}
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-blue-400 uppercase tracking-wider">
                        {item.tag}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-100 text-sm sm:text-base group-hover:text-white transition-colors duration-300 truncate">
                      {item.title}
                    </h4>
                    <p className="text-slate-400 text-xs font-medium truncate">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

