/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DESTINATIONS } from './data/destinations';
import { Destination, ContinentId } from './types';
import { BIRTHDAY_CONFIG } from './config/birthday';
import { Navbar } from './components/ui/Navbar';
import { ContinentSelector } from './components/ui/ContinentSelector';
import { DestinationCard } from './components/ui/DestinationCard';
import { JourneyTracker } from './components/ui/JourneyTracker';
import { EasterEggModal } from './components/ui/EasterEggModal';
import { AttributionsModal } from './components/ui/AttributionsModal';
import { IntroOverlay } from './components/ui/IntroOverlay';
import { BirthdayCakeModal } from './components/ui/BirthdayCakeModal';
import { InteractiveTutorialModal } from './components/ui/InteractiveTutorialModal';
import { FireworksOverlay } from './components/ui/FireworksOverlay';
import { Globe3D } from './components/globe/Globe3D';
import { Landmark3DScene } from './components/landmark/Landmark3DScene';
import { SecretDestinationScene } from './components/cinematic/SecretDestinationScene';
import { GlobalWeatherOverlay, GlobalWeatherMode } from './components/ui/GlobalWeatherOverlay';
import { soundEngine } from './utils/audio';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [viewMode, setViewMode] = useState<'globe' | 'landmark3d' | 'secret'>('globe');

  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [focusedDestination, setFocusedDestination] = useState<Destination | null>(null);
  const [visitedIds, setVisitedIds] = useState<string[]>([]);
  const [selectedContinent, setSelectedContinent] = useState<ContinentId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [isMuted, setIsMuted] = useState(false);
  const [stargazingMode, setStargazingMode] = useState(false);
  const [weatherMode, setWeatherMode] = useState<GlobalWeatherMode>('clear');

  // Interactive Features Modals
  const [showFireworks, setShowFireworks] = useState(false);
  const [showCakeModal, setShowCakeModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);

  // Modals
  const [showJourneyTracker, setShowJourneyTracker] = useState(false);
  const [showAttributions, setShowAttributions] = useState(false);
  const [activeEasterEgg, setActiveEasterEgg] = useState<{
    title: string;
    message: string;
    iconType: 'moon' | 'santa' | 'star';
  } | null>(null);

  const handleEnterWorld = () => {
    setHasEntered(true);
    soundEngine.playHappyBirthdaySong();
    handleTriggerFireworks();
    setShowCakeModal(true);
  };

  const handleTriggerFireworks = () => {
    setShowFireworks(true);
    soundEngine.playFireworkSound();
    setTimeout(() => {
      setShowFireworks(false);
    }, 6500);
  };

  // Filter destinations based on search and continent filter
  const filteredDestinations = DESTINATIONS.filter((d) => {
    const matchesContinent = selectedContinent === 'all' || d.continent === selectedContinent;
    const matchesSearch =
      searchQuery.trim() === '' ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesContinent && matchesSearch;
  });

  const handleSelectDestination = (dest: Destination) => {
    setSelectedDestination(dest);
    if (!visitedIds.includes(dest.id)) {
      setVisitedIds((prev) => [...prev, dest.id]);
    }
    setViewMode('landmark3d');
  };

  const handleEnter3DLandmark = (dest: Destination) => {
    setSelectedDestination(dest);
    setViewMode('landmark3d');
  };

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleMoonClick = () => {
    setActiveEasterEgg({
      title: 'Secret Moon Discovery 🌙',
      message: BIRTHDAY_CONFIG.EASTER_EGGS.moonQuote,
      iconType: 'moon',
    });
  };

  const handleSantaClick = () => {
    setActiveEasterEgg({
      title: "Santa's GPS Check-In 🎅",
      message: BIRTHDAY_CONFIG.EASTER_EGGS.santaQuote,
      iconType: 'santa',
    });
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 font-sans text-white overflow-hidden select-none">
      {/* Intro Welcome Screen for Benedicta */}
      {!hasEntered && <IntroOverlay onEnter={handleEnterWorld} />}

      {/* Global Weather Canvas Affecting Whole App from Nav to Footer */}
      <GlobalWeatherOverlay mode={weatherMode} />

      {/* Fireworks Canvas Overlay */}
      <FireworksOverlay
        active={showFireworks}
        onFinish={() => setShowFireworks(false)}
      />

      {/* Main WebGL 3D Globe View */}
      {hasEntered && viewMode === 'globe' && (
        <>
          <Navbar
            visitedCount={visitedIds.length}
            totalCount={DESTINATIONS.length}
            isMuted={isMuted}
            weatherMode={weatherMode}
            onSelectWeatherMode={setWeatherMode}
            onToggleSound={handleToggleSound}
            onOpenJourney={() => setShowJourneyTracker(true)}
            onOpenSecret={() => setViewMode('secret')}
            onOpenAttributions={() => setShowAttributions(true)}
            onOpenCakeModal={() => setShowCakeModal(true)}
            onOpenTutorial={() => setShowTutorialModal(true)}
            onTriggerFireworks={handleTriggerFireworks}
            stargazingMode={stargazingMode}
            onToggleStargazing={() => setStargazingMode(!stargazingMode)}
            unlockedSecret={visitedIds.length >= 3}
          />

          <Globe3D
            destinations={filteredDestinations}
            visitedIds={visitedIds}
            selectedDestination={selectedDestination}
            focusedDestination={focusedDestination}
            selectedContinent={selectedContinent}
            onSelectDestination={handleSelectDestination}
            onMoonClick={handleMoonClick}
            onSantaClick={handleSantaClick}
            stargazingMode={stargazingMode}
          />

          <ContinentSelector
            selectedContinent={selectedContinent}
            onSelectContinent={(c) => {
              setSelectedContinent(c);
              setFocusedDestination(null);
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            destinations={filteredDestinations}
            allDestinations={DESTINATIONS}
            onSelectDestination={handleSelectDestination}
            onFocusDestination={setFocusedDestination}
          />

          {selectedDestination && (
            <DestinationCard
              destination={selectedDestination}
              isVisited={visitedIds.includes(selectedDestination.id)}
              onEnter3D={handleEnter3DLandmark}
              onClose={() => setSelectedDestination(null)}
            />
          )}
        </>
      )}

      {/* 3. 3D Landmark Inspection Scene View */}
      {hasEntered && viewMode === 'landmark3d' && selectedDestination && (
        <Landmark3DScene
          destination={selectedDestination}
          globalWeatherMode={weatherMode}
          onSelectWeatherMode={setWeatherMode}
          onBack={() => setViewMode('globe')}
        />
      )}

      {/* 4. Climax Secret Sanctuary Scene View */}
      {hasEntered && viewMode === 'secret' && (
        <SecretDestinationScene onBack={() => setViewMode('globe')} />
      )}

      {/* Modals */}
      <BirthdayCakeModal
        isOpen={showCakeModal}
        onClose={() => setShowCakeModal(false)}
        onTriggerFireworks={handleTriggerFireworks}
      />

      <InteractiveTutorialModal
        isOpen={showTutorialModal}
        onClose={() => setShowTutorialModal(false)}
        onOpenCakeModal={() => setShowCakeModal(true)}
      />

      {showJourneyTracker && (
        <JourneyTracker
          visitedIds={visitedIds}
          onSelectDestination={handleSelectDestination}
          onOpenSecret={() => {
            setShowJourneyTracker(false);
            setViewMode('secret');
          }}
          onClose={() => setShowJourneyTracker(false)}
        />
      )}

      {showAttributions && (
        <AttributionsModal onClose={() => setShowAttributions(false)} />
      )}

      {activeEasterEgg && (
        <EasterEggModal
          title={activeEasterEgg.title}
          message={activeEasterEgg.message}
          iconType={activeEasterEgg.iconType}
          onClose={() => setActiveEasterEgg(null)}
        />
      )}
    </div>
  );
}
;
