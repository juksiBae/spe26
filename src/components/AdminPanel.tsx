import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Key, 
  Lock, 
  Layers, 
  Inbox, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  FileText, 
  AlertCircle, 
  RefreshCw, 
  Image, 
  Award, 
  Trophy, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Upload, 
  Download, 
  BookOpen,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { NewsArticle, Registration, HeroSlide, Reward, SpeTriviaItem } from '../types';
import { INITIAL_TRIVIA_DOCS } from './SPETrivia';
import { downloadTriviaFile, isPdfItem } from '../utils/docxHelper';
import speHeroBg from '../assets/images/spe_hero_bg_1782489705345.jpg';
import speLabBg from '../assets/images/spe_lab_bg_1782489725520.jpg';
import speRewardTrophy from '../assets/images/spe_reward_trophy_1782742761615.jpg';
import { db, Timestamp, INITIAL_NEWS, INITIAL_SLIDES, INITIAL_REWARDS } from '../firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, setDoc, getDocs, query, orderBy } from 'firebase/firestore';

const resolveImage = (imageUrl: string) => {
  if (!imageUrl) return speHeroBg;
  if (imageUrl.includes('photo-1518709268805-4e9042af9f23')) return speHeroBg;
  if (imageUrl.includes('photo-1454165804606-c3d57bc86b40')) return speLabBg;
  if (imageUrl.includes('spe_reward_trophy_1782742761615') || imageUrl.includes('reward_trophy')) return speRewardTrophy;
  return imageUrl;
};

interface AdminPanelProps {
  onExit?: () => void;
  currentBgImage?: string;
  onUpdateBgImage?: (url: string) => void;
  onResetBgImage?: () => void;
}

interface DeleteTarget {
  type: 'news' | 'registration' | 'slide_soft' | 'slide_permanent' | 'reward_soft' | 'reward_permanent' | 'trivia';
  id: string;
  title: string;
}

export default function AdminPanel({ onExit }: AdminPanelProps) {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'registrations' | 'news' | 'backgrounds' | 'rewards' | 'trivia'>('registrations');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Custom in-app delete modal target (avoids browser confirm() which fails in sandboxed iframes)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Database lists
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [triviaList, setTriviaList] = useState<SpeTriviaItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Trivia Form state (Supports PDF & DOCX)
  const [editingTrivia, setEditingTrivia] = useState<SpeTriviaItem | null>(null);
  const [showTriviaForm, setShowTriviaForm] = useState(false);
  const [isSavingTrivia, setIsSavingTrivia] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{ 
    name: string; 
    size: string; 
    dataUrl: string;
    fileType: 'pdf' | 'docx' | 'doc';
  } | null>(null);

  const [triviaFormData, setTriviaFormData] = useState({
    title: '',
    category: 'Reservoir Engineering',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced' | 'General',
    fileType: 'pdf' as 'pdf' | 'docx' | 'doc',
    description: '',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    docxFileName: '',
    docxFileSize: '210 KB',
    docxFileUrl: '',
    questionCount: 20,
    tagsInput: 'SPE, Petroleum, Quiz',
    keyFactsInput: '',
    sampleQ1: '',
    sampleQ1Options: 'Option A, Option B, Option C, Option D',
    sampleQ1Ans: 0,
    sampleQ1Exp: ''
  });

  // News Form state
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newsFormData, setNewsFormData] = useState({
    title: '',
    date: '',
    image: '',
    excerpt: '',
    fullText: ''
  });

  // Rewards Form state
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [showRewardsForm, setShowRewardsForm] = useState(false);
  const [rewardsFormData, setRewardsFormData] = useState({
    title: '',
    category: '',
    year: '',
    description: '',
    image: ''
  });

  // Slides Form state
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

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

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
      // 1. Fetch registrations
      try {
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
      } catch (e) {
        console.warn("Could not fetch registrations:", e);
      }

      // 2. Fetch news with persistent deleted tracking
      try {
        const newsCol = collection(db, 'news');
        const qNews = query(newsCol, orderBy('createdAt', 'desc'));
        const newsSnapshot = await getDocs(qNews);
        const newsList: NewsArticle[] = [];
        const deletedIds: string[] = JSON.parse(localStorage.getItem('spe_deleted_news_ids') || '[]');

        newsSnapshot.forEach(docSnap => {
          const data = docSnap.data();
          if (!deletedIds.includes(docSnap.id) && data.isDeleted !== true) {
            newsList.push({
              id: docSnap.id,
              title: data.title,
              date: data.date,
              excerpt: data.excerpt,
              fullText: data.fullText,
              image: data.image,
              createdAt: data.createdAt ? (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString()
            } as NewsArticle);
          }
        });

        if (newsList.length > 0) {
          setNews(newsList);
        } else {
          const activeInitial = INITIAL_NEWS
            .map((n, i) => ({ id: `init-news-${i}`, ...n }))
            .filter(n => !deletedIds.includes(n.id) && !deletedIds.includes(n.title));
          setNews(activeInitial);
        }
      } catch (e) {
        console.warn("Could not fetch news, using initial news:", e);
        const deletedIds: string[] = JSON.parse(localStorage.getItem('spe_deleted_news_ids') || '[]');
        const activeInitial = INITIAL_NEWS
          .map((n, i) => ({ id: `init-news-${i}`, ...n }))
          .filter(n => !deletedIds.includes(n.id) && !deletedIds.includes(n.title));
        setNews(activeInitial);
      }

      // 3. Fetch hero slides with persistent deleted tracking
      try {
        const slidesCol = collection(db, 'hero_slides');
        const qSlides = query(slidesCol, orderBy('createdAt', 'asc'));
        const slidesSnapshot = await getDocs(qSlides);
        const slidesList: HeroSlide[] = [];
        const deletedPermanentSlideIds: string[] = JSON.parse(localStorage.getItem('spe_deleted_slide_ids') || '[]');

        slidesSnapshot.forEach(docSnap => {
          const data = docSnap.data();
          if (!deletedPermanentSlideIds.includes(docSnap.id)) {
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
              imageLayout: data.imageLayout || 'background',
              isDeleted: data.isDeleted === true,
              createdAt: data.createdAt ? (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString()
            } as HeroSlide);
          }
        });

        if (slidesList.length > 0) {
          setSlides(slidesList);
        } else {
          const activeInitialSlides = INITIAL_SLIDES
            .map((s, i) => ({ id: `init-slide-${i}`, ...s }))
            .filter(s => !deletedPermanentSlideIds.includes(s.id));
          setSlides(activeInitialSlides);
        }
      } catch (e) {
        console.warn("Could not fetch slides:", e);
        const deletedPermanentSlideIds: string[] = JSON.parse(localStorage.getItem('spe_deleted_slide_ids') || '[]');
        const activeInitialSlides = INITIAL_SLIDES
          .map((s, i) => ({ id: `init-slide-${i}`, ...s }))
          .filter(s => !deletedPermanentSlideIds.includes(s.id));
        setSlides(activeInitialSlides);
      }

      // 4. Fetch rewards with persistent deleted tracking
      try {
        const rewardsCol = collection(db, 'rewards');
        const qRewards = query(rewardsCol, orderBy('createdAt', 'desc'));
        const rewardsSnapshot = await getDocs(qRewards);
        const rewardsList: Reward[] = [];
        const deletedPermanentRewardIds: string[] = JSON.parse(localStorage.getItem('spe_deleted_reward_ids') || '[]');

        rewardsSnapshot.forEach(docSnap => {
          const data = docSnap.data();
          if (!deletedPermanentRewardIds.includes(docSnap.id)) {
            rewardsList.push({
              id: docSnap.id,
              title: data.title,
              category: data.category || '',
              year: data.year,
              description: data.description,
              image: data.image,
              isDeleted: data.isDeleted === true,
              createdAt: data.createdAt ? (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString()
            } as Reward);
          }
        });

        if (rewardsList.length > 0) {
          setRewards(rewardsList);
        } else {
          const activeInitialRewards = INITIAL_REWARDS
            .map((r, i) => ({ id: `init-reward-${i}`, ...r }))
            .filter(r => !deletedPermanentRewardIds.includes(r.id));
          setRewards(activeInitialRewards);
        }
      } catch (e) {
        console.warn("Could not fetch rewards:", e);
        const deletedPermanentRewardIds: string[] = JSON.parse(localStorage.getItem('spe_deleted_reward_ids') || '[]');
        const activeInitialRewards = INITIAL_REWARDS
          .map((r, i) => ({ id: `init-reward-${i}`, ...r }))
          .filter(r => !deletedPermanentRewardIds.includes(r.id));
        setRewards(activeInitialRewards);
      }

      // 5. Fetch SpeTrivia items with persistent deleted tracking & proper merging
      try {
        const triviaCol = collection(db, 'spetrivia');
        const qTrivia = query(triviaCol, orderBy('createdAt', 'desc'));
        const triviaSnapshot = await getDocs(qTrivia);
        const tList: SpeTriviaItem[] = [];
        const deletedTriviaIds: string[] = JSON.parse(localStorage.getItem('spe_deleted_trivia_ids') || '[]');
        const overriddenIds = new Set<string>();

        triviaSnapshot.forEach(docSnap => {
          const data = docSnap.data();
          if (!deletedTriviaIds.includes(docSnap.id) && data.isDeleted !== true) {
            overriddenIds.add(docSnap.id);
            const rawFileName = data.docxFileName || 'SPE_Trivia_Document.docx';
            const fileType = data.fileType || (rawFileName.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx');
            tList.push({
              id: docSnap.id,
              title: data.title || '',
              category: data.category || 'Reservoir Engineering',
              level: data.level || 'Beginner',
              fileType: fileType,
              description: data.description || '',
              image: data.image || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
              docxFileName: rawFileName,
              docxFileSize: data.docxFileSize || '210 KB',
              docxFileUrl: data.docxFileUrl || localStorage.getItem(`spe_trivia_file_${docSnap.id}`) || '',
              docxData: data.docxData || '',
              questionCount: data.questionCount || 20,
              tags: data.tags || [],
              keyFacts: data.keyFacts || [],
              previewQuestions: data.previewQuestions || [],
              createdAt: data.createdAt ? (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString()
            } as SpeTriviaItem);
          }
        });

        // Merge remaining initial trivia that haven't been overridden or deleted
        const remainingInitial = INITIAL_TRIVIA_DOCS.filter(t => !deletedTriviaIds.includes(t.id) && !overriddenIds.has(t.id));
        setTriviaList([...tList, ...remainingInitial]);
      } catch (e) {
        console.warn("Could not fetch spetrivia:", e);
        const deletedTriviaIds: string[] = JSON.parse(localStorage.getItem('spe_deleted_trivia_ids') || '[]');
        const activeInitialTrivia = INITIAL_TRIVIA_DOCS.filter(t => !deletedTriviaIds.includes(t.id));
        setTriviaList(activeInitialTrivia);
      }

    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'spe2026' || password === 'admin' || password === 'spe_pem_2026') {
      const generatedToken = 'spe-officer-session-' + Date.now();
      setToken(generatedToken);
      localStorage.setItem('spe_admin_token', generatedToken);
      setError(null);
    } else {
      setError('Invalid officer passkey. Please re-enter.');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('spe_admin_token');
    if (onExit) onExit();
  };

  // EXECUTOR FOR IN-APP CONFIRMATION DELETE ACTIONS
  const executeDeleteAction = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const { type, id, title } = deleteTarget;

      if (type === 'news') {
        setNews(prev => prev.filter(item => item.id !== id));
        
        const existingDeleted: string[] = JSON.parse(localStorage.getItem('spe_deleted_news_ids') || '[]');
        if (!existingDeleted.includes(id)) {
          existingDeleted.push(id);
        }
        if (title && !existingDeleted.includes(title)) {
          existingDeleted.push(title);
        }
        localStorage.setItem('spe_deleted_news_ids', JSON.stringify(existingDeleted));

        if (!id.startsWith('init-news-')) {
          try {
            await deleteDoc(doc(db, 'news', id));
          } catch (e) {
            console.warn("Could not delete from Firestore collection news:", e);
          }
        }
        showToast("News article deleted successfully.");
      }

      else if (type === 'registration') {
        setRegistrations(prev => prev.filter(r => r.id !== id));
        try {
          await deleteDoc(doc(db, 'registrations', id));
        } catch (e) {
          console.warn("Could not delete registration from Firestore:", e);
        }
        showToast("Member registration deleted.");
      }

      else if (type === 'slide_soft') {
        setSlides(prev => prev.map(s => s.id === id ? { ...s, isDeleted: true } : s));
        if (!id.startsWith('init-slide-')) {
          try {
            const docRef = doc(db, 'hero_slides', id);
            await updateDoc(docRef, { isDeleted: true });
          } catch (e) {
            console.warn("Could not soft delete hero slide:", e);
          }
        }
        showToast("Hero slide hidden (soft deleted).");
      }

      else if (type === 'slide_permanent') {
        setSlides(prev => prev.filter(s => s.id !== id));
        const deletedSlides: string[] = JSON.parse(localStorage.getItem('spe_deleted_slide_ids') || '[]');
        if (!deletedSlides.includes(id)) {
          deletedSlides.push(id);
          localStorage.setItem('spe_deleted_slide_ids', JSON.stringify(deletedSlides));
        }
        if (!id.startsWith('init-slide-')) {
          try {
            await deleteDoc(doc(db, 'hero_slides', id));
          } catch (e) {
            console.warn("Could not permanently delete hero slide:", e);
          }
        }
        showToast("Hero slide permanently removed.");
      }

      else if (type === 'reward_soft') {
        setRewards(prev => prev.map(r => r.id === id ? { ...r, isDeleted: true } : r));
        if (!id.startsWith('init-reward-')) {
          try {
            const docRef = doc(db, 'rewards', id);
            await updateDoc(docRef, { isDeleted: true });
          } catch (e) {
            console.warn("Could not soft delete reward:", e);
          }
        }
        showToast("Reward hidden (soft deleted).");
      }

      else if (type === 'reward_permanent') {
        setRewards(prev => prev.filter(r => r.id !== id));
        const deletedRewards: string[] = JSON.parse(localStorage.getItem('spe_deleted_reward_ids') || '[]');
        if (!deletedRewards.includes(id)) {
          deletedRewards.push(id);
          localStorage.setItem('spe_deleted_reward_ids', JSON.stringify(deletedRewards));
        }
        if (!id.startsWith('init-reward-')) {
          try {
            await deleteDoc(doc(db, 'rewards', id));
          } catch (e) {
            console.warn("Could not permanently delete reward:", e);
          }
        }
        showToast("Reward permanently removed.");
      }

      else if (type === 'trivia') {
        setTriviaList(prev => prev.filter(t => t.id !== id));
        const deletedTrivia: string[] = JSON.parse(localStorage.getItem('spe_deleted_trivia_ids') || '[]');
        if (!deletedTrivia.includes(id)) {
          deletedTrivia.push(id);
          localStorage.setItem('spe_deleted_trivia_ids', JSON.stringify(deletedTrivia));
        }
        try {
          localStorage.removeItem(`spe_trivia_file_${id}`);
        } catch {}
        try {
          await deleteDoc(doc(db, 'spetrivia', id));
        } catch (e) {
          console.warn("Could not delete trivia item from Firestore:", e);
        }
        showToast("SpeTrivia document deleted.");
      }

      setDeleteTarget(null);
      fetchAdminData();
    } catch (err) {
      console.error("Error executing delete action:", err);
      showToast("Failed to delete item.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // RESTORE ACTIONS
  const handleRestoreSlide = async (id: string) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, isDeleted: false } : s));
    if (!id.startsWith('init-slide-')) {
      try {
        const docRef = doc(db, 'hero_slides', id);
        await updateDoc(docRef, { isDeleted: false });
      } catch (err) {
        console.error("Error restoring slide:", err);
      }
    }
    showToast("Hero slide restored successfully.");
  };

  const handleRestoreReward = async (id: string) => {
    setRewards(prev => prev.map(r => r.id === id ? { ...r, isDeleted: false } : r));
    if (!id.startsWith('init-reward-')) {
      try {
        const docRef = doc(db, 'rewards', id);
        await updateDoc(docRef, { isDeleted: false });
      } catch (err) {
        console.error("Error restoring reward:", err);
      }
    }
    showToast("Reward restored successfully.");
  };

  // REGISTRATION STATUS UPDATE
  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try {
      const docRef = doc(db, 'registrations', id);
      await updateDoc(docRef, { status });
    } catch (err) {
      console.error("Error updating status:", err);
    }
    showToast(`Registration status updated to ${status}.`);
  };

  // SPETRIVIA ACTIONS (Supports PDF & Word Upload)
  const handleOpenTriviaForm = (item?: SpeTriviaItem) => {
    if (item) {
      setEditingTrivia(item);
      const isPdf = isPdfItem(item);
      const determinedType: 'pdf' | 'docx' = isPdf ? 'pdf' : 'docx';

      const fileUrl = item.docxFileUrl || localStorage.getItem(`spe_trivia_file_${item.id}`) || '';

      setUploadedFileInfo(fileUrl ? { 
        name: item.docxFileName || (isPdf ? 'Document.pdf' : 'Document.docx'), 
        size: item.docxFileSize || '220 KB', 
        dataUrl: fileUrl,
        fileType: determinedType
      } : null);

      setTriviaFormData({
        title: item.title,
        category: item.category,
        level: (item.level as any) || 'Beginner',
        fileType: determinedType,
        description: item.description,
        image: item.image,
        docxFileName: item.docxFileName,
        docxFileSize: item.docxFileSize || '220 KB',
        docxFileUrl: fileUrl,
        questionCount: item.questionCount || 20,
        tagsInput: (item.tags || []).join(', '),
        keyFactsInput: (item.keyFacts || []).join('\n'),
        sampleQ1: item.previewQuestions && item.previewQuestions[0] ? item.previewQuestions[0].q : '',
        sampleQ1Options: item.previewQuestions && item.previewQuestions[0] ? item.previewQuestions[0].options.join(', ') : 'Option A, Option B, Option C, Option D',
        sampleQ1Ans: item.previewQuestions && item.previewQuestions[0] ? item.previewQuestions[0].answerIdx : 0,
        sampleQ1Exp: item.previewQuestions && item.previewQuestions[0] ? item.previewQuestions[0].explanation : ''
      });
    } else {
      setEditingTrivia(null);
      setUploadedFileInfo(null);
      setTriviaFormData({
        title: '',
        category: 'Reservoir Engineering',
        level: 'Beginner',
        fileType: 'pdf',
        description: '',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        docxFileName: 'SPE_Question_Bank_2026.pdf',
        docxFileSize: '280 KB',
        docxFileUrl: '',
        questionCount: 20,
        tagsInput: 'Reservoir, Darcy, OOIP, SPE, PDF',
        keyFactsInput: '1 barrel of oil (bbl) is equal to 158.98 liters.\nDarcy law models single phase fluid flow in porous rock.',
        sampleQ1: 'What is the volumetric equivalent of 1 Barrel of Oil (bbl) in liters?',
        sampleQ1Options: '119.20 Liters, 158.98 Liters, 200.00 Liters, 240.50 Liters',
        sampleQ1Ans: 1,
        sampleQ1Exp: '1 bbl equals 42 US gallons or 158.987 liters.'
      });
    }
    setShowTriviaForm(true);
  };

  const handleTriviaFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeKb = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;
    const fileName = file.name;
    const isPdf = fileName.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    const detectedType: 'pdf' | 'docx' = isPdf ? 'pdf' : 'docx';

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedFileInfo({
        name: fileName,
        size: sizeKb,
        dataUrl,
        fileType: detectedType
      });
      setTriviaFormData(prev => ({
        ...prev,
        fileType: detectedType,
        docxFileName: fileName,
        docxFileSize: sizeKb,
        docxFileUrl: dataUrl
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleTriviaFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingTrivia(true);

    try {
      const tags = triviaFormData.tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const keyFacts = triviaFormData.keyFactsInput.split('\n').map(f => f.trim()).filter(Boolean);
      const options = triviaFormData.sampleQ1Options.split(',').map(o => o.trim()).filter(Boolean);

      const previewQuestions = triviaFormData.sampleQ1 ? [
        {
          q: triviaFormData.sampleQ1,
          options: options.length >= 2 ? options : ['Option A', 'Option B', 'Option C', 'Option D'],
          answerIdx: Number(triviaFormData.sampleQ1Ans) || 0,
          explanation: triviaFormData.sampleQ1Exp || 'Verified answer key according to SPE technical standards.'
        }
      ] : [];

      const fallbackExt = triviaFormData.fileType === 'pdf' ? '.pdf' : '.docx';
      const cleanFileName = triviaFormData.docxFileName 
        ? triviaFormData.docxFileName 
        : `SPE_${triviaFormData.title.replace(/[^a-zA-Z0-9_-]/g, '_')}${fallbackExt}`;

      const targetId = editingTrivia ? editingTrivia.id : `trivia-${Date.now()}`;

      // Cache file locally to guarantee instant download and avoid Firestore 1MB document limits
      if (triviaFormData.docxFileUrl) {
        try {
          localStorage.setItem(`spe_trivia_file_${targetId}`, triviaFormData.docxFileUrl);
        } catch (e) {
          console.warn("Could not cache file in localStorage:", e);
        }
      }

      // If base64 file data is larger than 500KB, omit from Firestore to prevent doc size limit errors
      const isLargeFile = triviaFormData.docxFileUrl && triviaFormData.docxFileUrl.length > 500000;
      const firestoreFileUrl = isLargeFile ? '' : (triviaFormData.docxFileUrl || '');

      const payload = {
        title: triviaFormData.title,
        category: triviaFormData.category,
        level: triviaFormData.level,
        fileType: triviaFormData.fileType,
        description: triviaFormData.description,
        image: triviaFormData.image,
        docxFileName: cleanFileName,
        docxFileSize: triviaFormData.docxFileSize || '240 KB',
        docxFileUrl: firestoreFileUrl,
        questionCount: Number(triviaFormData.questionCount) || 15,
        tags,
        keyFacts,
        previewQuestions,
        updatedAt: Timestamp.now(),
        createdAt: editingTrivia?.createdAt ? Timestamp.fromDate(new Date(editingTrivia.createdAt)) : Timestamp.now(),
        isDeleted: false
      };

      // Direct setDoc will succeed and persist in Firestore
      const docRef = doc(db, 'spetrivia', targetId);
      await setDoc(docRef, payload, { merge: true });

      // Optimistic local state update so the change is INSTANTANEOUS
      const updatedItem: SpeTriviaItem = {
        id: targetId,
        title: payload.title,
        category: payload.category,
        level: payload.level,
        fileType: payload.fileType,
        description: payload.description,
        image: payload.image,
        docxFileName: payload.docxFileName,
        docxFileSize: payload.docxFileSize,
        docxFileUrl: triviaFormData.docxFileUrl || '',
        questionCount: payload.questionCount,
        tags: payload.tags,
        keyFacts: payload.keyFacts,
        previewQuestions: payload.previewQuestions,
        createdAt: new Date().toISOString()
      };

      setTriviaList(prev => {
        const exists = prev.some(t => t.id === targetId);
        if (exists) {
          return prev.map(t => t.id === targetId ? updatedItem : t);
        } else {
          return [updatedItem, ...prev];
        }
      });

      setShowTriviaForm(false);
      setEditingTrivia(null);
      setUploadedFileInfo(null);
      showToast(`SpeTrivia ${triviaFormData.fileType.toUpperCase()} document saved successfully.`);
      fetchAdminData();
    } catch (err) {
      console.error("Error saving SpeTrivia item:", err);
      showToast("Failed to save SpeTrivia document.", "error");
    } finally {
      setIsSavingTrivia(false);
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
        if (editingArticle.id.startsWith('init-news-')) {
          const newsCol = collection(db, 'news');
          await addDoc(newsCol, {
            ...newsFormData,
            createdAt: Timestamp.now()
          });
        } else {
          const docRef = doc(db, 'news', editingArticle.id);
          await updateDoc(docRef, {
            title: newsFormData.title,
            date: newsFormData.date,
            image: newsFormData.image,
            excerpt: newsFormData.excerpt,
            fullText: newsFormData.fullText
          });
        }
      } else {
        const newsCol = collection(db, 'news');
        await addDoc(newsCol, {
          ...newsFormData,
          createdAt: Timestamp.now()
        });
      }
      setShowNewsForm(false);
      showToast("News article published successfully.");
      fetchAdminData();
    } catch (err) {
      console.error("Error submitting news form:", err);
      showToast("Failed to save news article.", "error");
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
      showToast("Hero slide saved successfully.");
      fetchAdminData();
    } catch (err) {
      console.error("Error submitting hero slides form:", err);
      showToast("Failed to save background slide.", "error");
    }
  };

  // REWARDS ACTIONS
  const handleOpenRewardsForm = (reward?: Reward) => {
    if (reward) {
      setEditingReward(reward);
      setRewardsFormData({
        title: reward.title,
        category: reward.category || '',
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
      showToast("Reward saved successfully.");
      fetchAdminData();
    } catch (err) {
      console.error("Error submitting rewards form:", err);
      showToast("Failed to save reward item.", "error");
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
              Chapter Officer Authentication
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                Officer Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator passkey..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl outline-none text-white text-sm font-medium transition-all"
                />
                <Key className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/50 border border-red-800/50 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Verify & Access Console</span>
            </button>
          </form>

          {onExit && (
            <button
              onClick={onExit}
              className="w-full mt-4 py-2.5 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Toast notification banner */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-2xl border shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 text-sm font-bold ${
          toastMessage.type === 'success' 
            ? 'bg-slate-900 border-emerald-500/50 text-emerald-300' 
            : 'bg-slate-900 border-red-500/50 text-red-300'
        }`}>
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800/80 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">SPE Officer Console</h1>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">PEM Akamigas Student Chapter</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
            title="Reload Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            <span>Sync</span>
          </button>
          {onExit && (
            <button
              onClick={onExit}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Public Portal</span>
            </button>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-red-600/15 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer text-xs font-bold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-slate-800/60 no-scrollbar">
        <button
          onClick={() => setActiveTab('registrations')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'registrations'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Member Registrations</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950 font-black">
            {registrations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'news'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Manage News Articles</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950 font-black">
            {news.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('trivia')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'trivia'
              ? 'bg-gradient-to-r from-[#FFEC89] to-[#7FFFD4] text-[#061826] font-black shadow-lg shadow-[#FFEC89]/20'
              : 'bg-slate-900 text-slate-400 hover:text-[#FFEC89] hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>SpeTrivia Documents (.PDF / .DOCX)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950 text-white font-black">
            {triviaList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('backgrounds')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'backgrounds'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Hero Cover Slides</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950 font-black">
            {slides.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'rewards'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Awards & Recognitions</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950 font-black">
            {rewards.length}
          </span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto">
        
        {/* TAB 1: REGISTRATIONS */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Membership Submissions</h3>
                <p className="text-slate-400 text-xs mt-0.5">Review registered PEM Akamigas students</p>
              </div>
            </div>

            {registrations.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
                <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">No registrations submitted yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {registrations.map((reg) => (
                  <div key={reg.id} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          reg.status === 'approved' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : reg.status === 'rejected'
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {reg.status || 'pending'}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(reg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-slate-100 mb-1">{reg.fullName}</h4>
                      <p className="text-xs text-blue-400 font-semibold mb-3">{reg.major} · {reg.studyYear}</p>
                      
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1 mb-4">
                        <p><strong>Email:</strong> {reg.email}</p>
                        <p><strong>Phone:</strong> {reg.phone}</p>
                        <p><strong>Role:</strong> {reg.role}</p>
                        {reg.motivation && <p className="pt-1 text-slate-400 italic line-clamp-2">"{reg.motivation}"</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => handleUpdateStatus(reg.id, 'approved')}
                        className="flex-1 py-2 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(reg.id, 'rejected')}
                        className="flex-1 py-2 bg-amber-600/20 hover:bg-amber-600 border border-amber-500/30 text-amber-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: 'registration', id: reg.id, title: reg.fullName })}
                        className="p-2 bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                        title="Delete registration"
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

        {/* TAB 2: NEWS */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Published News & Announcements</h3>
                <p className="text-slate-400 text-xs mt-0.5">Manage articles published on the official homepage</p>
              </div>
              <button
                onClick={() => handleOpenNewsForm()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Article</span>
              </button>
            </div>

            {news.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
                <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">No news articles currently published.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all p-5">
                    <div>
                      <div className="h-44 rounded-2xl overflow-hidden bg-slate-950 mb-4 border border-slate-800">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">
                        {item.date}
                      </span>
                      <h4 className="font-extrabold text-slate-100 text-base mb-2 line-clamp-2">{item.title}</h4>
                      <p className="text-slate-400 text-xs line-clamp-3 mb-4 leading-relaxed">{item.excerpt}</p>
                    </div>

                    <div className="flex items-center gap-2 border-t border-slate-800 pt-4">
                      <button
                        onClick={() => handleOpenNewsForm(item)}
                        className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: 'news', id: item.id, title: item.title })}
                        className="py-2 px-3 rounded-xl bg-red-600/10 hover:bg-red-600 border border-red-500/20 text-red-400 hover:text-white font-bold text-xs transition-all cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SPETRIVIA (PDF & DOCX) */}
        {activeTab === 'trivia' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FFEC89]" />
                  <span>SpeTrivia Knowledge Bank Modules</span>
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Upload, edit, and distribute verified Adobe PDF (<code className="text-rose-400 font-mono">.pdf</code>) and Microsoft Word (<code className="text-[#FFEC89] font-mono">.docx</code>) study files
                </p>
              </div>
              <button
                onClick={() => handleOpenTriviaForm()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFEC89] to-[#7FFFD4] text-[#061826] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FFEC89]/20 hover:brightness-110 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Upload PDF / DOCX</span>
              </button>
            </div>

            {triviaList.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
                <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">No trivia documents found in database.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {triviaList.map((item) => {
                  const isPdf = isPdfItem(item);
                  const formatLabel = isPdf ? 'PDF' : 'DOCX';

                  return (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-[#FFEC89]/40 transition-all p-5 shadow-xl">
                      <div>
                        <div className="h-44 rounded-2xl overflow-hidden bg-slate-950 mb-4 border border-slate-800 relative">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          <div className={`absolute top-3 right-3 py-1 px-2.5 rounded-lg text-[10px] font-black text-white uppercase tracking-wider shadow-md flex items-center gap-1 ${
                            isPdf 
                              ? 'bg-rose-600 shadow-rose-900/40 border border-rose-400/40' 
                              : 'bg-[#0056b3] shadow-blue-900/40 border border-blue-400/40'
                          }`}>
                            <FileText className="w-3 h-3" />
                            <span>.{formatLabel}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-black uppercase text-[#FFEC89] tracking-wider">
                            {item.category}
                          </span>
                          <span className="text-[10px] font-bold text-[#7FFFD4]">
                            {item.level || 'Intermediate'}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-slate-100 text-base mb-2 line-clamp-2">{item.title}</h4>
                        <p className="text-slate-400 text-xs line-clamp-3 mb-4 leading-relaxed">{item.description}</p>
                        
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between mb-6">
                          <span className="font-mono text-slate-300 font-bold truncate max-w-[160px]">
                            {item.docxFileName || `Document.${formatLabel.toLowerCase()}`}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            isPdf ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
                          }`}>
                            {item.docxFileSize || '220 KB'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 border-t border-slate-800 pt-4">
                        <button
                          onClick={() => downloadTriviaFile(item)}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                            isPdf
                              ? 'bg-rose-600/20 hover:bg-rose-600 border-rose-500/30 text-rose-300 hover:text-white'
                              : 'bg-blue-600/20 hover:bg-blue-600 border-blue-500/30 text-blue-300 hover:text-white'
                          }`}
                          title={`Download ${formatLabel} File`}
                        >
                          <Download className="w-3.5 h-3.5" /> Download .{formatLabel}
                        </button>
                        <button
                          onClick={() => handleOpenTriviaForm(item)}
                          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all cursor-pointer"
                          title="Edit Document"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: 'trivia', id: item.id, title: item.title })}
                          className="p-2.5 rounded-xl bg-red-600/10 hover:bg-red-600 border border-red-500/20 text-red-400 hover:text-white transition-all cursor-pointer"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: HERO SLIDES */}
        {activeTab === 'backgrounds' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Hero Header Slides</h3>
                <p className="text-slate-400 text-xs mt-0.5">Configure banners and covers on the landing page</p>
              </div>
              <button
                onClick={() => handleOpenSlidesForm()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hero Slide</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {slides.map((slide) => {
                const isSoftDeleted = slide.isDeleted === true;
                return (
                  <div key={slide.id} className={`bg-slate-900 border rounded-3xl p-6 transition-all relative ${
                    isSoftDeleted ? 'border-red-900/50 opacity-60' : 'border-slate-800 hover:border-slate-700'
                  }`}>
                    <div className="h-44 rounded-2xl overflow-hidden bg-slate-950 mb-4 border border-slate-800 relative">
                      <img src={resolveImage(slide.image)} alt={slide.title} className="w-full h-full object-cover" />
                      {isSoftDeleted && (
                        <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center font-bold text-red-400 text-xs uppercase tracking-wider">
                          Hidden / Soft-Deleted
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block mb-1">{slide.subtitle}</span>
                    <h4 className="text-lg font-black text-white mb-2">{slide.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-6 leading-relaxed">{slide.description}</p>

                    <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                      <button
                        onClick={() => handleOpenSlidesForm(slide)}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      
                      {isSoftDeleted ? (
                        <button
                          onClick={() => handleRestoreSlide(slide.id)}
                          className="py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          title="Restore Slide"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => setDeleteTarget({ type: 'slide_soft', id: slide.id, title: slide.title })}
                          className="py-2 px-3 bg-amber-600/10 hover:bg-amber-600 border border-amber-500/20 text-amber-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                          title="Hide Slide (Soft Delete)"
                        >
                          Hide
                        </button>
                      )}

                      <button
                        onClick={() => setDeleteTarget({ type: 'slide_permanent', id: slide.id, title: slide.title })}
                        className="py-2 px-3 bg-red-600/10 hover:bg-red-600 border border-red-500/20 text-red-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                        title="Permanent Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: REWARDS */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Awards & Recognitions</h3>
                <p className="text-slate-400 text-xs mt-0.5">Manage historical trophies and accolades</p>
              </div>
              <button
                onClick={() => handleOpenRewardsForm()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Award</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const isSoftDeleted = reward.isDeleted === true;
                return (
                  <div key={reward.id} className={`bg-slate-900 border rounded-3xl p-5 flex flex-col justify-between transition-all ${
                    isSoftDeleted ? 'border-red-900/50 opacity-60' : 'border-slate-800 hover:border-slate-700'
                  }`}>
                    <div>
                      <div className="h-44 rounded-2xl overflow-hidden bg-slate-950 mb-4 border border-slate-800 relative">
                        <img src={resolveImage(reward.image)} alt={reward.title} className="w-full h-full object-cover" />
                        {isSoftDeleted && (
                          <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center font-bold text-red-400 text-xs uppercase tracking-wider">
                            Hidden / Soft-Deleted
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                          {reward.category || 'SPE Award'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">{reward.year}</span>
                      </div>
                      <h4 className="font-extrabold text-white text-base mb-2">{reward.title}</h4>
                      <p className="text-slate-400 text-xs line-clamp-3 mb-4 leading-relaxed">{reward.description}</p>
                    </div>

                    <div className="flex items-center gap-2 border-t border-slate-800 pt-4">
                      <button
                        onClick={() => handleOpenRewardsForm(reward)}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>

                      {isSoftDeleted ? (
                        <button
                          onClick={() => handleRestoreReward(reward.id)}
                          className="py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          title="Restore Reward"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => setDeleteTarget({ type: 'reward_soft', id: reward.id, title: reward.title })}
                          className="py-2 px-3 bg-amber-600/10 hover:bg-amber-600 border border-amber-500/20 text-amber-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                          title="Hide Reward"
                        >
                          Hide
                        </button>
                      )}

                      <button
                        onClick={() => setDeleteTarget({ type: 'reward_permanent', id: reward.id, title: reward.title })}
                        className="py-2 px-3 bg-red-600/10 hover:bg-red-600 border border-red-500/20 text-red-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                        title="Permanent Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* CUSTOM IN-APP DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 animate-bounce" />
            </div>

            <h3 className="text-xl font-bold text-white text-center mb-2">
              Confirm Delete
            </h3>
            
            <p className="text-slate-300 text-sm text-center mb-6 leading-relaxed">
              Are you sure you want to delete <strong className="text-white font-bold">"{deleteTarget.title}"</strong>?
              {deleteTarget.type.includes('permanent') && (
                <span className="block text-red-400 text-xs mt-2 font-semibold">
                  ⚠️ This action is permanent and cannot be undone!
                </span>
              )}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={executeDeleteAction}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-red-600/30 cursor-pointer flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{isDeleting ? "Deleting..." : "Yes, Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL: NEWS */}
      {showNewsForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-100">
                {editingArticle ? 'Edit News Article' : 'Publish New Article'}
              </h3>
              <button onClick={() => setShowNewsForm(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleNewsFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Headline Title</label>
                <input
                  type="text"
                  required
                  value={newsFormData.title}
                  onChange={(e) => setNewsFormData({ ...newsFormData, title: e.target.value })}
                  placeholder="e.g. PEM Akamigas Wins Regional Petroleum Competition"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={newsFormData.date}
                    onChange={(e) => setNewsFormData({ ...newsFormData, date: e.target.value })}
                    placeholder="e.g. October 15, 2025"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={newsFormData.image}
                    onChange={(e) => setNewsFormData({ ...newsFormData, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Short Excerpt</label>
                <textarea
                  rows={2}
                  required
                  value={newsFormData.excerpt}
                  onChange={(e) => setNewsFormData({ ...newsFormData, excerpt: e.target.value })}
                  placeholder="Brief summary for feed cards..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Full Article Body</label>
                <textarea
                  rows={5}
                  required
                  value={newsFormData.fullText}
                  onChange={(e) => setNewsFormData({ ...newsFormData, fullText: e.target.value })}
                  placeholder="Full narrative text of the story..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewsForm(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/20"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL: SPETRIVIA (PDF & DOCX) */}
      {showTriviaForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFEC89]" />
                {editingTrivia ? 'Edit SpeTrivia Document' : 'Upload SpeTrivia Document (.PDF / .DOCX)'}
              </h3>
              <button onClick={() => setShowTriviaForm(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleTriviaFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={triviaFormData.title}
                  onChange={(e) => setTriviaFormData({ ...triviaFormData, title: e.target.value })}
                  placeholder="e.g. Reservoir Engineering & Volumetrics Question Bank"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                />
              </div>

              {/* Format selection pills */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Document Format</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTriviaFormData({ ...triviaFormData, fileType: 'pdf' })}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      triviaFormData.fileType === 'pdf'
                        ? 'bg-rose-600/30 border-rose-500 text-rose-300 ring-2 ring-rose-500/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-rose-400" />
                    <span>Adobe PDF (.PDF)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTriviaFormData({ ...triviaFormData, fileType: 'docx' })}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      triviaFormData.fileType === 'docx'
                        ? 'bg-blue-600/30 border-blue-500 text-blue-300 ring-2 ring-blue-500/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>Microsoft Word (.DOCX)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Category / Domain</label>
                  <select
                    value={triviaFormData.category}
                    onChange={(e) => setTriviaFormData({ ...triviaFormData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                  >
                    <option value="Reservoir Engineering">Reservoir Engineering</option>
                    <option value="Drilling & Wells">Drilling & Wells</option>
                    <option value="Production & CCUS">Production & CCUS</option>
                    <option value="SPE History">SPE History</option>
                    <option value="HSE & Offshore">HSE & Offshore</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Difficulty Level</label>
                  <select
                    value={triviaFormData.level}
                    onChange={(e) => setTriviaFormData({ ...triviaFormData, level: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              {/* Upload File Input (Supports PDF and DOCX) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-dashed border-blue-500/40">
                <label className="block text-xs font-black uppercase text-blue-400 tracking-wider mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload Study File (.PDF or .DOCX)
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                  onChange={handleTriviaFileInputChange}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
                {uploadedFileInfo && (
                  <div className="mt-3 p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate max-w-[240px]">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        uploadedFileInfo.fileType === 'pdf' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}>
                        .{uploadedFileInfo.fileType.toUpperCase()}
                      </span>
                      <span className="text-emerald-400 font-bold truncate">✓ {uploadedFileInfo.name}</span>
                    </div>
                    <span className="text-slate-400 font-mono">{uploadedFileInfo.size}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={triviaFormData.image}
                  onChange={(e) => setTriviaFormData({ ...triviaFormData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Module Description</label>
                <textarea
                  rows={3}
                  required
                  value={triviaFormData.description}
                  onChange={(e) => setTriviaFormData({ ...triviaFormData, description: e.target.value })}
                  placeholder="Summary of topics covered..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Key Facts (one per line)</label>
                <textarea
                  rows={2}
                  value={triviaFormData.keyFactsInput}
                  onChange={(e) => setTriviaFormData({ ...triviaFormData, keyFactsInput: e.target.value })}
                  placeholder="1 bbl equals 158.98 liters&#10;Darcy law governs fluid flow"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-black uppercase text-[#FFEC89] tracking-wider block">Sample Question Preview</span>
                <input
                  type="text"
                  value={triviaFormData.sampleQ1}
                  onChange={(e) => setTriviaFormData({ ...triviaFormData, sampleQ1: e.target.value })}
                  placeholder="e.g. What is 1 bbl in liters?"
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
                <input
                  type="text"
                  value={triviaFormData.sampleQ1Options}
                  onChange={(e) => setTriviaFormData({ ...triviaFormData, sampleQ1Options: e.target.value })}
                  placeholder="Option A, Option B, Option C, Option D"
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={triviaFormData.sampleQ1Ans}
                    onChange={(e) => setTriviaFormData({ ...triviaFormData, sampleQ1Ans: Number(e.target.value) })}
                    placeholder="Correct Index (0-3)"
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                  <input
                    type="text"
                    value={triviaFormData.sampleQ1Exp}
                    onChange={(e) => setTriviaFormData({ ...triviaFormData, sampleQ1Exp: e.target.value })}
                    placeholder="Explanation..."
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  disabled={isSavingTrivia}
                  onClick={() => setShowTriviaForm(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingTrivia}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFEC89] to-[#7FFFD4] text-[#061826] text-sm font-black uppercase tracking-wider shadow-lg hover:brightness-110 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingTrivia ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Document...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Document</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL: SLIDES */}
      {showSlidesForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-100">
                {editingSlide ? 'Edit Hero Slide' : 'Add Hero Slide'}
              </h3>
              <button onClick={() => setShowSlidesForm(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSlidesFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Slide Title</label>
                <input
                  type="text"
                  required
                  value={slidesFormData.title}
                  onChange={(e) => setSlidesFormData({ ...slidesFormData, title: e.target.value })}
                  placeholder="e.g. Society of Petroleum Engineers"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Subtitle / Badge</label>
                <input
                  type="text"
                  value={slidesFormData.subtitle}
                  onChange={(e) => setSlidesFormData({ ...slidesFormData, subtitle: e.target.value })}
                  placeholder="e.g. Student Chapter · PEM Akamigas"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Background Image URL</label>
                <input
                  type="url"
                  value={slidesFormData.image}
                  onChange={(e) => setSlidesFormData({ ...slidesFormData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Slide Description</label>
                <textarea
                  rows={3}
                  required
                  value={slidesFormData.description}
                  onChange={(e) => setSlidesFormData({ ...slidesFormData, description: e.target.value })}
                  placeholder="Narrative text on hero header..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSlidesForm(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/20"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL: REWARDS */}
      {showRewardsForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-100">
                {editingReward ? 'Edit Reward' : 'Add Reward'}
              </h3>
              <button onClick={() => setShowRewardsForm(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleRewardsFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Award Title</label>
                <input
                  type="text"
                  required
                  value={rewardsFormData.title}
                  onChange={(e) => setRewardsFormData({ ...rewardsFormData, title: e.target.value })}
                  placeholder="e.g. Outstanding Student Chapter Award"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={rewardsFormData.category}
                    onChange={(e) => setRewardsFormData({ ...rewardsFormData, category: e.target.value })}
                    placeholder="e.g. SPE International Award"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Year</label>
                  <input
                    type="text"
                    required
                    value={rewardsFormData.year}
                    onChange={(e) => setRewardsFormData({ ...rewardsFormData, year: e.target.value })}
                    placeholder="e.g. 2025"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Image URL</label>
                <input
                  type="text"
                  value={rewardsFormData.image}
                  onChange={(e) => setRewardsFormData({ ...rewardsFormData, image: e.target.value })}
                  placeholder="https://... or spe_reward_trophy_1782742761615"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={rewardsFormData.description}
                  onChange={(e) => setRewardsFormData({ ...rewardsFormData, description: e.target.value })}
                  placeholder="Details regarding the achievement..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRewardsForm(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/20"
                >
                  Save Reward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
