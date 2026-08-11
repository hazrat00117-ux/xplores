import React, { useState, useRef } from 'react';
import { CONTINENTS } from '../../data/continents';
import { ContinentId, Destination } from '../../types';
import {
  Globe,
  Compass,
  Sparkles,
  Landmark,
  Mountain,
  Sun,
  Waves,
  Snowflake,
  Search,
  Box,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  X,
  MapPin,
} from 'lucide-react';

interface ContinentSelectorProps {
  selectedContinent: ContinentId | 'all';
  onSelectContinent: (id: ContinentId | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  destinations: Destination[];
  allDestinations?: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onFocusDestination?: (dest: Destination | null) => void;
}

export const ContinentSelector: React.FC<ContinentSelectorProps> = ({
  selectedContinent,
  onSelectContinent,
  searchQuery,
  onSearchChange,
  destinations,
  allDestinations = [],
  onSelectDestination,
  onFocusDestination,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const continentsScrollRef = useRef<HTMLDivElement>(null);
  const landmarksScrollRef = useRef<HTMLDivElement>(null);

  const getIcon = (id: string) => {
    switch (id) {
      case 'africa': return <Compass size={13} />;
      case 'asia': return <Sparkles size={13} />;
      case 'europe': return <Landmark size={13} />;
      case 'north-america': return <Mountain size={13} />;
      case 'south-america': return <Sun size={13} />;
      case 'oceania': return <Waves size={13} />;
      case 'antarctica': return <Snowflake size={13} />;
      default: return <Globe size={13} />;
    }
  };

  const continentList: { id: ContinentId | 'all'; name: string }[] = [
    { id: 'all', name: 'All Continents' },
    ...CONTINENTS,
  ];

  // Carousel arrow scroll helpers
  const scrollContinents = (direction: 'left' | 'right') => {
    if (!continentsScrollRef.current) return;
    const amount = direction === 'left' ? -240 : 240;
    continentsScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const scrollLandmarks = (direction: 'left' | 'right') => {
    if (!landmarksScrollRef.current) return;
    const amount = direction === 'left' ? -300 : 300;
    landmarksScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // Select next or previous continent in carousel order
  const cycleContinent = (direction: 'prev' | 'next') => {
    const currentIndex = continentList.findIndex((c) => c.id === selectedContinent);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0) nextIndex = continentList.length - 1;
    if (nextIndex >= continentList.length) nextIndex = 0;

    const targetCont = continentList[nextIndex].id;
    onSelectContinent(targetCont);

    // Scroll active item into view
    if (continentsScrollRef.current) {
      const activeBtn = continentsScrollRef.current.children[nextIndex] as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  // Search suggestions pool
  const pool = allDestinations.length > 0 ? allDestinations : destinations;
  const searchSuggestions =
    searchQuery.trim().length > 0
      ? pool.filter((d) => {
          const q = searchQuery.toLowerCase().trim();
          return (
            d.name.toLowerCase().includes(q) ||
            d.city.toLowerCase().includes(q) ||
            d.country.toLowerCase().includes(q) ||
            d.continent.toLowerCase().includes(q)
          );
        }).slice(0, 7)
      : [];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-3 sm:px-4 pointer-events-none space-y-3">
      {/* 1. Landmarks Carousel Strip with Arrow Buttons */}
      {destinations.length > 0 && (
        <div className="pointer-events-auto relative flex items-center group/landmarks">
          <button
            onClick={() => scrollLandmarks('left')}
            className="absolute left-0 z-30 p-2 bg-slate-900/90 border border-white/20 text-white/80 hover:text-white rounded-full shadow-2xl backdrop-blur-md opacity-80 group-hover/landmarks:opacity-100 hover:scale-110 transition -translate-x-2"
            title="Scroll Left"
          >
            <ChevronLeft size={16} />
          </button>

          <div
            ref={landmarksScrollRef}
            className="overflow-x-auto no-scrollbar flex items-center gap-2.5 py-1 px-4 w-full scroll-smooth"
          >
            {destinations.map((dest) => (
              <button
                key={dest.id}
                onMouseEnter={() => onFocusDestination && onFocusDestination(dest)}
                onFocus={() => onFocusDestination && onFocusDestination(dest)}
                onClick={() => {
                  if (onFocusDestination) onFocusDestination(dest);
                  onSelectDestination(dest);
                }}
                className="flex-shrink-0 flex items-center gap-3 px-3.5 py-2 glass-panel hover:bg-white/15 border border-white/15 hover:border-[#d4af37] rounded-2xl text-left transition-all duration-300 group shadow-xl active:scale-95"
              >
                <div
                  className="p-2 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${dest.accentColor}33`, color: dest.accentColor }}
                >
                  <Box size={16} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-[#d4af37] transition-colors line-clamp-1 font-serif">
                    {dest.name}
                  </div>
                  <div className="text-[10px] text-white/60 tracking-wider uppercase line-clamp-1 flex items-center gap-1">
                    <MapPin size={10} className="text-[#d4af37]" />
                    {dest.city}, {dest.country}
                  </div>
                </div>
                <div className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-[#d4af37]">
                  <ArrowUpRight size={14} />
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollLandmarks('right')}
            className="absolute right-0 z-30 p-2 bg-slate-900/90 border border-white/20 text-white/80 hover:text-white rounded-full shadow-2xl backdrop-blur-md opacity-80 group-hover/landmarks:opacity-100 hover:scale-110 transition translate-x-2"
            title="Scroll Right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* 2. Search & Continent Carousel Control Bar */}
      <div className="glass-panel p-3 sm:p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.7)] pointer-events-auto space-y-3 relative">
        {/* Live Search Suggestions Menu */}
        {searchQuery.trim().length > 0 && searchSuggestions.length > 0 && (
          <div className="absolute bottom-full left-0 right-0 mb-3 bg-slate-900/95 border border-[#d4af37]/40 backdrop-blur-2xl rounded-2xl p-2 shadow-2xl space-y-1 max-h-64 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-widest text-[#d4af37] font-semibold flex items-center justify-between border-b border-white/10">
              <span>Search Suggestions ({searchSuggestions.length})</span>
              <span className="text-white/40">Hover to rotate globe 🌍</span>
            </div>
            {searchSuggestions.map((dest) => (
              <div
                key={dest.id}
                onMouseEnter={() => onFocusDestination && onFocusDestination(dest)}
                onClick={() => {
                  if (onFocusDestination) onFocusDestination(dest);
                  onSelectDestination(dest);
                  onSearchChange('');
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 cursor-pointer transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-serif shadow-inner"
                    style={{ backgroundColor: `${dest.accentColor}33`, color: dest.accentColor }}
                  >
                    🏰
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-[#d4af37] transition font-serif">
                      {dest.name}
                    </div>
                    <div className="text-[10px] text-white/60">
                      {dest.city}, {dest.country} • <span className="uppercase text-[#d4af37]/80">{dest.continent}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-medium tracking-wider uppercase group-hover:bg-[#d4af37] group-hover:text-black transition">
                  <span>3D View</span>
                  <ArrowUpRight size={12} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search Input Bar */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af37]" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            onChange={(e) => {
              const val = e.target.value;
              onSearchChange(val);
              // Auto focus globe on first matching result as user types
              if (val.trim() && allDestinations.length > 0) {
                const match = allDestinations.find(
                  (d) =>
                    d.name.toLowerCase().includes(val.toLowerCase()) ||
                    d.city.toLowerCase().includes(val.toLowerCase()) ||
                    d.country.toLowerCase().includes(val.toLowerCase())
                );
                if (match && onFocusDestination) {
                  onFocusDestination(match);
                }
              }
            }}
            placeholder="Search places (e.g. Fuji, Eiffel, Pyramids, Taj Mahal) - rotates globe instantly..."
            className="w-full bg-white/8 border border-white/15 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition duration-300 font-light"
          />
          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange('');
                if (onFocusDestination) onFocusDestination(null);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white transition"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* 3. Continent Carousel with Arrow Buttons */}
        <div className="relative flex items-center group/continents">
          <button
            onClick={() => cycleContinent('prev')}
            className="p-1.5 mr-1 bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white rounded-xl transition flex-shrink-0"
            title="Previous Continent"
          >
            <ChevronLeft size={15} />
          </button>

          <div
            ref={continentsScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full scroll-smooth"
          >
            {continentList.map((cont) => {
              const isSelected = selectedContinent === cont.id;
              return (
                <button
                  key={cont.id}
                  onClick={() => onSelectContinent(cont.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all duration-300 border flex-shrink-0 ${
                    isSelected
                      ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] gold-glow shadow-md scale-105'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {getIcon(cont.id)}
                  <span>{cont.name}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => cycleContinent('next')}
            className="p-1.5 ml-1 bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white rounded-xl transition flex-shrink-0"
            title="Next Continent"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

