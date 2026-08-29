import { Calendar, Award, Landmark } from 'lucide-react';

const SPE_PEM_AKAMIGAS_LOGO = "https://res.cloudinary.com/dshbbyr3e/image/upload/v1788004945/spe_lhelnj.png";

export default function ChapterSection() {
  const highlights = [
    { title: "Established 2017", desc: "Formally chartered by SPE International, serving as the official academic gateway in PEM Akamigas.", icon: Calendar },
    { title: "Competency Development", desc: "Providing intensive technical software training, guest lectures, and petroleum study groups.", icon: Award },
    { title: "Energy Game Changer", desc: "Championing sustainable innovation, clean-tech integrations, and environmental responsibility.", icon: Landmark },
  ];

  return (
    <section 
      id="akamigas" 
      className="py-24 bg-[#061826]/95 relative overflow-hidden border-b border-[#1C4E75]/60"
    >
      {/* Subsurface geological contour / reservoir strata simulation */}
      <div className="absolute inset-0 opacity-[0.06] text-[#58C9F3] pointer-events-none select-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="contour-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="40" cy="40" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contour-grid)" />
          {/* Wave paths representing geological reservoir strata layers */}
          <path d="M-100,220 Q250,120 550,320 T1200,220 T1800,420 L1800,1000 L-100,1000 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-100,270 Q250,170 550,370 T1200,270 T1800,470 L1800,1000 L-100,1000 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-100,320 Q250,220 550,420 T1200,320 T1800,520 L1800,1000 L-100,1000 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-100,370 Q250,270 550,470 T1200,370 T1800,570 L1800,1000 L-100,1000 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Decorative ambient background glows */}
      <div className="absolute bottom-12 left-10 w-96 h-96 bg-[#2FA0C6]/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-12 right-10 w-96 h-96 bg-[#7FFFD4]/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Visual Side */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-[#2FA0C6]/20 rounded-3xl blur-3xl transform translate-x-4 translate-y-4 pointer-events-none" />
            <div className="relative bg-[#061826]/90 p-8 sm:p-10 rounded-3xl border border-[#2FA0C6]/40 text-white shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-[#1C4E75]/80">
                <div>
                  <span className="text-xs font-black tracking-widest text-[#7FFFD4] uppercase">Local Chapter</span>
                  <h3 className="text-2xl font-extrabold mt-1 tracking-tight leading-snug">
                    SPE PEM Akamigas SC
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1C4E75] via-[#2FA0C6] to-[#061826] p-2 shadow-xl border border-[#58C9F3]/50 flex items-center justify-center shrink-0 ring-2 ring-[#7FFFD4]/30" title="SPE PEM Akamigas Student Chapter">
                  <img 
                    src={SPE_PEM_AKAMIGAS_LOGO} 
                    alt="SPE PEM Akamigas Logo" 
                    className="w-full h-full object-contain" 
                  />
                </div>
              </div>
              <p className="text-[#BDE5FF]/85 text-sm leading-relaxed mb-6">
                Society of Petroleum Engineers Politeknik Energi & Mineral Akamigas Student Chapter (SPE PEM AKAMIGAS SC) was established with a clear mandate: to elevate geological science understanding and industrial operational visibility for students.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1C4E75]/40 border border-[#2FA0C6]/30">
                  <div className="w-10 h-10 rounded-full bg-[#2FA0C6]/30 text-[#7FFFD4] flex items-center justify-center font-bold">
                    17
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Founded in 2017</h5>
                    <p className="text-[#BDE5FF]/70 text-xs">Pioneering energy chapter in Cepu</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1C4E75]/40 border border-[#2FA0C6]/30">
                  <div className="w-10 h-10 rounded-full bg-[#7FFFD4]/20 text-[#7FFFD4] flex items-center justify-center font-bold">
                    GP
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Gold Standard Program</h5>
                    <p className="text-[#BDE5FF]/70 text-xs">Awarded for student development excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="px-4 py-1.5 rounded-full font-extrabold text-xs uppercase tracking-widest inline-block mb-4 self-start bg-[#1C4E75]/70 border border-[#FFEC89]/40 text-[#FFEC89] shadow-lg">
              Our Chapter
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6 text-white">
              Empowering <span className="bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] bg-clip-text text-transparent">Student Talents</span>
            </h2>
            <p className="text-base md:text-lg leading-relaxed mb-10 text-[#BDE5FF]/85">
              We aim to elevate standard engineering concepts to match state-of-the-art field operational workflows. By hosting technical conferences, software bootcamps, and volunteer environmental modules, our student members transform into ready-to-deploy energy professionals.
            </p>

            <div className="space-y-6">
              {highlights.map((hl, idx) => {
                const Icon = hl.icon;
                return (
                  <div 
                    key={idx} 
                    className="group flex gap-4 p-6 rounded-3xl border transition-all duration-300 bg-[#061826]/80 border-[#1C4E75] hover:border-[#58C9F3]/60 hover:bg-[#1C4E75]/30 hover:shadow-xl shadow-lg"
                  >
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1C4E75] to-[#2FA0C6] text-[#7FFFD4] border border-[#2FA0C6]/50 self-start transition-transform duration-500 group-hover:scale-110 shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base md:text-lg mb-1 text-white group-hover:text-[#58C9F3] transition-colors">{hl.title}</h4>
                      <p className="text-sm leading-relaxed text-[#BDE5FF]/75">{hl.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
