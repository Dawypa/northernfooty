import React, { useState } from 'react';
import { ArrowRight, Calculator, CheckCircle2, Layers } from 'lucide-react';
import { ProgramId, TRAINING_PROGRAMS } from '../data/clinicData';

interface ProgramsViewProps {
  activeProgramId: ProgramId;
  onSelectProgram: (id: ProgramId) => void;
  onStartBookingWithPreset: (preset: {
    ageGroup?: string;
    primaryGoal?: string;
    sessionType?: '3RM & Movement Screening' | '1-on-1 Mentoring' | 'Group Squad';
  }) => void;
}

export const ProgramsView: React.FC<ProgramsViewProps> = ({
  activeProgramId,
  onSelectProgram,
  onStartBookingWithPreset,
}) => {
  const [bodyweightKg, setBodyweightKg] = useState<number>(82);
  const [twoKmMinutes, setTwoKmMinutes] = useState<number>(6);
  const [twoKmSeconds, setTwoKmSeconds] = useState<number>(50);
  const [tierMultiplier, setTierMultiplier] = useState<'junior' | 'senior'>('senior');

  const selectedProgram =
    TRAINING_PROGRAMS.find((p) => p.id === activeProgramId) || TRAINING_PROGRAMS[0];

  const totalTwoKmSeconds = Math.max(240, twoKmMinutes * 60 + twoKmSeconds);
  const masMetersPerSec = 2000 / totalTwoKmSeconds;
  const eurofit15sDistance = masMetersPerSec * 1.15 * 15;
  const trapBarTargetKg =
    bodyweightKg * (tierMultiplier === 'senior' ? 2.15 : 1.65);
  const soleusTargetKg = bodyweightKg * 1.85;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header & Service Switcher Tabs */}
      <div className="space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="text-xs font-semibold text-[#FF5500] mb-1">
              2.0 Training Programs · Holden Hill &amp; North-East Turf
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Football Conditioning &amp; Skill Development Programs
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
              Choose a program tab below to view the 8-week schedule, outcomes, and target benchmarks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/80 rounded-xl self-start">
            {TRAINING_PROGRAMS.map((prog) => (
              <button
                key={prog.id}
                type="button"
                onClick={() => onSelectProgram(prog.id)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeProgramId === prog.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {prog.id === 'senior-strength'
                  ? '2.1 Senior Pre-Season & 3RM'
                  : prog.id === 'junior-pathway'
                  ? '2.2 Junior Pathway (U14–U18)'
                  : '2.3 Bulletproof Lower-Limb'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Program Card (No Cluttered Diagrams) */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 sm:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Overview & Outcomes */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-mono font-semibold text-[#FF5500]">{selectedProgram.code}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedProgram.cadence}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedProgram.duration}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              {selectedProgram.title}
            </h2>

            <div className="text-xs sm:text-sm font-semibold text-[#2563EB]">
              Who it is for: {selectedProgram.targetGroup}
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {selectedProgram.summary}
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="text-xs font-semibold text-slate-500">
                Key On-Field Outcomes:
              </div>
              {selectedProgram.keyOutcomes.map((outcome) => (
                <div key={outcome} className="flex items-start gap-2.5 text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onStartBookingWithPreset({
                    ageGroup:
                      selectedProgram.id === 'junior-pathway'
                        ? 'U16 (15–16 yrs)'
                        : 'Senior Amateur / SANFL (18+)',
                    primaryGoal:
                      selectedProgram.id === 'junior-pathway'
                        ? 'Drop-Punt Kicking Distance & Biomechanics'
                        : selectedProgram.id === 'bulletproof-limb'
                        ? 'Bulletproof Calf / Hamstring Resilience'
                        : '3RM Maximal Strength & Contested Power',
                    sessionType: '3RM & Movement Screening',
                  })
                }
                className="px-5 py-3 rounded-lg bg-[#FF5500] hover:bg-[#E04800] text-white text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Book Trial Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  onStartBookingWithPreset({
                    ageGroup:
                      selectedProgram.id === 'junior-pathway'
                        ? 'U16 (15–16 yrs)'
                        : 'Senior Amateur / SANFL (18+)',
                    primaryGoal:
                      selectedProgram.id === 'junior-pathway'
                        ? 'Drop-Punt Kicking Distance & Biomechanics'
                        : '3RM Maximal Strength & Contested Power',
                    sessionType: '1-on-1 Mentoring',
                  })
                }
                className="px-4 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Book 1-on-1 Mentoring
              </button>
            </div>
          </div>

          {/* Right Column: 8-Week Phases & Tracked Metrics */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Layers className="w-4 h-4 text-[#2563EB]" />
                <span>8-Week Block Structure</span>
              </div>
              <div className="space-y-3">
                {selectedProgram.curriculumBlocks.map((block) => (
                  <div
                    key={block.phase}
                    className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1"
                  >
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      {block.phase}
                    </div>
                    <div className="text-xs font-medium text-[#FF5500]">{block.focus}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{block.details}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-2.5">
              <div className="text-xs font-semibold text-slate-500">
                Metrics Tracked (Week 1 vs. Week 8)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedProgram.metricsTracked.map((metric) => (
                  <div
                    key={metric}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800"
                  >
                    {metric}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Pre-Season 3RM & MAS Target Calculator */}
      <div className="rounded-xl bg-slate-900 text-white p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF5500]">
              <Calculator className="w-4 h-4" />
              <span>BENCHMARK CALCULATOR</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-white">
              Check Your Personal 3RM &amp; MAS Running Targets
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Enter your bodyweight and 2km time-trial result to calculate your training targets.
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => setTierMultiplier('senior')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    tierMultiplier === 'senior'
                      ? 'bg-[#FF5500] text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Senior (18+)
                </button>
                <button
                  type="button"
                  onClick={() => setTierMultiplier('junior')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    tierMultiplier === 'junior'
                      ? 'bg-[#2563EB] text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Junior (U14–U17)
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    min={40}
                    max={130}
                    value={bodyweightKg}
                    onChange={(e) => setBodyweightKg(Math.max(40, Number(e.target.value) || 40))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm tabular-nums focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">2km Mins</label>
                  <input
                    type="number"
                    min={5}
                    max={12}
                    value={twoKmMinutes}
                    onChange={(e) => setTwoKmMinutes(Math.max(5, Number(e.target.value) || 6))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm tabular-nums focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">2km Secs</label>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={twoKmSeconds}
                    onChange={(e) =>
                      setTwoKmSeconds(Math.min(59, Math.max(0, Number(e.target.value) || 0)))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm tabular-nums focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono tabular-nums">
            <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
              <div className="text-xs text-slate-400">100% MAS SPEED</div>
              <div className="text-2xl font-bold text-white">
                {masMetersPerSec.toFixed(2)} <span className="text-xs text-slate-400">m/s</span>
              </div>
              <div className="text-xs text-[#FF5500]">
                15s Cone Target: {eurofit15sDistance.toFixed(1)}m
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
              <div className="text-xs text-slate-400">TRAP-BAR 3RM TARGET</div>
              <div className="text-2xl font-bold text-white">
                {trapBarTargetKg.toFixed(1)} <span className="text-xs text-slate-400">kg</span>
              </div>
              <div className="text-xs text-slate-400">
                {tierMultiplier === 'senior' ? '2.15x Bodyweight' : '1.65x Bodyweight'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
              <div className="text-xs text-slate-400">SOLEUS CALF TARGET</div>
              <div className="text-2xl font-bold text-white">
                {soleusTargetKg.toFixed(1)} <span className="text-xs text-slate-400">kg</span>
              </div>
              <div className="text-xs text-slate-400">1.85x BW Seated Push</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
