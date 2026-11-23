/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PageId, PathwayType, ProgramId } from './data/clinicData';
import { HomeView } from './components/HomeView';
import { ProgramsView } from './components/ProgramsView';
import { CoachesFacilityView } from './components/CoachesFacilityView';
import { PerformanceHubView } from './components/PerformanceHubView';
import { BookingAssessmentView } from './components/BookingAssessmentView';
import { LocalSeoRetentionSection } from './components/LocalSeoRetentionSection';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [selectedPathway, setSelectedPathway] = useState<PathwayType>('senior');
  const [activeProgramId, setActiveProgramId] = useState<ProgramId>('senior-strength');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [bookingPreset, setBookingPreset] = useState<{
    ageGroup?: string;
    primaryGoal?: string;
    sessionType?: '3RM & Movement Screening' | '1-on-1 Mentoring' | 'Group Squad';
  }>({});

  useEffect(() => {
    const titles: Record<PageId, string> = {
      home: 'Northern Edge Footy – Adelaide AFL Skills & S&C Clinic',
      programs: 'Training Programs (3RM, Junior Pathway & Lower-Limb) – Northern Edge Footy',
      coaches: 'Coaches, Holden Hill Lab & Player Results – Northern Edge Footy',
      hub: 'Footy Performance Hub (MAS Running & Rehab Blog) – Northern Edge Footy',
      book: 'Book a Trial Assessment & Calendar Intake – Northern Edge Footy',
    };
    document.title = titles[activePage];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const handleNavigate = (page: PageId, programId?: ProgramId) => {
    if (programId) {
      setActiveProgramId(programId);
    }
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const handleStartBookingWithPreset = (preset: {
    ageGroup?: string;
    primaryGoal?: string;
    sessionType?: '3RM & Movement Screening' | '1-on-1 Mentoring' | 'Group Squad';
  }) => {
    setBookingPreset(preset);
    setActivePage('book');
    setMobileMenuOpen(false);
  };

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'programs', label: 'Training Programs' },
    { id: 'coaches', label: 'Coaches & Timetable' },
    { id: 'hub', label: 'Performance Hub' },
    { id: 'book', label: 'Book Session' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Clean 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single wordmark */}
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            className="font-display text-2xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            Northern Edge Footy
          </button>

          {/* Zone 2: Clear single-line text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`py-5 whitespace-nowrap shrink-0 transition-colors border-b-2 cursor-pointer ${
                    isActive
                      ? 'text-[#FF5500] font-semibold border-[#FF5500]'
                      : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() =>
                handleStartBookingWithPreset({
                  sessionType: '3RM & Movement Screening',
                })
              }
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#FF5500] hover:bg-[#E04800] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              Book Trial Assessment
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer block ${
                  activePage === item.id
                    ? 'bg-orange-50 text-[#FF5500] font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomeView
            selectedPathway={selectedPathway}
            onSelectPathway={(pathway) => {
              setSelectedPathway(pathway);
              setActiveProgramId(
                pathway === 'senior' ? 'senior-strength' : 'junior-pathway'
              );
            }}
            onNavigate={handleNavigate}
            onStartBookingWithPreset={handleStartBookingWithPreset}
          />
        )}

        {activePage === 'programs' && (
          <ProgramsView
            activeProgramId={activeProgramId}
            onSelectProgram={setActiveProgramId}
            onStartBookingWithPreset={handleStartBookingWithPreset}
          />
        )}

        {activePage === 'coaches' && (
          <CoachesFacilityView
            onBookFromTimetableOrPricing={handleStartBookingWithPreset}
          />
        )}

        {activePage === 'hub' && (
          <PerformanceHubView
            onBookScreening={(goal) =>
              handleStartBookingWithPreset({
                primaryGoal: goal,
                sessionType: '3RM & Movement Screening',
              })
            }
          />
        )}

        {activePage === 'book' && (
          <BookingAssessmentView
            presetAgeGroup={bookingPreset.ageGroup}
            presetPrimaryGoal={bookingPreset.primaryGoal}
            presetSessionType={bookingPreset.sessionType}
          />
        )}

        <LocalSeoRetentionSection />
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-display text-xl font-bold text-slate-900">
              Northern Edge Footy
            </div>
            <p className="text-xs text-slate-500">
              Unit 4, 560 North East Road, Holden Hill SA 5088 · North-East Adelaide Football Skills &amp; S&amp;C
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className="hover:text-[#FF5500] transition-colors cursor-pointer whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 whitespace-nowrap">
            © {new Date().getFullYear()} Northern Edge Footy Pty Ltd
          </div>
        </div>
      </footer>
    </div>
  );
}
