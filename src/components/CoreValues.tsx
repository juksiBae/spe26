import { Globe2, Award, Zap, Users, ShieldCheck, Flame, Sparkles } from 'lucide-react';

export default function CoreValues() {
  const values = [
    {
      letter: "N",
      title: "Network",
      icon: Globe2,
      desc: "Building strong connections among members, alumni, industry professionals, and external organizations to make SPE a hub of opportunities, collaboration, and future energy networks.",
    },
    {
      letter: "E",
      title: "Empower",
      icon: Award,
      desc: "Empowering every member to grow through leadership experiences, technical development, organizational involvement, and opportunities to explore their full potential.",
    },
    {
      letter: "X",
      title: "Xceed",
      icon: Zap,
      desc: "Encouraging members and officers to go beyond limits, embrace innovation, and strive for achievements greater than ever before.",
    },
    {
      letter: "U",
      title: "Unite",
      icon: Users,
      desc: "Uniting different divisions, generations, and perspectives into one shared vision to create a solid, supportive, and collaborative organization.",
    },
    {
      letter: "S",
      title: "Sustainability",
      icon: ShieldCheck,
      desc: "Sustaining impactful programs, organizational values, and long-term contributions that continuously benefit both the campus and the energy industry.",
    },
  ];

  const handleJoinAction = () => {
    const el = document.getElementById('contact');
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="nexus" 
      className="py-20 md:py-24 bg-[#061826]/95 text-white relative overflow-hidden backdrop-blur-md border-b border-[#1C4E75]/70"
    >
      {/* Blueprint cyber grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(47,160,198,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(47,160,198,0.04)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      {/* Atmospheric blue gradients and glow */}
      <div className="absolute top-10 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#2FA0C6]/12 rounded-full blur-3xl pointer-events-none animate-pulse duration-[5000ms]" />
      <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#58C9F3]/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-[7000ms]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-[#7FFFD4]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <span className="px-4 py-1.5 rounded-full font-extrabold text-xs uppercase tracking-widest inline-flex items-center gap-2 mb-4 bg-[#1C4E75]/60 border border-[#FFEC89]/40 text-[#FFEC89] shadow-lg">
            <Sparkles className="w-4 h-4 text-[#FFEC89] animate-pulse" />
            Core Values & Movement
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-white">
            #Nexus<span className="bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] bg-clip-text text-transparent">InAction</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#BDE5FF]/85 px-2">
            Membina generasi pemimpin dan inovator energi masa depan melalui nilai-nilai fundamental NEXUS.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Brand/Slogan Side */}
          <div className="lg:col-span-4 flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden bg-[#061826]/90 border-[#2FA0C6]/40 text-white backdrop-blur-md">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFEC89]/15 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border flex items-center justify-center mb-6 shadow-lg bg-[#1C4E75]/60 border-[#FFEC89]/50 text-[#FFEC89]">
              <Flame className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse text-[#FFEC89]" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black mb-2 text-white">#NexusInAction</h3>
            <p className="text-xs sm:text-sm leading-relaxed mb-6 text-[#BDE5FF]/80">
              Gerakan aksi nyata SPE PEM Akamigas yang mencerminkan dedikasi, ketangguhan, dan kolaborasi mahasiswa dalam menorehkan prestasi serta kontribusi nyata bagi industri energi.
            </p>

            <button 
              onClick={handleJoinAction}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] text-[#061826] font-black text-xs uppercase tracking-widest shadow-lg shadow-[#FFEC89]/25 hover:brightness-110 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ring-1 ring-[#FFEC89]/40"
            >
              Join #NexusInAction
            </button>
          </div>

          {/* Cards Side */}
          <div className="lg:col-span-8 space-y-3.5 sm:space-y-4">
            {values.map((v, idx) => {
              return (
                <div 
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl border transition-all duration-300 bg-[#061826]/80 border-[#1C4E75] hover:border-[#58C9F3]/60 hover:bg-[#1C4E75]/30 backdrop-blur-sm shadow-md group"
                >
                  {/* Letter Circle */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl font-mono text-[#061826] bg-gradient-to-br from-[#2FA0C6] to-[#7FFFD4] shadow-md flex-shrink-0 border border-[#7FFFD4]/40">
                    {v.letter}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-[#58C9F3] transition-colors mb-1">
                      {v.title}
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed font-normal text-[#BDE5FF]/80">
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

