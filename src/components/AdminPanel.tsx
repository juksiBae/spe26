import React, { useState, useEffect } from 'react';
import { Shield, Key, Lock, Layers, Inbox, Users, Plus, Trash2, Edit3, Check, X, FileText, AlertCircle, RefreshCw, Eye, Image, Award, Trophy, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { NewsArticle, Registration, HeroSlide, Reward } from '../types';
import speHeroBg from '../assets/images/spe_hero_bg_1782489705345.jpg';
import speLabBg from '../assets/images/spe_lab_bg_1782489725520.jpg';
import speRewardTrophy from '../assets/images/spe_reward_trophy_1782742761615.jpg';
import { db, Timestamp } from '../firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy } from 'firebase/firestore';

const resolveImage = (imageUrl: string) => {
  if (!imageUrl) return speHeroBg;
  if (imageUrl.includes('photo-1518709268805-4e9042af9f23')) {
    return speHeroBg;
  }
  if (imageUrl.includes('photo-1454165804606-c3d57bc86b40')) {
    return speLabBg;
  }
  if (imageUrl.includes('spe_reward_trophy_1782742761615') || imageUrl.includes('reward_trophy')) {
    return speRewardTrophy;
  }
  return imageUrl;
};

interface AdminPanelProps {
  onExit?: () => void;
  currentBgImage?: string;
  onUpdateBgImage?: (url: string) => void;
  onResetBgImage?: () => void;
}

export default function AdminPanel({ onExit, currentBgImage, onUpdateBgImage, onResetBgImage }: AdminPanelProps) {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'registrations' | 'news' | 'backgrounds' | 'rewards'>('registrations');
  const [customBgInput, setCustomBgInput] = useState('');
  const [bgSuccessMsg, setBgSuccessMsg] = useState('');

  // Database lists
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);

  // News Form state (For Create/Edit)
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newsFormData, setNewsFormData] = useState({
    title: '',
    date: '',
    image: '',
    excerpt: '',
    fullText: ''
  });

  // Rewards Form state (For Create/Edit)
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [showRewardsForm, setShowRewardsForm] = useState(false);
  const [rewardsFormData, setRewardsFormData] = useState({
    title: '',
    category: '',
    year: '',
    description: '',
    image: ''
  });

  // Slides Form state (For Create/Edit)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [showSlidesForm, setShowSlidesForm] = useState(false);
  const [slidesFormData, setSlidesFormData] = useState({
    title: '',
    accentTitle: '',
    subtitle: '',
    description: '',
    image: '',
    cta1: 'About SPE',
    cta1Link: 'about',
    cta2: '',
    cta2Link: '',
    imageLayout: 'background' as 'background' | 'split'
  });

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('spe_admin_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Fetch lists whenever authenticated token is present
  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch registrations from Firestore
      const regCol = collection(db, 'registrations');
      const qReg = query(regCol, orderBy('createdAt', 'desc'));
      const regSnapshot = await getDocs(qReg);
      const regList: Registration[] = [];
      regSnapshot.forEach(docSnap => {
        const data = docSnap.data();
        regList.push({
          id: docSnap.id,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          major: data.major,
          studyYear: data.studyYear,
          motivation: data.motivation,
          role: data.role,
          status: data.status || 'pending',
          createdAt: data.createdAt ? (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString()
        } as Registration);
      });
      setRegistrations(regList);

      // 2. Fetch news from Firestore
      const newsCol = collection(db, 'news');
      const qNews = query(newsCol, orderBy('createdAt', 'desc'));
      const newsSnapshot = await getDocs(qNews);
      const newsList: NewsArticle[] = [];
      newsSnapshot.forEach(docSnap => {
        const data = docSnap.data();
        newsList.push({
          id: docSnap.id,
          title: data.title,
          date: data.date,
          excerpt: data.excerpt,
          fullText: data.fullText,
          image: data.image,
          createdAt: data.createdAt ? (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString()
        } as NewsArticle);
      });
      setNews(newsList);

      // 3. Fetch hero slides from Firestore
      const slidesCol = collection(db, 'hero_slides');
      const qSlides = query(slidesCol, orderBy('createdAt', 'asc'));
      const slidesSnapshot = await getDocs(qSlides);
      const slidesList: HeroSlide[] = [];
      slidesSnapshot.forEach(docSnap => {
        const data = docSnap.data();
        slidesList.push({
          id: docSnap.id,
          title: data.title,
          accentTitle: data.accentTitle || '',
          subtitle: data.subtitle,
          description: data.description,
          image: data.image,
          cta1: data.cta1 || '',
          cta1Link: data.cta1Link || '',
          cta2: data.cta2 || '',
          cta2Link: data.cta2Link || '',
          createdAt: data.createdAt ? (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString(),
          isDeleted: data.isDeleted === true,
          imageLayout: data.imageLayout || 'background'
        } as HeroSlide);
      });
      setSlides(slidesList);

      // 4. Fetch rewards from Firestore
      const rewardsCol = collection(db, 'rewards');
      const qRewards = query(rewardsCol, orderBy('year', 'desc'));
      const rewardsSnapshot = await getDocs(qRewards);
      const rewardsList: Reward[] = [];
      rewardsSnapshot.forEach(docSnap => {
        const data = docSnap.data();
        rewardsList.push({
          id: docSnap.id,
          title: data.title || '',
          category: data.category || '',
          year: data.year || '',
          description: data.description || '',
          image: data.image || '',
          createdAt: data.createdAt ? (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString(),
          isDeleted: data.isDeleted === true
        } as Reward);
      });
      setRewards(rewardsList);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password === "spepem26") {
      const simulatedToken = "admin-session-token-spe-akamigas-2026";
      localStorage.setItem('spe_admin_token', simulatedToken);
      setToken(simulatedToken);
    } else {
      setError("Password salah!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('spe_admin_token');
    setToken(null);
    setPassword('');
  };

  // REGISTRATION ACTIONS
  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const docRef = doc(db, 'registrations', id);
      await updateDoc(docRef, { status });
      fetchAdminData();
    } catch (err) {
      console.error("Error updating registration status:", err);
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    if (!confirm("Hapus data pendaftaran ini?")) return;
    try {
      const docRef = doc(db, 'registrations', id);
      await deleteDoc(docRef);
      fetchAdminData();
    } catch (err) {
      console.error("Error deleting registration:", err);
    }
  };

  // NEWS ACTIONS
  const handleOpenNewsForm = (article?: NewsArticle) => {
    if (article) {
      setEditingArticle(article);
      setNewsFormData({
        title: article.title,
        date: article.date,
        image: article.image,
        excerpt: article.excerpt,
        fullText: article.fullText
      });
    } else {
      setEditingArticle(null);
      setNewsFormData({
        title: '',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
        excerpt: '',
        fullText: ''
      });
    }
    setShowNewsForm(true);
  };

  const handleNewsFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingArticle) {
        const docRef = doc(db, 'news', editingArticle.id);
        await updateDoc(docRef, {
          title: newsFormData.title,
          date: newsFormData.date,
          image: newsFormData.image,
          excerpt: newsFormData.excerpt,
          fullText: newsFormData.fullText
        });
      } else {
        const newsCol = collection(db, 'news');
        await addDoc(newsCol, {
          ...newsFormData,
          createdAt: Timestamp.now()
        });
      }
      setShowNewsForm(false);
      fetchAdminData();
    } catch (err) {
      console.error("Error submitting news form:", err);
      alert("Gagal menyimpan berita.");
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Hapus artikel berita ini?")) return;
    try {
      const docRef = doc(db, 'news', id);
      await deleteDoc(docRef);
      fetchAdminData();
    } catch (err) {
      console.error("Error deleting news:", err);
    }
  };

  // SLIDES ACTIONS
  const handleOpenSlidesForm = (slide?: HeroSlide) => {
    if (slide) {
      setEditingSlide(slide);
      setSlidesFormData({
        title: slide.title,
        accentTitle: slide.accentTitle || '',
        subtitle: slide.subtitle,
        description: slide.description,
        image: slide.image,
        cta1: slide.cta1 || 'About SPE',
        cta1Link: slide.cta1Link || 'about',
        cta2: slide.cta2 || '',
        cta2Link: slide.cta2Link || '',
        imageLayout: slide.imageLayout || 'background'
      });
    } else {
      setEditingSlide(null);
      setSlidesFormData({
        title: '',
        accentTitle: '',
        subtitle: '',
        description: '',
        image: '',
        cta1: 'About SPE',
        cta1Link: 'about',
        cta2: '',
        cta2Link: '',
        imageLayout: 'background'
      });
    }
    setShowSlidesForm(true);
  };

  const handleSlidesFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSlide) {
        const docRef = doc(db, 'hero_slides', editingSlide.id);
        await updateDoc(docRef, {
          title: slidesFormData.title,
          accentTitle: slidesFormData.accentTitle,
          subtitle: slidesFormData.subtitle,
          description: slidesFormData.description,
          image: slidesFormData.image,
          cta1: slidesFormData.cta1,
          cta1Link: slidesFormData.cta1Link,
          cta2: slidesFormData.cta2,
          cta2Link: slidesFormData.cta2Link,
          imageLayout: slidesFormData.imageLayout
        });
      } else {
        const slidesCol = collection(db, 'hero_slides');
        await addDoc(slidesCol, {
          ...slidesFormData,
          createdAt: Timestamp.now(),
          isDeleted: false
        });
      }
      setShowSlidesForm(false);
      setEditingSlide(null);
      fetchAdminData();
    } catch (err) {
      console.error("Error submitting hero slides form:", err);
      alert("Gagal menyimpan slide background.");
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Hapus slide background ini? Slide akan dipindahkan ke tempat sampah dan bisa dipulihkan kembali.")) return;
    try {
      const docRef = doc(db, 'hero_slides', id);
      await updateDoc(docRef, { isDeleted: true });
      fetchAdminData();
    } catch (err) {
      console.error("Error soft deleting slide:", err);
      alert("Gagal menghapus slide background.");
    }
  };

  const handleRestoreSlide = async (id: string) => {
    try {
      const docRef = doc(db, 'hero_slides', id);
      await updateDoc(docRef, { isDeleted: false });
      fetchAdminData();
    } catch (err) {
      console.error("Error restoring slide:", err);
      alert("Gagal memulihkan slide background.");
    }
  };

  const handlePermanentDeleteSlide = async (id: string) => {
    if (!confirm("Hapus slide background ini secara PERMANEN? Tindakan ini tidak dapat dibatalkan!")) return;
    try {
      const docRef = doc(db, 'hero_slides', id);
      await deleteDoc(docRef);
      fetchAdminData();
    } catch (err) {
      console.error("Error permanently deleting slide:", err);
      alert("Gagal menghapus slide secara permanen.");
    }
  };

  // REWARDS ACTIONS
  const handleOpenRewardsForm = (reward?: Reward) => {
    if (reward) {
      setEditingReward(reward);
      setRewardsFormData({
        title: reward.title,
        category: reward.category,
        year: reward.year,
        description: reward.description,
        image: reward.image
      });
    } else {
      setEditingReward(null);
      setRewardsFormData({
        title: '',
        category: '',
        year: '',
        description: '',
        image: ''
      });
    }
    setShowRewardsForm(true);
  };

  const handleRewardsFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReward) {
        const docRef = doc(db, 'rewards', editingReward.id);
        await updateDoc(docRef, {
          title: rewardsFormData.title,
          category: rewardsFormData.category,
          year: rewardsFormData.year,
          description: rewardsFormData.description,
          image: rewardsFormData.image
        });
      } else {
        const rewardsCol = collection(db, 'rewards');
        await addDoc(rewardsCol, {
          ...rewardsFormData,
          createdAt: Timestamp.now(),
          isDeleted: false
        });
      }
      setShowRewardsForm(false);
      setEditingReward(null);
      fetchAdminData();
    } catch (err) {
      console.error("Error submitting rewards form:", err);
      alert("Gagal menyimpan data reward.");
    }
  };

  const handleDeleteReward = async (id: string) => {
    if (!confirm("Hapus reward ini? Reward akan dipindahkan ke tempat sampah dan bisa dipulihkan kembali.")) return;
    try {
      const docRef = doc(db, 'rewards', id);
      await updateDoc(docRef, { isDeleted: true });
      fetchAdminData();
    } catch (err) {
      console.error("Error soft deleting reward:", err);
      alert("Gagal menghapus reward.");
    }
  };

  const handleRestoreReward = async (id: string) => {
    try {
      const docRef = doc(db, 'rewards', id);
      await updateDoc(docRef, { isDeleted: false });
      fetchAdminData();
    } catch (err) {
      console.error("Error restoring reward:", err);
      alert("Gagal memulihkan reward.");
    }
  };

  const handlePermanentDeleteReward = async (id: string) => {
    if (!confirm("Hapus reward ini secara PERMANEN? Tindakan ini tidak dapat dibatalkan!")) return;
    try {
      const docRef = doc(db, 'rewards', id);
      await deleteDoc(docRef);
      fetchAdminData();
    } catch (err) {
      console.error("Error permanently deleting reward:", err);
      alert("Gagal menghapus reward secara permanen.");
    }
  };

  // LOGIN SCREEN
  if (!token) {
    return (
      <section className="py-24 bg-slate-950 flex items-center justify-center min-h-[70vh] text-white">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-100">SPE Admin Portal</h3>
            <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider font-semibold">
              Otentikasi Pengurus Chapter
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 flex items-center gap-3 text-sm font-semibold">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
                Masukkan Password Admin
              </label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-100 text-sm font-semibold transition-all placeholder:text-slate-600"
                />
                <Key className="w-5 h-5 text-slate-600 absolute left-4 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all duration-300 shadow-xl shadow-blue-500/35 hover:-translate-y-0.5 cursor-pointer"
            >
              <Lock className="w-4.5 h-4.5" />
              Buka Dashboard Pengurus
            </button>

            {onExit && (
              <button
                type="button"
                onClick={onExit}
                className="w-full inline-flex items-center justify-center gap-2 pt-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Halaman Utama Website
              </button>
            )}
          </form>
        </div>
      </section>
    );
  }

  // MAIN DASHBOARD SCREEN
  return (
    <section className="py-24 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-8 mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Authorized Session</span>
            </div>
            <h2 className="text-3xl font-black text-slate-100 tracking-tight leading-none">
              SPE Chapter Board Dashboard
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onExit && (
              <button
                onClick={onExit}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Website
              </button>
            )}
            <button
              onClick={fetchAdminData}
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-xs transition-all shadow-lg shadow-red-500/10 cursor-pointer"
            >
              Keluar Sesi Admin
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 mb-8">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-6 py-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'registrations' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Inbox className="w-4.5 h-4.5" />
            Pendaftar Member ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-6 py-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'news' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4.5 h-4.5" />
            Kelola Berita ({news.length})
          </button>
          <button
            onClick={() => setActiveTab('backgrounds')}
            className={`px-6 py-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'backgrounds' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Image className="w-4.5 h-4.5" />
            Slide Cover ({slides.length})
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-6 py-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'rewards' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4.5 h-4.5" />
            Kelola Rewards ({rewards.length})
          </button>
        </div>

        {/* TAB 1: REGISTRATIONS */}
        {activeTab === 'registrations' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {loading ? (
              <div className="text-center py-20 text-slate-500">Memuat data pendaftar...</div>
            ) : registrations.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">Belum ada mahasiswa yang mendaftar saat ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registrations.map((reg) => (
                  <div key={reg.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-black text-blue-300 uppercase tracking-wider">
                          {reg.role}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          reg.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          reg.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {reg.status}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-100 text-lg mb-1">{reg.fullName}</h4>
                      <p className="text-slate-400 text-xs mb-4">{reg.email} | {reg.phone}</p>
                      
                      <div className="space-y-2 border-t border-slate-800 pt-4 mb-6">
                        <p className="text-xs text-slate-500"><strong className="text-slate-300">Prodi:</strong> {reg.major}</p>
                        <p className="text-xs text-slate-500"><strong className="text-slate-300">Angkatan:</strong> {reg.studyYear}</p>
                        <p className="text-xs text-slate-500 italic"><strong className="text-slate-300 not-italic">Motivasi:</strong> "{reg.motivation}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-t border-slate-800 pt-4">
                      {reg.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(reg.id, 'approved')}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer"
                        >
                          <Check className="w-4 h-4" /> Approve
                        </button>
                      )}
                      {reg.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(reg.id, 'rejected')}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all cursor-pointer"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteRegistration(reg.id)}
                        className="p-2.5 rounded-lg bg-red-600/10 hover:bg-red-600 border border-red-500/20 hover:text-white text-red-400 transition-all cursor-pointer"
                        title="Delete data"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: NEWS MANAGEMENT */}
        {activeTab === 'news' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-300">Koleksi Berita Aktif</h3>
              <button
                onClick={() => handleOpenNewsForm()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-sm transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                <Plus className="w-4.5 h-4.5" />
                Terbitkan Berita Baru
              </button>
            </div>

            {/* NEWS FORM BOX */}
            {showNewsForm && (
              <form onSubmit={handleNewsFormSubmit} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                <h4 className="text-xl font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-4">
                  <FileText className="w-5 h-5 text-blue-400" />
                  {editingArticle ? 'Edit Berita Chapter' : 'Tulis Berita Baru'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Judul Berita</label>
                    <input
                      type="text"
                      required
                      value={newsFormData.title}
                      onChange={(e) => setNewsFormData({...newsFormData, title: e.target.value})}
                      placeholder="Contoh: Sinergi Energi Bersama Pertamina"
                      className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-slate-100 text-sm font-semibold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Tanggal Berita</label>
                    <input
                      type="text"
                      required
                      value={newsFormData.date}
                      onChange={(e) => setNewsFormData({...newsFormData, date: e.target.value})}
                      placeholder="Contoh: September 24, 2025"
                      className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-slate-100 text-sm font-semibold transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Image URL (Unsplash)</label>
                  <input
                    type="url"
                    required
                    value={newsFormData.image}
                    onChange={(e) => setNewsFormData({...newsFormData, image: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-slate-100 text-sm font-semibold transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Ringkasan / Excerpt</label>
                  <textarea
                    required
                    rows={2}
                    value={newsFormData.excerpt}
                    onChange={(e) => setNewsFormData({...newsFormData, excerpt: e.target.value})}
                    placeholder="Deskripsi singkat untuk kartu berita di beranda..."
                    className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-slate-100 text-sm font-semibold transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Konten Lengkap</label>
                  <textarea
                    required
                    rows={6}
                    value={newsFormData.fullText}
                    onChange={(e) => setNewsFormData({...newsFormData, fullText: e.target.value})}
                    placeholder="Tulis lengkap isi artikel di sini..."
                    className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-slate-100 text-sm font-semibold transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 border-t border-slate-800 pt-6 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowNewsForm(false)}
                    className="px-6 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    {editingArticle ? 'Simpan Perubahan' : 'Terbitkan Sekarang'}
                  </button>
                </div>
              </form>
            )}

            {/* NEWS LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map((item) => (
                <div key={item.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
                  <img src={item.image} alt="" className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{item.date}</span>
                    <h4 className="font-extrabold text-slate-100 text-base leading-snug line-clamp-1 mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-3">{item.excerpt}</p>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenNewsForm(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-600 border border-blue-500/20 hover:text-white text-blue-400 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:text-white text-red-400 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BACKGROUNDS MANAGEMENT */}
        {activeTab === 'backgrounds' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* SECTION 1: GLOBAL WEBSITE BACKGROUND PHOTO */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <h3 className="text-xl font-black text-white">Latar Belakang Global Website</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Ganti foto background utama yang tampil di belakang seluruh halaman website (dengan lapisan gradasi biru transparan).
                  </p>
                </div>
                {bgSuccessMsg && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {bgSuccessMsg}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Current Background Preview */}
                <div className="lg:col-span-4 flex flex-col items-center text-center p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div 
                    className="w-full h-36 rounded-xl bg-cover bg-center border border-white/10 shadow-inner mb-3 relative overflow-hidden"
                    style={{ backgroundImage: `url(${currentBgImage || speHeroBg})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#020b1e]/80 to-[#133c75]/70" />
                    <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
                      <span className="text-[11px] font-extrabold text-white uppercase tracking-wider bg-slate-950/60 px-2.5 py-1 rounded-full border border-white/20">
                        Live Background Preview
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-300">Background Aktif Saat Ini</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Tampil untuk semua pengunjung guest</p>
                </div>

                {/* Controls & URL Input */}
                <div className="lg:col-span-8 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Ganti dengan URL Foto Kustom
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... atau URL gambar lainnya"
                        value={customBgInput}
                        onChange={(e) => setCustomBgInput(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm font-medium transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customBgInput.trim()) {
                            onUpdateBgImage?.(customBgInput);
                            setBgSuccessMsg('Foto background utama website berhasil diperbarui!');
                            setTimeout(() => setBgSuccessMsg(''), 4000);
                          }
                        }}
                        className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
                      >
                        Terapkan
                      </button>
                    </div>
                  </div>

                  {/* Quick Preset Selections */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Pilihan Cepat Foto Rekomendasi
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateBgImage?.(speHeroBg);
                          setBgSuccessMsg('Foto background disetel ke SPE Offshore Rig');
                          setTimeout(() => setBgSuccessMsg(''), 4000);
                        }}
                        className="p-2 rounded-xl border border-slate-800 bg-slate-950 hover:border-blue-500/60 transition-all text-left group cursor-pointer"
                      >
                        <div 
                          className="h-16 rounded-lg bg-cover bg-center mb-1.5 border border-slate-800 group-hover:scale-[1.02] transition-transform" 
                          style={{ backgroundImage: `url(${speHeroBg})` }} 
                        />
                        <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 truncate">SPE Offshore Rig</div>
                        <div className="text-[10px] text-slate-500">Default Chapter</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const url = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80';
                          onUpdateBgImage?.(url);
                          setBgSuccessMsg('Foto background disetel ke Petro Engineering');
                          setTimeout(() => setBgSuccessMsg(''), 4000);
                        }}
                        className="p-2 rounded-xl border border-slate-800 bg-slate-950 hover:border-blue-500/60 transition-all text-left group cursor-pointer"
                      >
                        <div 
                          className="h-16 rounded-lg bg-cover bg-center mb-1.5 border border-slate-800 group-hover:scale-[1.02] transition-transform" 
                          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80)' }} 
                        />
                        <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 truncate">Petro Engineering</div>
                        <div className="text-[10px] text-slate-500">Refinery & Industrial</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onUpdateBgImage?.(speLabBg);
                          setBgSuccessMsg('Foto background disetel ke Subsurface Lab');
                          setTimeout(() => setBgSuccessMsg(''), 4000);
                        }}
                        className="p-2 rounded-xl border border-slate-800 bg-slate-950 hover:border-blue-500/60 transition-all text-left group cursor-pointer col-span-2 sm:col-span-1"
                      >
                        <div 
                          className="h-16 rounded-lg bg-cover bg-center mb-1.5 border border-slate-800 group-hover:scale-[1.02] transition-transform" 
                          style={{ backgroundImage: `url(${speLabBg})` }} 
                        />
                        <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 truncate">Subsurface Lab</div>
                        <div className="text-[10px] text-slate-500">Research & Technology</div>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        onResetBgImage?.();
                        setCustomBgInput('');
                        setBgSuccessMsg('Foto background telah di-reset ke default.');
                        setTimeout(() => setBgSuccessMsg(''), 4000);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-red-400 text-xs font-bold transition-all cursor-pointer"
                    >
                      Reset Background ke Default
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: SLIDES & COVER CAROUSEL MANAGEMENT */}
            <div className="flex justify-between items-center pt-4">
              <div>
                <h3 className="text-lg font-bold text-slate-300">Slide & Background Beranda (Hero Slider)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Atur gambar carousel slider utama di bagian atas halaman depan.
                </p>
              </div>
              <button
                onClick={() => handleOpenSlidesForm()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-sm transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                <Plus className="w-4.5 h-4.5" />
                Tambah Slide Background
              </button>
            </div>

            {/* SLIDES FORM BOX */}
            {showSlidesForm && (
              <form onSubmit={handleSlidesFormSubmit} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                <h4 className="text-xl font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-4">
                  <Image className="w-5 h-5 text-blue-400" />
                  {editingSlide ? 'Edit Slide Background' : 'Tambah Slide Background Baru'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Judul Utama (Title)</label>
                    <input
                      type="text"
                      required
                      value={slidesFormData.title}
                      onChange={(e) => setSlidesFormData({...slidesFormData, title: e.target.value})}
                      placeholder="Contoh: Society of Petroleum Engineers"
                      className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-slate-100 text-sm font-semibold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Kata Kunci Warna (Accent Title, opsional)</label>
                    <input
                      type="text"
                      value={slidesFormData.accentTitle}
                      onChange={(e) => setSlidesFormData({...slidesFormData, accentTitle: e.target.value})}
                      placeholder="Kata di dalam Judul yang ingin diberi warna gradasi biru"
                      className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-slate-100 text-sm font-semibold transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Subjudul (Subtitle)</label>
                    <input
                      type="text"
                      required
                      value={slidesFormData.subtitle}
                      onChange={(e) => setSlidesFormData({...slidesFormData, subtitle: e.target.value})}
                      placeholder="Contoh: Student Chapter · PEM Akamigas"
                      className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-slate-100 text-sm font-semibold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Image URL (URL Gambar Background)</label>
                    <input
                      type="url"
                      required
                      value={slidesFormData.image}
                      onChange={(e) => setSlidesFormData({...slidesFormData, image: e.target.value})}
                      placeholder="https://images.unsplash.com/... atau link gambar lain"
                      className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-slate-100 text-sm font-semibold transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Deskripsi</label>
                  <textarea
                     required
                     rows={3}
                     value={slidesFormData.description}
                     onChange={(e) => setSlidesFormData({...slidesFormData, description: e.target.value})}
                     placeholder="Tulis deskripsi singkat yang menjelaskan slide ini..."
                     className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-slate-100 text-sm font-semibold transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Tata Letak Gambar (Slide Layout)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSlidesFormData({...slidesFormData, imageLayout: 'background'})}
                      className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        slidesFormData.imageLayout === 'background'
                          ? 'bg-blue-600/10 border-blue-500 text-blue-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1 border-current">
                        {slidesFormData.imageLayout === 'background' && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-100">Gaya Klasik (Background)</div>
                        <div className="text-xs text-slate-400 mt-1">Gambar diletakkan sebagai background penuh halaman. Teks berada di atas gambar.</div>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setSlidesFormData({...slidesFormData, imageLayout: 'split'})}
                      className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        slidesFormData.imageLayout === 'split'
                          ? 'bg-blue-600/10 border-blue-500 text-blue-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1 border-current">
                        {slidesFormData.imageLayout === 'split' && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-100">Gaya Reward (Berdampingan / Split)</div>
                        <div className="text-xs text-slate-400 mt-1">Gambar diletakkan di samping teks (atau di bawah teks pada HP). Sangat cocok untuk trophy, reward, atau dokumentasi penting.</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Tombol 1 Text</label>
                    <input
                      type="text"
                      value={slidesFormData.cta1}
                      onChange={(e) => setSlidesFormData({...slidesFormData, cta1: e.target.value})}
                      placeholder="Contoh: About SPE"
                      className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-slate-100 text-sm font-semibold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Tombol 1 Target ID</label>
                    <input
                      type="text"
                      value={slidesFormData.cta1Link}
                      onChange={(e) => setSlidesFormData({...slidesFormData, cta1Link: e.target.value})}
                      placeholder="Contoh: about"
                      className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-slate-100 text-sm font-semibold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Tombol 2 Text</label>
                    <input
                      type="text"
                      value={slidesFormData.cta2}
                      onChange={(e) => setSlidesFormData({...slidesFormData, cta2: e.target.value})}
                      placeholder="Contoh: Explore"
                      className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-slate-100 text-sm font-semibold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Tombol 2 Target ID</label>
                    <input
                      type="text"
                      value={slidesFormData.cta2Link}
                      onChange={(e) => setSlidesFormData({...slidesFormData, cta2Link: e.target.value})}
                      placeholder="Contoh: news"
                      className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-slate-100 text-sm font-semibold transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-slate-800 pt-6 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSlidesForm(false);
                      setEditingSlide(null);
                    }}
                    className="px-6 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    {editingSlide ? 'Simpan Perubahan' : 'Simpan Slide Background'}
                  </button>
                </div>
              </form>
            )}

            {/* PRESETS OR SUGGESTION IMAGES */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h4 className="font-bold text-slate-200 text-sm mb-3">Rekomendasi URL Gambar (Tinggal Copy-Paste):</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 bg-cover bg-center rounded-lg flex-shrink-0" style={{ backgroundImage: `url(${resolveImage('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80')})` }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 font-bold text-xs truncate">Rig Lepas Pantai (Kuning)</p>
                    <input type="text" readOnly value="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80" className="w-full bg-transparent text-[10px] text-slate-500 select-all outline-none truncate" />
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 bg-cover bg-center rounded-lg flex-shrink-0" style={{ backgroundImage: `url(${resolveImage('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80')})` }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 font-bold text-xs truncate">Laboratorium / Diskusi</p>
                    <input type="text" readOnly value="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80" className="w-full bg-transparent text-[10px] text-slate-500 select-all outline-none truncate" />
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 bg-cover bg-center rounded-lg flex-shrink-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?auto=format&fit=crop&w=400&q=80)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 font-bold text-xs truncate">Teknologi Kilang Minyak</p>
                    <input type="text" readOnly value="https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?auto=format&fit=crop&w=1600&q=80" className="w-full bg-transparent text-[10px] text-slate-500 select-all outline-none truncate" />
                  </div>
                </div>
              </div>
            </div>

            {/* SLIDES LIST - ACTIVE */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Slide Aktif ({slides.filter(s => !s.isDeleted).length})</h4>
              {slides.filter(s => !s.isDeleted).length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 text-slate-500 text-sm">
                  Belum ada slide background aktif. Tambah slide baru di atas!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {slides.filter(s => !s.isDeleted).map((slide, idx) => (
                    <div key={slide.id || idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between min-h-[160px]">
                      <div className="flex gap-4">
                        <img src={resolveImage(slide.image)} alt="" className="w-24 h-24 rounded-xl object-cover flex-shrink-0 bg-slate-950" />
                        <div className="min-w-0 flex-1">
                          <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wide inline-block mb-1.5">{slide.subtitle}</span>
                          <h4 className="font-extrabold text-slate-100 text-base leading-snug line-clamp-1 mb-1">
                            {slide.title}
                          </h4>
                          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-3">{slide.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-4">
                        <div className="flex gap-4 text-[10px] text-slate-500">
                          {slide.cta1 && <span>Tombol 1: <strong>{slide.cta1}</strong></span>}
                          {slide.cta2 && <span>Tombol 2: <strong>{slide.cta2}</strong></span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenSlidesForm(slide)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-600 border border-blue-500/20 hover:text-white text-blue-400 text-xs font-bold transition-all cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:text-white text-red-400 text-xs font-bold transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SLIDES LIST - DELETED / TRASH */}
            {slides.some(s => s.isDeleted) && (
              <div className="pt-8 border-t border-slate-800/80 space-y-4">
                <h4 className="text-sm font-bold text-red-400/85 uppercase tracking-wider flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-red-400" /> Tempat Sampah (Slide Terhapus)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {slides.filter(s => s.isDeleted).map((slide, idx) => (
                    <div key={slide.id || idx} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex flex-col justify-between min-h-[160px] opacity-75 hover:opacity-100 transition-opacity">
                      <div className="flex gap-4">
                        <img src={resolveImage(slide.image)} alt="" className="w-24 h-24 rounded-xl object-cover flex-shrink-0 bg-slate-950 grayscale" />
                        <div className="min-w-0 flex-1">
                          <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wide inline-block mb-1.5">{slide.subtitle}</span>
                          <h4 className="font-extrabold text-slate-400 text-base leading-snug line-clamp-1 mb-1 line-through">
                            {slide.title}
                          </h4>
                          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-3">{slide.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-850 pt-4 mt-4">
                        <div className="text-[10px] text-red-500/70 font-semibold uppercase tracking-wider">
                          Terhapus
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRestoreSlide(slide.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/20 hover:text-white text-emerald-400 text-xs font-bold transition-all cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Balikin
                          </button>
                          <button
                            onClick={() => handlePermanentDeleteSlide(slide.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-700 border border-red-500/30 hover:text-white text-red-500 text-xs font-bold transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus Permanen
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: REWARDS */}
        {activeTab === 'rewards' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* ADD/EDIT REWARD FORM */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  {editingReward ? 'Edit Data Reward' : 'Tambah Reward / Penghargaan Baru'}
                </h3>
                {editingReward && (
                  <button
                    onClick={() => {
                      setEditingReward(null);
                      setRewardsFormData({ title: '', category: '', year: '', description: '', image: '' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleRewardsFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Nama Penghargaan / Reward</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1st Place - National Smart Competition"
                      value={rewardsFormData.title}
                      onChange={(e) => setRewardsFormData({...rewardsFormData, title: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-slate-100 font-medium placeholder-slate-600 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Tahun Didapat</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2025"
                      value={rewardsFormData.year}
                      onChange={(e) => setRewardsFormData({...rewardsFormData, year: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-slate-100 font-medium placeholder-slate-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Kategori Penghargaan</label>
                    <input
                      type="text"
                      placeholder="e.g. International Award, National Competition"
                      value={rewardsFormData.category}
                      onChange={(e) => setRewardsFormData({...rewardsFormData, category: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-slate-100 font-medium placeholder-slate-600 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">URL Gambar Reward</label>
                    <input
                      type="text"
                      required
                      placeholder="URL Gambar Unsplash atau nama asset"
                      value={rewardsFormData.image}
                      onChange={(e) => setRewardsFormData({...rewardsFormData, image: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-slate-100 font-medium placeholder-slate-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Deskripsi / Detail Penghargaan</label>
                  <textarea
                     required
                     rows={4}
                     placeholder="Tuliskan kisah pencapaian, keterlibatan tim, dan dampak penghargaan ini..."
                     value={rewardsFormData.description}
                     onChange={(e) => setRewardsFormData({...rewardsFormData, description: e.target.value})}
                     className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-4 text-slate-100 font-medium placeholder-slate-600 outline-none transition-colors resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/15 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    {editingReward ? 'Simpan Perubahan Reward' : 'Tambah Reward Ke Daftar'}
                  </button>
                </div>
              </form>
            </div>

            {/* PRESETS OR SUGGESTION IMAGES FOR REWARDS */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h4 className="font-bold text-slate-200 text-sm mb-3">Rekomendasi URL Gambar Reward (Tinggal Copy-Paste):</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 bg-cover bg-center rounded-lg flex-shrink-0" style={{ backgroundImage: 'url(/assets/images/spe_reward_trophy_1782742761615.jpg)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 font-bold text-xs truncate">Outstanding Trophy (Lokal)</p>
                    <input type="text" readOnly value="spe_reward_trophy_1782742761615" className="w-full bg-transparent text-[10px] text-slate-500 select-all outline-none truncate" />
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 bg-cover bg-center rounded-lg flex-shrink-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1578269174936-2709b5a12368?auto=format&fit=crop&w=400&q=80)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 font-bold text-xs truncate">Trophy & Medal (Emas)</p>
                    <input type="text" readOnly value="https://images.unsplash.com/photo-1578269174936-2709b5a12368?auto=format&fit=crop&w=600&q=80" className="w-full bg-transparent text-[10px] text-slate-500 select-all outline-none truncate" />
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 bg-cover bg-center rounded-lg flex-shrink-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 font-bold text-xs truncate">Team Celebration</p>
                    <input type="text" readOnly value="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80" className="w-full bg-transparent text-[10px] text-slate-500 select-all outline-none truncate" />
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 bg-cover bg-center rounded-lg flex-shrink-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 font-bold text-xs truncate">Sertifikat / Medal</p>
                    <input type="text" readOnly value="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80" className="w-full bg-transparent text-[10px] text-slate-500 select-all outline-none truncate" />
                  </div>
                </div>
              </div>
            </div>

            {/* REWARDS LIST - ACTIVE */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Reward Aktif ({rewards.filter(r => !r.isDeleted).length})</h4>
              {rewards.filter(r => !r.isDeleted).length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 text-slate-500 text-sm">
                  Belum ada reward aktif. Tambah reward baru di atas!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rewards.filter(r => !r.isDeleted).map((reward, idx) => (
                    <div key={reward.id || idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between min-h-[160px]">
                      <div className="flex gap-4">
                        <img src={resolveImage(reward.image)} alt="" className="w-24 h-24 rounded-xl object-cover flex-shrink-0 bg-slate-950" />
                        <div className="min-w-0 flex-1">
                          <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wide inline-block mb-1.5">{reward.category ? `${reward.year} · ${reward.category}` : reward.year}</span>
                          <h4 className="font-extrabold text-slate-100 text-base leading-snug line-clamp-1 mb-1">
                            {reward.title}
                          </h4>
                          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-3">{reward.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end border-t border-slate-800 pt-4 mt-4 gap-2">
                        <button
                          onClick={() => handleOpenRewardsForm(reward)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-600 border border-blue-500/20 hover:text-white text-blue-400 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReward(reward.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:text-white text-red-400 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* REWARDS LIST - DELETED / TRASH */}
            {rewards.some(r => r.isDeleted) && (
              <div className="pt-8 border-t border-slate-800/80 space-y-4">
                <h4 className="text-sm font-bold text-red-400/85 uppercase tracking-wider flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-red-400" /> Tempat Sampah (Reward Terhapus)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rewards.filter(r => r.isDeleted).map((reward, idx) => (
                    <div key={reward.id || idx} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex flex-col justify-between min-h-[160px] opacity-75 hover:opacity-100 transition-opacity">
                      <div className="flex gap-4">
                        <img src={resolveImage(reward.image)} alt="" className="w-24 h-24 rounded-xl object-cover flex-shrink-0 bg-slate-950 grayscale" />
                        <div className="min-w-0 flex-1">
                          <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wide inline-block mb-1.5">{reward.category ? `${reward.year} · ${reward.category}` : reward.year}</span>
                          <h4 className="font-extrabold text-slate-400 text-base leading-snug line-clamp-1 mb-1 line-through">
                            {reward.title}
                          </h4>
                          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-3">{reward.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-850 pt-4 mt-4">
                        <div className="text-[10px] text-red-500/70 font-semibold uppercase tracking-wider">
                          Terhapus
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRestoreReward(reward.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/20 hover:text-white text-emerald-400 text-xs font-bold transition-all cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Balikin
                          </button>
                          <button
                            onClick={() => handlePermanentDeleteReward(reward.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-700 border border-red-500/30 hover:text-white text-red-500 text-xs font-bold transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus Permanen
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
