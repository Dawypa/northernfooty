import React, { useEffect, useState } from 'react';
import { ArrowRight, Calendar, CheckCircle2, ChevronLeft, ChevronRight, Clock, Quote } from 'lucide-react';
import {
  BUNDLED_MEDIA,
  HOME_TESTIMONIALS,
  LOCAL_CLUB_PARTNERS,
  PATHWAY_ROUTING_DATA,
  PageId,
  PathwayType,
  ProgramId,
  TRAINING_PROGRAMS,
} from '../data/clinicData';

interface HomeViewProps {
  selectedPathway: PathwayType;
  onSelectPathway: (pathway: PathwayType) => void;
  onNavigate: (page: PageId, programId?: ProgramId) => void;
  onStartBookingWithPreset: (preset: {
    ageGroup?: string;
    primaryGoal?: string;
    sessionType?: '3RM & Movement Screening' | '1-on-1 Mentoring' | 'Group Squad';
  }) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  selectedPathway,
  onSelectPathway,
  onNavigate,
  onStartBookingWithPreset,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    11 * 86400 + 14 * 3600 + 28 * 60 + 42
  );
  const [testimonialFilter, setTestimonialFilter] = useState<'all' | PathwayType>('all');
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState<number>(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState<boolean>(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 11 * 86400));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const filteredTestimonials =
    testimonialFilter === 'all'
      ? HOME_TESTIMONIALS
      : HOME_TESTIMONIALS.filter((t) => t.pathway === testimonialFilter);

  useEffect(() => {
    setActiveTestimonialIdx(0);
  }, [testimonialFilter]);

  useEffect(() => {
    if (isCarouselPaused || filteredTestimonials.length <= 1) return;
    const interval = window.setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev + 1) % filteredTestimonials.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, [isCarouselPaused, filteredTestimonials.length]);

  const currentTestimonial =
    filteredTestimonials[activeTestimonialIdx] || filteredTestimonials[0];

  const handlePrevTestimonial = () => {
    setActiveTestimonialIdx((prev) =>
      prev === 0 ? filteredTestimonials.length - 1 : prev - 1
    );
  };

  const handleNextTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const days = Math.floor(secondsRemaining / 86400);
  const hours = Math.floor((secondsRemaining % 86400) / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);

  const activePathway = PATHWAY_ROUTING_DATA[selectedPathway];

  return (
    <div className="space-y-14 pb-16">
      {/* 1. HERO SECTION WITH LARGE RIGHT-TO-LEFT FADING IMAGE */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-14 sm:py-20 border-b border-slate-800">
        {/* Hardware-Accelerated Unsharp Mask Filter for High-Definition Edge Crispness */}
        <svg className="sr-only" aria-hidden="true">
          <defs>
            <filter id="hero-hd-sharpen" colorInterpolationFilters="sRGB">
              <feConvolveMatrix
                order="3 3"
                preserveAlpha="true"
                kernelMatrix="0 -0.45 0 -0.45 2.8 -0.45 0 -0.45 0"
              />
              <feComponentTransfer>
                <feFuncR type="linear" slope="1.04" intercept="-0.02" />
                <feFuncG type="linear" slope="1.04" intercept="-0.02" />
                <feFuncB type="linear" slope="1.04" intercept="-0.02" />
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>

        {/* Large Hero Image Fading from Right to Left */}
        <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-[62%] pointer-events-none select-none">
          <img
            src={BUNDLED_MEDIA.coachKickingSvg}
            alt="Stylised illustration of a Northern Edge Footy coach instructing a player on AFL drop-punt kicking technique"
            referrerPolicy="no-referrer"
            decoding="sync"
            fetchPriority="high"
            style={{
              filter: 'url(#hero-hd-sharpen) contrast(1.06) saturate(1.05)',
              imageRendering: 'auto',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
            }}
            className="w-full h-80 sm:h-96 lg:h-full object-cover object-center block"
          />
          {/* Right-to-Left Gradient Fade into Slate-900 Background */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-slate-900/45 to-slate-900" />
          {/* Top and Bottom Edge Soft Blend */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/35" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Hero Copy & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="text-[#FF5500] font-semibold">
                  North-East Adelaide Football Clinic
                </span>
                <span aria-hidden="true">·</span>
                <span>Holden Hill Facility &amp; Local Turf</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-slate-300 tabular-nums">
                  <Clock className="w-3.5 h-3.5 text-[#FF5500]" />
                  Next 8-Week Intake: {days}d {hours}h {minutes}m
                </span>
              </div>

              <div className="space-y-4">
                <h1
                  className="font-display font-bold text-white tracking-tight leading-[1.05]"
                  style={{ fontSize: 'clamp(2.35rem, 4.3vw, 3.6rem)', textWrap: 'balance' }}
                >
                  Faster 2km Running, Stronger Contested Power &amp; Cleaner Foot Skills.
                </h1>

                <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
                  Coaching and 1-on-1 kicking mentoring for aspiring junior and senior footballers in North-East Adelaide. Select a pathway below or book an initial trial session through our online calendar.
                </p>
              </div>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    onStartBookingWithPreset({
                      ageGroup: activePathway.defaultAgeBracket,
                      primaryGoal: activePathway.recommendedGoal,
                      sessionType: '3RM & Movement Screening',
                    })
                  }
                  className="px-6 py-3.5 rounded-lg bg-[#FF5500] hover:bg-[#E04800] text-white font-semibold text-sm transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Book Trial Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('programs')}
                  className="px-5 py-3.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-slate-700 font-medium text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  View Training Programs
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('coaches')}
                  className="px-4 py-3.5 rounded-lg text-slate-200 hover:text-white font-medium text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Weekly Timetable
                </button>
              </div>
            </div>
          </div>

          {/* Quiet Local Club Trust Strip */}
          <div className="pt-6 border-t border-slate-800/90 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
            <span className="text-slate-300 font-medium">Athletes training from:</span>
            {LOCAL_CLUB_PARTNERS.map((club, index) => (
              <React.Fragment key={club.name}>
                <span>{club.name}</span>
                {index < LOCAL_CLUB_PARTNERS.length - 1 && (
                  <span aria-hidden="true" className="text-slate-600">
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 2. CLEAR DUAL PATHWAY SELECTOR: SENIOR PLAYERS VS. JUNIOR PARENTS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Choose Your Athlete Pathway
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Switch between Senior and Junior options to see your recommended starting plan.
            </p>
          </div>

          {/* Simple Segmented Pathway Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start">
            <button
              type="button"
              onClick={() => onSelectPathway('senior')}
              className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedPathway === 'senior'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Senior Players (18+)
            </button>
            <button
              type="button"
              onClick={() => onSelectPathway('junior')}
              className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedPathway === 'junior'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Junior Parents (U14–U18)
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-semibold text-[#2563EB]">
                {activePathway.badgeLabel}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                {activePathway.heading}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {activePathway.subheading}
              </p>

              <div className="space-y-2 pt-1">
                {activePathway.keyProblemsSolved.map((problem) => (
                  <div key={problem} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                    <span>{problem}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-2">
                  What We Cover in Your Initial Trial Session
                </div>
                <div className="space-y-2">
                  {activePathway.screeningProtocol.map((step, i) => (
                    <div
                      key={step}
                      className="text-xs sm:text-sm text-slate-800 font-medium flex items-start gap-2"
                    >
                      <span className="font-mono text-xs text-[#2563EB] font-semibold mt-0.5">
                        0{i + 1}.
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onStartBookingWithPreset({
                      ageGroup: activePathway.defaultAgeBracket,
                      primaryGoal: activePathway.recommendedGoal,
                      sessionType: '3RM & Movement Screening',
                    })
                  }
                  className="w-full py-2.5 px-4 rounded-lg bg-[#FF5500] hover:bg-[#E04800] text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book {selectedPathway === 'senior' ? 'Senior' : 'Junior'} Trial Session</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STREAMLINED 3-CARD PROGRAM DIRECTORY */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Core Training Programs
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Three focused streams for pre-season strength, junior kicking development, and injury resilience.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('programs')}
            className="text-sm font-semibold text-[#2563EB] hover:text-blue-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>See Full Program Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRAINING_PROGRAMS.map((program) => (
            <div
              key={program.id}
              className="rounded-xl bg-white border border-slate-200 p-6 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-semibold text-[#FF5500]">{program.code}</span>
                  <span aria-hidden="true">·</span>
                  <span>{program.duration}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  {program.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{program.summary}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate('programs', program.id)}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer text-center"
                >
                  Program Details
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onStartBookingWithPreset({
                      ageGroup:
                        program.id === 'junior-pathway'
                          ? 'U16 (15–16 yrs)'
                          : 'Senior Amateur / SANFL (18+)',
                      primaryGoal:
                        program.id === 'junior-pathway'
                          ? 'Drop-Punt Kicking Distance & Biomechanics'
                          : program.id === 'bulletproof-limb'
                          ? 'Bulletproof Calf / Hamstring Resilience'
                          : '3RM Maximal Strength & Contested Power',
                      sessionType: '3RM & Movement Screening',
                    })
                  }
                  className="py-2.5 px-3.5 rounded-lg bg-[#FF5500] hover:bg-[#E04800] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Book Trial
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PARENT & ATHLETE TESTIMONIAL CAROUSEL */}
      <section
        aria-label="Parent and Athlete Testimonials"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-[#FF5500] mb-1">
              North-East Adelaide Community Feedback
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              What Parents &amp; Athletes Say
            </h2>
          </div>

          {/* Filter by All / Junior Parents / Senior Athletes */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start">
            {(
              [
                { id: 'all', label: 'All Stories' },
                { id: 'junior', label: 'Junior Parents' },
                { id: 'senior', label: 'Senior Athletes' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTestimonialFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  testimonialFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Card */}
        <div className="rounded-xl bg-white border border-slate-200 p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Quote className="w-4 h-4 text-[#FF5500] shrink-0" />
                <span className="font-semibold text-[#2563EB]">
                  {currentTestimonial.pathway === 'junior'
                    ? 'Junior Pathway Parent Feedback'
                    : 'Senior Squad Athlete Feedback'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {activeTestimonialIdx + 1} / {filteredTestimonials.length}
                </span>
              </div>

              <blockquote className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium">
                “{currentTestimonial.quote}”
              </blockquote>

              <div className="pt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
                <span className="font-bold text-slate-900">{currentTestimonial.authorName}</span>
                <span aria-hidden="true" className="text-slate-400">
                  ·
                </span>
                <span className="text-slate-600">{currentTestimonial.role}</span>
                <span aria-hidden="true" className="text-slate-400">
                  ·
                </span>
                <span className="text-slate-500">{currentTestimonial.clubOrCohort}</span>
              </div>
            </div>

            {/* Right Column: Verified Outcome & Carousel Controls */}
            <div className="lg:col-span-4 rounded-xl bg-slate-50 border border-slate-200 p-5 flex flex-col justify-between space-y-5">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-500">
                  Recorded 8-Week Outcome
                </div>
                <div className="font-mono text-xs sm:text-sm font-semibold text-slate-900 tabular-nums">
                  {currentTestimonial.resultHighlight}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                {/* Slide Indicator Buttons */}
                <div className="flex items-center gap-1.5">
                  {filteredTestimonials.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTestimonialIdx(idx)}
                      aria-label={`View testimonial ${idx + 1} from ${item.authorName}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeTestimonialIdx === idx
                          ? 'w-6 bg-[#FF5500]'
                          : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>

                {/* Prev / Next Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevTestimonial}
                    aria-label="Previous testimonial"
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextTestimonial}
                    aria-label="Next testimonial"
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

