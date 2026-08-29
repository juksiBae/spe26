import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight, X, Clock, RefreshCw } from 'lucide-react';
import { NewsArticle } from '../types';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function NewsSection() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const dragDistance = useRef(0);

  // Fetch news from Firestore directly
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const newsCol = collection(db, 'news');
      const q = query(newsCol, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const articles: NewsArticle[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        articles.push({
          id: docSnap.id,
          title: data.title,
          date: data.date,
          excerpt: data.excerpt,
          fullText: data.fullText,
          image: data.image,
          createdAt: data.createdAt ? (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString()
        } as NewsArticle);
      });
      setNews(articles);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal mengambil data berita!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Auto scroll effect
  useEffect(() => {
    if (loading || error || news.length === 0 || activeArticle || isHovered || isDragging) {
      return;
    }

    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 1;
      }
    }, 25); // ~40fps, ultra-smooth 1px steps

    return () => clearInterval(interval);
  }, [loading, error, news, activeArticle, isHovered, isDragging]);

  // Initialize scroll position in the middle for seamless infinite scroll
  useEffect(() => {
    if (scrollRef.current && news.length > 0) {
      const timer = setTimeout(() => {
        if (scrollRef.current) {
          const { scrollWidth } = scrollRef.current;
          scrollRef.current.scrollLeft = scrollWidth / 2;
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [news, loading]);

  // Seamless snap loop function
  const handleScrollEvent = () => {
    if (!scrollRef.current || news.length === 0) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const halfWidth = scrollWidth / 2;

    // Right boundary snap:
    if (scrollLeft >= scrollWidth - clientWidth - 10) {
      scrollRef.current.scrollLeft = scrollLeft - halfWidth;
    }
    // Left boundary snap:
    else if (scrollLeft <= 10) {
      scrollRef.current.scrollLeft = scrollLeft + halfWidth;
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
    const walk = (x - startX.current) * 1.5; // Drag speed multiplier
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

  const handleCardClick = (item: NewsArticle) => {
    if (dragDistance.current > 10) {
      // It was a drag, don't open modal
      return;
    }
    setActiveArticle(item);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 360; // Approximate card width
      const gap = 24;
      const scrollAmount = direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap);
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="news" 
      className="py-24 bg-[#061826]/90 relative overflow-hidden border-b border-[#1C4E75]/70"
    >
      {/* Premium subtle dotted mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#2FA0C6_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

      {/* Soft atmospheric gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#2FA0C6]/15 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse duration-[9000ms]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#58C9F3]/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse duration-[12000ms]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="px-4 py-1.5 rounded-full font-extrabold text-xs uppercase tracking-widest inline-block mb-4 bg-[#1C4E75]/60 border border-[#FFEC89]/40 text-[#FFEC89] shadow-lg">
              Latest Updates
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none text-white">
              News & <span className="bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] bg-clip-text text-transparent">Highlights</span>
            </h2>
            <p className="text-sm md:text-base mt-3 max-w-xl text-[#BDE5FF]/80">
              Stay updated with our recent campaigns, community development events, and industrial accomplishments in petroleum engineering.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={fetchNews}
              className="p-3.5 rounded-full border transition-all duration-300 shadow-lg cursor-pointer bg-[#061826]/90 border-[#1C4E75] text-[#58C9F3] hover:bg-[#1C4E75]/60 hover:border-[#2FA0C6]"
              title="Refresh News"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => handleScroll('left')}
              className="p-3.5 rounded-full border transition-all duration-300 shadow-lg cursor-pointer bg-[#061826]/90 border-[#1C4E75] text-[#58C9F3] hover:bg-[#1C4E75]/60 hover:border-[#2FA0C6]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-3.5 rounded-full border transition-all duration-300 shadow-lg cursor-pointer bg-[#061826]/90 border-[#1C4E75] text-[#58C9F3] hover:bg-[#1C4E75]/60 hover:border-[#2FA0C6]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-[#2FA0C6] border-t-transparent rounded-full animate-spin" />
            <span className="font-bold text-sm text-[#BDE5FF]/70">Loading berita terbaru...</span>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl border text-center max-w-md mx-auto bg-red-950/40 border-red-500/40">
            <p className="text-red-400 font-semibold mb-3">{error}</p>
            <button onClick={fetchNews} className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all">
              Coba Lagi
            </button>
          </div>
        ) : news.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border shadow-inner bg-[#061826]/70 border-[#1C4E75]">
            <p className="text-[#BDE5FF]/60 font-medium">Belum ada berita yang diterbitkan saat ini.</p>
          </div>
        ) : (
          /* Horizontal Swipe List */
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
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 no-scrollbar select-none cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[...news, ...news].map((item, index) => (
              <div 
                key={`${item.id}-${index}`}
                onClick={() => handleCardClick(item)}
                className="w-[280px] sm:w-[340px] md:w-[380px] flex-shrink-0 border rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-[#061826]/85 border-[#1C4E75] hover:border-[#58C9F3]/60 backdrop-blur-sm"
              >
                {/* News Image */}
                <div className="relative h-48 md:h-52 overflow-hidden bg-[#061826]">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    draggable={false}
                  />
                  <div className="absolute top-4 left-4 py-1.5 px-3 bg-[#061826]/80 backdrop-blur-md rounded-full text-[10px] md:text-xs font-black text-[#7FFFD4] uppercase tracking-wider flex items-center gap-1.5 border border-[#2FA0C6]/40 shadow-md">
                    <Clock className="w-3.5 h-3.5" />
                    {item.date}
                  </div>
                </div>

                {/* News Content */}
                <div className="p-6 flex flex-col justify-between min-h-[220px]">
                  <div>
                    <h4 className="font-extrabold text-base md:text-lg tracking-tight leading-snug group-hover:text-[#58C9F3] transition-colors duration-300 mb-3 line-clamp-2 text-white">
                      {item.title}
                    </h4>
                    <p className="text-sm leading-relaxed line-clamp-3 text-[#BDE5FF]/75">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[#58C9F3] font-bold text-sm tracking-tight mt-4 group-hover:gap-3 transition-all duration-300 group-hover:text-[#7FFFD4]">
                    Read full story
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ARTICLE MODAL */}
      {activeArticle && (
        <div className="fixed inset-0 bg-[#061826]/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#061826] border border-[#2FA0C6]/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
            {/* Top Close */}
            <button 
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-[#061826]/80 hover:bg-[#1C4E75] text-white backdrop-blur border border-[#2FA0C6]/40 transition-all duration-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Hero */}
            <div className="relative h-64 md:h-72 bg-[#061826]">
              <img 
                src={activeArticle.image} 
                alt={activeArticle.title} 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061826] via-[#061826]/30 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 rounded-full bg-[#1C4E75] border border-[#58C9F3]/50 text-[#7FFFD4] font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 mb-2 shadow-md">
                  <Calendar className="w-3.5 h-3.5" />
                  {activeArticle.date}
                </span>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {activeArticle.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <p className="text-[#BDE5FF]/90 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                {activeArticle.fullText}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
