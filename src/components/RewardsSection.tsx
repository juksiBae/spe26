import { useState, useEffect } from 'react';
import { Award, Calendar, Tag, ChevronRight, X, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Reward } from '../types';
import { INITIAL_REWARDS } from '../firebase';

export default function RewardsSection() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to safely resolve assets
  const resolveImage = (imageName: string) => {
    if (imageName === 'spe_reward_trophy_1782742761615') {
      return '/assets/images/spe_reward_trophy_1782742761615.jpg';
    }
    return imageName;
  };

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const rewardsCol = collection(db, 'rewards');
        // Fetch all documents and filter/sort client-side to avoid composite index requirements
        const querySnapshot = await getDocs(rewardsCol);
        
        const rewardsList: Reward[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          rewardsList.push({
            id: doc.id,
            title: data.title || '',
            category: data.category || '',
            year: data.year || '',
            description: data.description || '',
            image: data.image || '',
            createdAt: data.createdAt ? (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString(),
            isDeleted: data.isDeleted === true
          });
        });

        // Filter out soft-deleted ones and sort by year desc
        const activeRewards = rewardsList
          .filter((r) => !r.isDeleted)
          .sort((a, b) => b.year.localeCompare(a.year));

        if (activeRewards.length > 0) {
          setRewards(activeRewards);
        } else {
          // Fallback to initial seeds
          setRewards(INITIAL_REWARDS.map((r, i) => ({
            id: `fallback-${i}`,
            ...r,
            isDeleted: false
          } as Reward)));
        }
      } catch (err) {
        console.error("Failed to load rewards from Firestore, using fallback seeds:", err);
        setRewards(INITIAL_REWARDS.map((r, i) => ({
          id: `fallback-${i}`,
          ...r,
          isDeleted: false
        } as Reward)));
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  // Filter rewards by categories
  const categories = ['all', ...Array.from(new Set(rewards.map(r => r.category).filter((c): c is string => !!c)))];

  const filteredRewards = activeTab === 'all' 
    ? rewards 
    : rewards.filter(r => r.category === activeTab);

  return (
    <section id="rewards" className="relative py-24 bg-[#061826] border-b border-[#1C4E75]/80 overflow-hidden">
      {/* Visual background lights */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#2FA0C6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-[#7FFFD4]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <span className="text-[#FFEC89] font-extrabold text-xs uppercase tracking-widest inline-flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#FFEC89] animate-bounce" />
              Pencapaian Terbaik Kami
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Prestasi & Penghargaan <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58C9F3] via-[#7FFFD4] to-[#FFEC89]">SPE PEM Akamigas</span>
            </h2>
            <p className="text-[#BDE5FF]/85 text-base leading-relaxed">
              Daftar penghargaan bergengsi dan pengakuan global yang telah diraih oleh Student Chapter kami dalam membina kompetensi, kepemimpinan, dan inovasi berkelanjutan.
            </p>
          </div>
          
          {/* Decorative stats */}
          <div className="flex items-center justify-center gap-6 self-center md:self-end bg-[#061826]/80 px-6 py-4 rounded-2xl border border-[#1C4E75] backdrop-blur-md shadow-xl">
            <div className="text-center border-r border-[#1C4E75] pr-6">
              <div className="text-2xl font-black text-[#FFEC89]">10+</div>
              <div className="text-[10px] uppercase font-bold text-[#58C9F3] tracking-wider">Total Reward</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-[#7FFFD4]">Global</div>
              <div className="text-[10px] uppercase font-bold text-[#58C9F3] tracking-wider">Recognition</div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        {!loading && categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-full font-bold text-xs capitalize transition-all duration-300 border cursor-pointer whitespace-nowrap ${
                  activeTab === cat
                    ? 'bg-[#1C4E75] border-[#58C9F3] text-white shadow-lg shadow-[#2FA0C6]/25'
                    : 'bg-[#061826]/90 border-[#1C4E75]/70 text-[#BDE5FF]/70 hover:border-[#2FA0C6] hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Rewards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-[#061826]/60 border border-[#1C4E75] animate-pulse" />
            ))}
          </div>
        ) : filteredRewards.length === 0 ? (
          <div className="text-center py-16 bg-[#061826]/40 rounded-3xl border border-[#1C4E75]">
            <Award className="w-12 h-12 text-[#1C4E75] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#BDE5FF]">Belum Ada Reward Ditemukan</h3>
            <p className="text-[#BDE5FF]/60 text-sm mt-1">Reward dalam kategori ini akan segera diperbarui.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedReward(reward)}
                className="group relative flex flex-col min-h-[490px] h-full bg-[#061826]/85 border border-[#1C4E75] rounded-3xl overflow-hidden cursor-pointer hover:border-[#58C9F3] transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#2FA0C6]/20 backdrop-blur-sm"
              >
                {/* Image Frame */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-[#061826] border-b border-[#1C4E75]/60 shrink-0">
                  {/* Subtle Glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061826] to-transparent opacity-60 z-10" />
                  <img
                    src={resolveImage(reward.image)}
                    alt={reward.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578269174936-2709b5a12368?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  
                  {/* Floating badging */}
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#1C4E75]/90 border border-[#58C9F3]/60 text-[#FFEC89] font-black text-[10px] uppercase tracking-wider shadow-md backdrop-blur-md">
                      {reward.year}
                    </span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="flex flex-col flex-1 p-5 sm:p-6 relative justify-between">
                  <div>
                    {/* Category text */}
                    {reward.category && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#58C9F3] uppercase tracking-widest mb-2.5">
                        <Tag className="w-3.5 h-3.5 text-[#7FFFD4]" />
                        {reward.category}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-[#58C9F3] transition-colors duration-300 leading-snug mb-2.5 line-clamp-2">
                      {reward.title}
                    </h3>

                    {/* Description excerpt */}
                    <p className="text-[#BDE5FF]/80 text-xs leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4">
                      {reward.description}
                    </p>
                  </div>

                  {/* Bottom details action */}
                  <div className="mt-auto pt-3 border-t border-[#1C4E75]/80 flex items-center justify-between text-[11px] font-bold text-[#BDE5FF]/70 group-hover:text-[#7FFFD4] transition-colors duration-300">
                    <span className="uppercase tracking-wider">Detail Pencapaian</span>
                    <div className="w-8 h-8 rounded-full bg-[#1C4E75]/60 border border-[#2FA0C6]/40 group-hover:bg-[#2FA0C6] group-hover:border-[#58C9F3] group-hover:text-[#061826] flex items-center justify-center transition-all duration-300 shadow-sm shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Modal Popup for Detailed View */}
      <AnimatePresence>
        {selectedReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReward(null)}
              className="absolute inset-0 bg-[#061826]/85 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-[#061826] border border-[#2FA0C6]/40 rounded-3xl overflow-hidden shadow-2xl shadow-[#2FA0C6]/20 max-h-[90vh] flex flex-col md:flex-row z-10"
            >
              {/* Image Frame (Left on Desktop, Top on Mobile) */}
              <div className="relative md:w-1/2 h-64 md:h-auto bg-[#061826] flex-shrink-0">
                <img
                  src={resolveImage(selectedReward.image)}
                  alt={selectedReward.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#061826]/80 to-transparent" />
                
                {/* Hover style internal caption */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#061826]/90 backdrop-blur-sm border border-[#1C4E75] text-center">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#58C9F3]">{selectedReward.category || 'Achievement'}</span>
                  <div className="text-white text-xs font-bold mt-0.5">{selectedReward.year} SC Award</div>
                </div>
              </div>

              {/* Text Frame (Right on Desktop, Bottom on Mobile) */}
              <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between overflow-y-auto">
                <div>
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedReward(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-extrabold text-[10px] uppercase tracking-wider">
                      {selectedReward.year}
                    </span>
                    {selectedReward.category && (
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                        {selectedReward.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-4">
                    {selectedReward.title}
                  </h3>

                  <div className="w-12 h-1 bg-amber-500 rounded mb-6" />

                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {selectedReward.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Award className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">SPE PEM Akamigas SC</div>
                    <div className="text-[10px] text-slate-500 font-medium">Verified Chapter Recognition</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
