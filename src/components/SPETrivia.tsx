import React, { useState, useEffect, useRef } from 'react';
import { 
  FileDown, 
  Download, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles, 
  RefreshCw, 
  BookOpen, 
  FileText, 
  Check, 
  Layers, 
  Flame, 
  Award,
  Zap,
  ExternalLink,
  FileType
} from 'lucide-react';
import { SpeTriviaItem } from '../types';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { downloadTriviaFile, isPdfItem } from '../utils/docxHelper';

export const INITIAL_TRIVIA_DOCS: SpeTriviaItem[] = [
  {
    id: 'trivia-1',
    title: 'History & Foundations of Society of Petroleum Engineers (SPE Global)',
    category: 'SPE History',
    level: 'Beginner',
    fileType: 'docx',
    description: 'A comprehensive question bank detailing the founding history of SPE from AIME in 1957, global membership structure, and the role of Student Chapters in the modern energy industry.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    docxFileName: 'SPE_History_Foundation_Trivia_2025.docx',
    docxFileSize: '148 KB',
    questionCount: 20,
    tags: ['SPE Global', 'History', 'AIME', 'Student Chapter'],
    keyFacts: [
      'SPE was officially founded as an independent organization in 1957 and currently serves over 140,000 members across 144+ countries.',
      'OnePetro is the largest digital technical library in the energy sector with over 200,000 peer-reviewed papers.'
    ],
    previewQuestions: [
      {
        q: 'In what year was SPE officially established as an independent professional society from AIME?',
        options: ['1957', '1973', '1985', '1991'],
        answerIdx: 0,
        explanation: 'SPE was officially established in 1957 and has grown into the leading global individual-member organization serving the upstream and energy industries.'
      },
      {
        q: 'What is the primary digital technical library managed by SPE?',
        options: ['ScienceDirect', 'OnePetro', 'IEEE Xplore', 'PetroWiki'],
        answerIdx: 1,
        explanation: 'OnePetro is the multi-society repository containing hundreds of thousands of papers covering upstream and downstream petroleum engineering.'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'trivia-2',
    title: 'Fundamentals of Reservoir Engineering & Volumetrics (OOIP & bbl)',
    category: 'Reservoir Engineering',
    level: 'Intermediate',
    fileType: 'pdf',
    description: 'Technical study handbook covering Original Oil In Place (OOIP) estimation, barrel conversions, rock porosity, effective permeability, and fluid saturation.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    docxFileName: 'Reservoir_OOIP_Volumetrics_Handbook.pdf',
    docxFileSize: '345 KB',
    questionCount: 25,
    tags: ['Reservoir', 'OOIP', 'Permeability', 'Porosity', 'PDF'],
    keyFacts: [
      '1 barrel of crude oil (bbl) is equivalent to exactly 42 US gallons or 158.987 liters.',
      "Darcy's Law serves as the governing equation for single-phase fluid flow through porous rock media."
    ],
    previewQuestions: [
      {
        q: 'What is the volumetric equivalent of 1 Barrel of Oil (bbl) in liters?',
        options: ['119.20 Liters', '158.98 Liters', '200.00 Liters', '240.50 Liters'],
        answerIdx: 1,
        explanation: '1 barrel (bbl) equals 42 US gallons or exactly 158.987 liters of petroleum liquid.'
      },
      {
        q: 'Which physical law describes laminar fluid flow through porous rock media?',
        options: ["Pascal's Law", "Darcy's Law", "Bernoulli's Principle", "Hooke's Law"],
        answerIdx: 1,
        explanation: "Darcy's Law (Henry Darcy, 1856) mathematically models laminar fluid flow through porous rock based on permeability and pressure gradients."
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'trivia-3',
    title: 'Drilling Operations, Well Control & Blowout Preventer (BOP Stack)',
    category: 'Drilling & Wells',
    level: 'Intermediate',
    fileType: 'docx',
    description: 'A curated technical quiz on drilling rig systems, drilling mud rheology, well control procedures, Christmas Trees, and BOP shearing mechanisms.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    docxFileName: 'Drilling_BOP_WellControl_Trivia.docx',
    docxFileSize: '310 KB',
    questionCount: 30,
    tags: ['Drilling', 'BOP', 'Well Control', 'Rig Safety'],
    keyFacts: [
      'A Blowout Preventer (BOP) features Blind Shear Rams designed to cut through drill pipe in emergency blowout scenarios.',
      'Drilling fluids provide hydrostatic pressure to contain formation pore pressure and prevent influxes (kicks).'
    ],
    previewQuestions: [
      {
        q: 'Which assembly of valves and chokes controls surface production flow after the drilling rig moves off?',
        options: ['Rotary Table', 'Christmas Tree', 'Kelly Bushing', 'Mud Cleaner'],
        answerIdx: 1,
        explanation: 'A Christmas Tree is the valve and manifold assembly installed on the wellhead to control fluid production from the subsurface reservoir.'
      },
      {
        q: 'Which type of BOP ram is specifically designed to shear drill pipe and seal the wellbore completely?',
        options: ['Pipe Ram', 'Blind Shear Ram', 'Annular Preventer', 'Variable Bore Ram'],
        answerIdx: 1,
        explanation: 'Blind Shear Rams have hardened steel cutting blades that sever the drillstring and hermetically seal the open wellbore.'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'trivia-4',
    title: 'Enhanced Oil Recovery (EOR) & CCUS Decarbonization Innovations',
    category: 'Production & CCUS',
    level: 'Advanced',
    fileType: 'pdf',
    description: 'Technical paper and case quiz on thermal EOR, polymer/surfactant flooding, supercritical CO2 miscible injection, and Carbon Capture, Utilization, and Storage (CCUS).',
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    docxFileName: 'EOR_CCUS_Decarbonization_Report.pdf',
    docxFileSize: '412 KB',
    questionCount: 22,
    tags: ['EOR', 'CCUS', 'Decarbonization', 'CO2 Injection', 'PDF'],
    keyFacts: [
      'EOR methods can recover up to 60% of original oil in place after primary and secondary recovery phases are complete.',
      'Supercritical CO2 injection acts as a miscible solvent to reduce residual oil saturation while permanently sequestering carbon underground.'
    ],
    previewQuestions: [
      {
        q: 'At which stage in a reservoir lifecycle is Enhanced Oil Recovery (EOR) typically implemented?',
        options: ['Early Exploration Phase', 'Tertiary Recovery (after waterflooding)', 'Spud In Drilling', 'P&A Well Abandonment'],
        answerIdx: 1,
        explanation: 'EOR represents tertiary recovery implemented after primary natural depletion and secondary pressure maintenance (waterflooding).'
      },
      {
        q: 'What state of CO2 is primarily used in miscible gas injection for optimal displacement efficiency?',
        options: ['Subcooled Liquid', 'Supercritical Fluid', 'Dry Ice Solid', 'Low Pressure Gas'],
        answerIdx: 1,
        explanation: 'Supercritical CO2 exhibits high density like a liquid with low viscosity like a gas, effectively mixing with reservoir oil above minimum miscibility pressure.'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'trivia-5',
    title: 'HSE Management, Offshore Safety & Environmental Stewardship',
    category: 'HSE & Offshore',
    level: 'General',
    fileType: 'docx',
    description: 'Comprehensive guidelines covering Process Safety Management (PSM), offshore platform emergency protocols, marine conservation, and net-zero sustainability.',
    image: 'https://images.unsplash.com/photo-1591025207163-942350e47db2?auto=format&fit=crop&w=800&q=80',
    docxFileName: 'HSE_Offshore_Safety_Standards_Trivia.docx',
    docxFileSize: '190 KB',
    questionCount: 18,
    tags: ['HSE', 'Process Safety', 'Offshore', 'Sustainability'],
    keyFacts: [
      'The ALARP principle (As Low As Reasonably Practicable) is a cornerstone of safety risk assessment in energy operations.',
      'SPE fosters environmental stewardship through community conservation initiatives such as mangrove restoration and marine biodiversity protection.'
    ],
    previewQuestions: [
      {
        q: 'What does the safety acronym ALARP stand for in petroleum risk management?',
        options: [
          'As Long As Risk Persists',
          'As Low As Reasonably Practicable',
          'Automatic Level And Rate Protection',
          'Advanced Liquid Analysis Rate Protocol'
        ],
        answerIdx: 1,
        explanation: 'ALARP stands for As Low As Reasonably Practicable, denoting that risk must be reduced until the cost of further reduction is disproportionate to the benefit.'
      }
    ],
    createdAt: new Date().toISOString()
  }
];

export default function SPETrivia() {
  const [triviaList, setTriviaList] = useState<SpeTriviaItem[]>(INITIAL_TRIVIA_DOCS);
  const [selectedTrivia, setSelectedTrivia] = useState<SpeTriviaItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeFormat, setActiveFormat] = useState<'All' | 'PDF' | 'DOCX'>('All');
  const [downloadSuccessItem, setDownloadSuccessItem] = useState<string | null>(null);

  // Interactive Quiz State inside Reader Modal
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Smooth Carousel / Runner references
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startX = useRef<number>(0);
  const scrollLeftStart = useRef<number>(0);
  const dragDistance = useRef<number>(0);

  // Fetch from Firestore
  const fetchTriviaDocs = async () => {
    setLoading(true);
    try {
      const deletedTriviaIds: string[] = JSON.parse(localStorage.getItem('spe_deleted_trivia_ids') || '[]');
      const triviaCol = collection(db, 'spetrivia');
      const qTrivia = query(triviaCol, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(qTrivia);
      const items: SpeTriviaItem[] = [];
      const overriddenIds = new Set<string>();
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (!deletedTriviaIds.includes(docSnap.id) && data.isDeleted !== true) {
          overriddenIds.add(docSnap.id);
          const rawFileName = data.docxFileName || 'SPE_Trivia_Document.docx';
          const fileType = data.fileType || (rawFileName.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx');
          items.push({
            id: docSnap.id,
            title: data.title || '',
            category: data.category || 'General',
            level: data.level || 'Beginner',
            fileType: fileType,
            description: data.description || '',
            image: data.image || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
            docxFileName: rawFileName,
            docxFileSize: data.docxFileSize || '220 KB',
            docxFileUrl: data.docxFileUrl || localStorage.getItem(`spe_trivia_file_${docSnap.id}`) || '',
            docxData: data.docxData || '',
            questionCount: data.questionCount || 20,
            tags: data.tags || ['SPE', 'Trivia'],
            keyFacts: data.keyFacts || [],
            previewQuestions: data.previewQuestions || [],
            createdAt: data.createdAt ? (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString(),
            isDeleted: data.isDeleted === true
          } as SpeTriviaItem);
        }
      });
      const remainingInitial = INITIAL_TRIVIA_DOCS.filter(item => !deletedTriviaIds.includes(item.id) && !overriddenIds.has(item.id));
      setTriviaList([...items, ...remainingInitial]);
    } catch (err) {
      console.warn("Could not fetch spetrivia, using initial items:", err);
      const deletedTriviaIds: string[] = JSON.parse(localStorage.getItem('spe_deleted_trivia_ids') || '[]');
      setTriviaList(INITIAL_TRIVIA_DOCS.filter(item => !deletedTriviaIds.includes(item.id)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTriviaDocs();
  }, []);

  // Filter Categories
  const categories = ['All', 'Reservoir Engineering', 'Drilling & Wells', 'Production & CCUS', 'SPE History', 'HSE & Offshore'];

  const filteredTrivia = triviaList.filter(item => {
    const norm = (str?: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const itemCat = norm(item.category);
    const activeCat = norm(activeCategory);

    const matchesCategory = activeCategory === 'All'
      ? true
      : itemCat === activeCat ||
        itemCat.includes(activeCat) ||
        activeCat.includes(itemCat) ||
        (activeCategory.includes('History') && (item.category.toLowerCase().includes('history') || item.title.toLowerCase().includes('history'))) ||
        (activeCategory.includes('HSE') && (item.category.toLowerCase().includes('hse') || item.title.toLowerCase().includes('hse') || item.category.toLowerCase().includes('offshore')));

    const isPdf = isPdfItem(item);
    const matchesFormat = activeFormat === 'All' 
      ? true 
      : activeFormat === 'PDF' ? isPdf : !isPdf;

    return matchesCategory && matchesFormat;
  });

  // When activeCategory or activeFormat changes, reset carousel position to 0 smoothly
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'instant' });
    }
  }, [activeCategory, activeFormat]);

  // Only use infinite duplication when viewing "All" with 4 or more cards.
  // When viewing filtered categories (1-3 cards), NEVER duplicate or snap-loop, eliminating flickering entirely.
  const isInfiniteCarousel = activeCategory === 'All' && activeFormat === 'All' && filteredTrivia.length >= 4;
  const displayItems = isInfiniteCarousel ? [...filteredTrivia, ...filteredTrivia] : filteredTrivia;

  // Carousel smooth auto-scroll only for the broad infinite view
  useEffect(() => {
    if (!isInfiniteCarousel || loading || selectedTrivia || isHovered || isDragging) {
      return;
    }

    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 1;
      }
    }, 28);

    return () => clearInterval(interval);
  }, [isInfiniteCarousel, loading, selectedTrivia, isHovered, isDragging]);

  // Handle snap loop safely without jitter
  const handleScrollEvent = () => {
    if (!scrollRef.current || !isInfiniteCarousel) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    // Safety guard: only execute snap if container overflows at least 2.2x the screen width
    if (scrollWidth <= clientWidth * 2.2) return;
    const halfWidth = scrollWidth / 2;

    if (scrollLeft >= scrollWidth - clientWidth - 5) {
      scrollRef.current.scrollLeft = scrollLeft - halfWidth;
    } else if (scrollLeft <= 0) {
      scrollRef.current.scrollLeft = halfWidth;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setIsHovered(true);
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
    dragDistance.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    dragDistance.current = Math.abs(x - startX.current);
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleCardClick = (item: SpeTriviaItem) => {
    if (dragDistance.current > 8) return;
    setSelectedTrivia(item);
    setUserAnswers({});
    setQuizSubmitted(false);
  };

  const handleDownloadClick = (e: React.MouseEvent, item: SpeTriviaItem) => {
    e.stopPropagation();
    downloadTriviaFile(item);
    setDownloadSuccessItem(item.id);
    setTimeout(() => {
      setDownloadSuccessItem(null);
    }, 3000);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 380;
      const gap = 24;
      const scrollAmount = direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap);
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="trivia" 
      className="py-24 bg-[#061826]/95 relative overflow-hidden border-b border-[#1C4E75]/80 text-white"
    >
      {/* Blueprint cyber grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(47,160,198,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(47,160,198,0.04)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      {/* Atmospheric neon glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-[#2FA0C6]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#FFEC89]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C4E75]/80 border border-[#FFEC89]/40 text-[#FFEC89] text-xs font-black uppercase tracking-widest mb-4 shadow-xl backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#FFEC89] animate-pulse" />
              <span>SPE Trivia Academy (.PDF & .DOCX Hub)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
              SpeTrivia <span className="bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] bg-clip-text text-transparent">Knowledge Bank</span>
            </h2>
            <p className="text-[#BDE5FF]/85 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
              Explore technical study modules, competition question banks, and download verified PDF (<code className="text-rose-400 font-mono font-bold">.pdf</code>) or Microsoft Word (<code className="text-[#FFEC89] font-mono font-bold">.docx</code>) study files directly for petroleum engineering competitions.
            </p>
          </div>

          {/* Navigation & Refresh Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={fetchTriviaDocs}
              className="p-3.5 rounded-full border transition-all duration-300 shadow-lg cursor-pointer bg-[#061826]/90 border-[#1C4E75] text-[#58C9F3] hover:bg-[#1C4E75]/60 hover:border-[#2FA0C6]"
              title="Refresh Question Bank"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => handleScroll('left')}
              className="p-3.5 rounded-full border transition-all duration-300 shadow-lg cursor-pointer bg-[#061826]/90 border-[#1C4E75] text-[#58C9F3] hover:bg-[#1C4E75]/60 hover:border-[#2FA0C6]"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-3.5 rounded-full border transition-all duration-300 shadow-lg cursor-pointer bg-[#061826]/90 border-[#1C4E75] text-[#58C9F3] hover:bg-[#1C4E75]/60 hover:border-[#2FA0C6]"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar: Format Tabs & Domain Categories */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          
          {/* Format selector pills (PDF, DOCX, All) */}
          <div className="inline-flex p-1 rounded-2xl bg-[#061826] border border-[#1C4E75] self-start">
            <button
              onClick={() => setActiveFormat('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeFormat === 'All'
                  ? 'bg-gradient-to-r from-[#FFEC89] to-[#7FFFD4] text-[#061826] shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Formats
            </button>
            <button
              onClick={() => setActiveFormat('PDF')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeFormat === 'PDF'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
              PDF Docs
            </button>
            <button
              onClick={() => setActiveFormat('DOCX')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeFormat === 'DOCX'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-blue-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              Word (.DOCX)
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] text-[#061826] font-black border-transparent shadow-lg shadow-[#FFEC89]/20 scale-105'
                    : 'bg-[#061826]/80 text-[#BDE5FF]/80 border-[#1C4E75] hover:border-[#2FA0C6] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Slide Runner Carousel */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-[#FFEC89] border-t-transparent rounded-full animate-spin" />
            <span className="font-bold text-sm text-[#BDE5FF]/70">Loading question banks...</span>
          </div>
        ) : filteredTrivia.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border shadow-inner bg-[#061826]/70 border-[#1C4E75]">
            <HelpCircle className="w-12 h-12 text-[#1C4E75] mx-auto mb-3" />
            <p className="text-[#BDE5FF]/70 font-medium">No trivia documents found matching your filter criteria.</p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            onScroll={handleScrollEvent}
            className="flex gap-6 overflow-x-auto pb-6 no-scrollbar select-none cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayItems.map((item, index) => {
              const isDownloaded = downloadSuccessItem === item.id;
              const isPdf = isPdfItem(item);
              const formatLabel = isPdf ? 'PDF' : 'DOCX';

              return (
                <div
                  key={`${item.id}-${index}`}
                  onClick={() => handleCardClick(item)}
                  className="w-[300px] sm:w-[360px] md:w-[400px] flex-shrink-0 border rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer group bg-[#061826]/90 border-[#1C4E75] hover:border-[#FFEC89]/60 hover:-translate-y-1 backdrop-blur-md flex flex-col justify-between"
                >
                  {/* Card Cover */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-[#061826]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061826] via-[#061826]/30 to-transparent" />
                    
                    {/* Category & Level Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="py-1 px-3 bg-[#061826]/85 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-black text-[#FFEC89] uppercase tracking-wider border border-[#FFEC89]/40 shadow-md">
                        {item.category}
                      </span>
                      <span className="py-1 px-2.5 bg-[#1C4E75]/85 backdrop-blur-md rounded-full text-[10px] font-bold text-[#7FFFD4] border border-[#2FA0C6]/40">
                        {item.level || 'Intermediate'}
                      </span>
                    </div>

                    {/* File Format Badge (PDF or DOCX) */}
                    <div className={`absolute top-4 right-4 py-1 px-2.5 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1.5 border shadow-lg ${
                      isPdf 
                        ? 'bg-gradient-to-r from-rose-600 to-red-600 border-rose-400/50 shadow-rose-900/30'
                        : 'bg-[#0056b3]/90 border-[#58C9F3]/60 shadow-blue-900/30'
                    }`}>
                      <FileText className={`w-3.5 h-3.5 ${isPdf ? 'text-white' : 'text-[#FFEC89]'}`} />
                      <span>.{formatLabel}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-black text-base sm:text-lg tracking-tight leading-snug group-hover:text-[#FFEC89] transition-colors duration-300 mb-2.5 line-clamp-2 text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm leading-relaxed line-clamp-2 text-[#BDE5FF]/80 mb-4">
                        {item.description}
                      </p>

                      {/* Question Count, File Format & Size */}
                      <div className="flex items-center justify-between text-xs text-[#7FFFD4] font-bold mb-4 bg-[#1C4E75]/40 p-2.5 rounded-xl border border-[#2FA0C6]/30">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#FFEC89]" />
                          <span>{item.questionCount || 20} Questions</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            isPdf ? 'bg-rose-900/80 text-rose-300 border border-rose-500/40' : 'bg-blue-900/80 text-blue-300 border border-blue-500/40'
                          }`}>
                            .{formatLabel}
                          </span>
                          <span className="text-[#BDE5FF]/80">{item.docxFileSize || '220 KB'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Row: Download & Read Preview */}
                    <div className="pt-4 border-t border-[#1C4E75]/80 flex items-center justify-between gap-3">
                      <button
                        onClick={(e) => handleDownloadClick(e, item)}
                        className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer ${
                          isDownloaded
                            ? 'bg-emerald-500 text-white'
                            : isPdf
                              ? 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-rose-950/40 active:scale-95'
                              : 'bg-gradient-to-r from-[#FFEC89] to-[#7FFFD4] text-[#061826] hover:brightness-110 active:scale-95'
                        }`}
                        title={`Download ${isPdf ? 'PDF (.pdf)' : 'Microsoft Word (.docx)'} File`}
                      >
                        {isDownloaded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Downloaded</span>
                          </>
                        ) : (
                          <>
                            <FileDown className="w-4 h-4" />
                            <span>Download .{formatLabel}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCardClick(item)}
                        className="py-2.5 px-3.5 rounded-xl bg-[#1C4E75]/60 hover:bg-[#1C4E75] border border-[#2FA0C6]/50 text-[#58C9F3] hover:text-white text-xs font-bold transition-all duration-300 cursor-pointer"
                        title="View Interactive Module & Quiz"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAILED TRIVIA READER & QUIZ MODAL */}
      {selectedTrivia && (
        <div className="fixed inset-0 bg-[#061826]/90 backdrop-blur-lg z-[100] flex items-center justify-center p-4">
          <div className="bg-[#061826] border border-[#2FA0C6]/50 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-300 text-white flex flex-col">
            
            {/* Modal Header Cover */}
            <div className="relative h-56 sm:h-64 bg-[#061826] shrink-0">
              <img
                src={selectedTrivia.image}
                alt={selectedTrivia.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061826] via-[#061826]/40 to-transparent" />
              
              <button
                onClick={() => setSelectedTrivia(null)}
                className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-[#061826]/80 hover:bg-[#1C4E75] text-white backdrop-blur border border-[#2FA0C6]/40 transition-all duration-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-5 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-[#1C4E75] border border-[#FFEC89]/50 text-[#FFEC89] font-black text-xs uppercase tracking-wider">
                    {selectedTrivia.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#061826]/80 border border-[#2FA0C6]/40 text-[#7FFFD4] font-bold text-xs">
                    {selectedTrivia.level || 'Intermediate'}
                  </span>
                  <span className={`px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider ${
                    isPdfItem(selectedTrivia) 
                      ? 'bg-rose-600 text-white' 
                      : 'bg-[#0056b3] text-white'
                  }`}>
                    {isPdfItem(selectedTrivia) ? 'Adobe PDF (.pdf)' : 'Word (.docx)'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                  {selectedTrivia.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Description */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#7FFFD4] mb-2">
                  Module Summary
                </h4>
                <p className="text-sm sm:text-base text-[#BDE5FF]/90 leading-relaxed">
                  {selectedTrivia.description}
                </p>
              </div>

              {/* Key Facts List */}
              {selectedTrivia.keyFacts && selectedTrivia.keyFacts.length > 0 && (
                <div className="p-5 rounded-2xl bg-[#1C4E75]/40 border border-[#2FA0C6]/40">
                  <h4 className="text-sm font-black text-[#FFEC89] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FFEC89]" />
                    Key Facts & Industry Concepts
                  </h4>
                  <ul className="space-y-2">
                    {selectedTrivia.keyFacts.map((fact, fIdx) => (
                      <li key={fIdx} className="text-xs sm:text-sm text-[#BDE5FF] flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#7FFFD4] shrink-0 mt-0.5" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sample Practice Questions */}
              {selectedTrivia.previewQuestions && selectedTrivia.previewQuestions.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-between border-b border-[#1C4E75] pb-2">
                    <span>Practice Questions</span>
                    <span className="text-xs text-[#7FFFD4] font-mono">
                      {selectedTrivia.previewQuestions.length} Questions Available
                    </span>
                  </h4>

                  {selectedTrivia.previewQuestions.map((pq, qIdx) => {
                    const selectedOpt = userAnswers[qIdx];
                    const isAnswered = selectedOpt !== undefined;
                    const isCorrect = selectedOpt === pq.answerIdx;

                    return (
                      <div key={qIdx} className="p-5 rounded-2xl bg-[#061826]/80 border border-[#1C4E75]">
                        <p className="font-bold text-sm sm:text-base text-white mb-3">
                          {qIdx + 1}. {pq.q}
                        </p>

                        {/* Options */}
                        <div className="space-y-2 mb-3">
                          {pq.options.map((opt, optIdx) => {
                            const isSelected = selectedOpt === optIdx;
                            let btnStyle = "bg-[#1C4E75]/40 border-[#2FA0C6]/30 text-[#BDE5FF] hover:border-[#FFEC89]/50 hover:bg-[#1C4E75]/60";
                            
                            if (quizSubmitted) {
                              if (optIdx === pq.answerIdx) {
                                btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold";
                              } else if (isSelected && !isCorrect) {
                                btnStyle = "bg-red-950/80 border-red-500 text-red-200";
                              }
                            } else if (isSelected) {
                              btnStyle = "bg-[#FFEC89] text-[#061826] font-black border-[#FFEC89]";
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  if (!quizSubmitted) {
                                    setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                                  }
                                }}
                                className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && optIdx === pq.answerIdx && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {quizSubmitted && (
                          <div className="mt-3 p-3 rounded-xl bg-[#1C4E75]/60 border border-[#2FA0C6]/40 text-xs text-[#BDE5FF]">
                            <strong className="text-[#FFEC89]">Technical Explanation: </strong>
                            {pq.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {!quizSubmitted && (
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] text-[#061826] font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
                    >
                      Check Answer
                    </button>
                  )}
                </div>
              )}

              {/* Bottom Actions inside Modal */}
              <div className="pt-4 border-t border-[#1C4E75] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#BDE5FF]/70">
                  Includes full answer key and comprehensive technical rationale formatted in {isPdfItem(selectedTrivia) ? 'Adobe PDF (.pdf)' : 'Microsoft Word (.docx)'}.
                </div>
                <button
                  onClick={(e) => handleDownloadClick(e, selectedTrivia)}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer ${
                    isPdfItem(selectedTrivia)
                      ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white ring-2 ring-rose-400/50'
                      : 'bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] text-[#061826] ring-2 ring-[#FFEC89]/50'
                  }`}
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download {isPdfItem(selectedTrivia) ? '.PDF' : '.DOCX'} File</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}
