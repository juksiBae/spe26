import React from 'react';
import { CheckCircle2, MessageCircle, ArrowRight, Sparkles, Users, Award, ExternalLink } from 'lucide-react';

const SPE_PEM_AKAMIGAS_LOGO = "https://res.cloudinary.com/dshbbyr3e/image/upload/v1788004945/spe_lhelnj.png";

export default function JoinForm() {
  const handleWhatsAppRedirect = () => {
    const text = `Halo Admin SPE PEM Akamigas! Saya tertarik untuk bergabung menjadi member SPE PEM Akamigas Student Chapter. Mohon informasi langkah pendaftaran selanjutnya. Terima kasih!`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/6287820062020?text=${encodedText}`, '_blank');
  };

  const benefits = [
    {
      icon: Users,
      title: "Global Professional Network",
      desc: "Terhubung langsung dengan lebih dari 140.000 profesional, peneliti, dan praktisi industri energi dunia.",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Award,
      title: "Kompetisi & Pengembangan Karir",
      desc: "Akses eksklusif ke kompetisi internasional, paper contest, workshop teknis, serta program bimbingan karir.",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50"
    },
    {
      icon: Sparkles,
      title: "Akses OnePetro & Publikasi",
      desc: "Dapatkan akses gratis ke ribuan jurnal ilmiah, studi kasus, dan publikasi teknik perminyakan terbaik dunia.",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50"
    }
  ];

  return (
    <section id="contact" className="py-24 bg-[#061826]/95 relative overflow-hidden text-white border-b border-[#1C4E75]/70">
      {/* Technical grid backdrop for registration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(47,160,198,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(47,160,198,0.04)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#2FA0C6]/15 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3 pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#7FFFD4]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none animate-pulse duration-[6000ms]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-4 py-1.5 rounded-full bg-[#1C4E75]/60 border border-[#FFEC89]/40 text-[#FFEC89] font-extrabold text-xs uppercase tracking-widest inline-block mb-4 shadow-lg">
            Join Student Chapter
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Pendaftaran <span className="bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] bg-clip-text text-transparent">Member Baru</span>
          </h2>
          <p className="text-[#BDE5FF]/80 text-sm md:text-base">
            Bergabunglah dengan Society of Petroleum Engineers PEM Akamigas untuk membuka gerbang karir global di industri energi. Proses pendaftaran kini jauh lebih mudah dan cepat langsung melalui WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Benefits list */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">
              Mengapa Harus Bergabung?
            </h3>
            <div className="space-y-6">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <div 
                    key={idx}
                    className="flex gap-4 p-5 rounded-2xl bg-[#061826]/80 border border-[#1C4E75] transition-all duration-300 hover:border-[#58C9F3]/60 hover:bg-[#1C4E75]/30 shadow-md group"
                  >
                    <div className="p-3 rounded-xl h-fit bg-[#1C4E75]/70 border border-[#2FA0C6]/40 text-[#7FFFD4] flex-shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-[#58C9F3] transition-colors text-base mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-[#BDE5FF]/75 text-sm leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: WhatsApp CTA Card */}
          <div className="lg:col-span-6 flex items-center">
            <div className="w-full bg-[#061826] text-white rounded-3xl border border-[#2FA0C6]/40 shadow-2xl p-8 md:p-12 relative overflow-hidden flex flex-col justify-between min-h-[450px]">
              {/* Internal abstract blueprints */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(47,160,198,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(47,160,198,0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#2FA0C6]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#7FFFD4]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center text-center my-auto">
                {/* Embedded SPE PEM Akamigas Logo */}
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1C4E75] via-[#2FA0C6] to-[#061826] p-3 shadow-2xl border border-[#58C9F3]/60 transform transition-transform duration-500 hover:scale-105 mb-6 ring-4 ring-[#2FA0C6]/20" title="SPE PEM Akamigas Student Chapter">
                  <img 
                    src={SPE_PEM_AKAMIGAS_LOGO} 
                    alt="SPE PEM Akamigas Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>

                <span className="text-xs font-black uppercase tracking-widest text-[#7FFFD4] mb-2 block">
                  FAST REGISTRATION PROCESS
                </span>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-4">
                  Daftar Instan via WhatsApp
                </h3>
                <p className="text-[#BDE5FF]/75 text-sm max-w-sm mb-8 leading-relaxed">
                  Tidak perlu mengisi formulir panjang. Klik tombol di bawah untuk langsung terhubung dengan Admin Pendaftaran kami untuk proses aktivasi cepat keanggotaan SPE Anda.
                </p>

                <button
                  onClick={handleWhatsAppRedirect}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] hover:brightness-110 text-[#061826] font-black text-sm md:text-base transition-all duration-300 shadow-xl shadow-[#FFEC89]/20 hover:-translate-y-1 cursor-pointer ring-1 ring-[#FFEC89]/40 group"
                >
                  <MessageCircle className="w-5 h-5 fill-[#061826] text-[#061826] transition-transform group-hover:scale-110" />
                  Hubungi Admin di WhatsApp
                  <ArrowRight className="w-4 h-4 text-[#061826] transition-transform group-hover:translate-x-1" />
                </button>

                <div className="mt-6 flex items-center gap-2 text-xs text-[#BDE5FF]/70">
                  <CheckCircle2 className="w-4 h-4 text-[#7FFFD4]" />
                  <span>Aktif 24/7 • Respons Cepat</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
