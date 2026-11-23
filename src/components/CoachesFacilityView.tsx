import React, { useState } from 'react';
import { ArrowRight, Award, Calendar, CheckCircle2, MapPin } from 'lucide-react';
import {
  COACH_PROFILES,
  PLAYER_CASE_STUDIES,
  PRICING_TIERS,
  TimetableSlot,
  WEEKLY_TIMETABLE,
} from '../data/clinicData';

interface CoachesFacilityViewProps {
  onBookFromTimetableOrPricing: (preset: {
    ageGroup?: string;
    primaryGoal?: string;
    sessionType?: '3RM & Movement Screening' | '1-on-1 Mentoring' | 'Group Squad';
  }) => void;
}

export const CoachesFacilityView: React.FC<CoachesFacilityViewProps> = ({
  onBookFromTimetableOrPricing,
}) => {
  const [timetableFilter, setTimetableFilter] = useState<
    'ALL' | 'Group Squad' | '1-on-1 Mentoring' | '3RM & Movement Screening'
  >('ALL');

  const filteredTimetable: TimetableSlot[] =
    timetableFilter === 'ALL'
      ? WEEKLY_TIMETABLE
      : WEEKLY_TIMETABLE.filter((slot) => slot.sessionType === timetableFilter);

  const facilityZones = [
    {
      zone: 'Zone A',
      title: '30m Indoor Mondo Sprint Track & Kicking Net Bay',
      specs: 'Laser Timing Gates (5m/10m/20m/30m) · 240fps High-Speed Video Cameras',
      description:
        'Year-round acceleration, agility cuts, and drop-punt kicking biomechanics unaffected by wet winter evenings.',
    },
    {
      zone: 'Zone B',
      title: '6x Heavy S&C Combo Racks & Power Bays',
      specs: 'Calibrated Bumper Plates · Hex Trap Bars · Velocity Tracking Tethers',
      description:
        'Purpose-built for Senior 3RM Strength and Junior Maturation squads with direct turf transfer.',
    },
    {
      zone: 'Zone C',
      title: 'Force Plate & Lower-Limb Resilience Lab',
      specs: 'Uniaxial Force Plates · Seated 90° Soleus Rig · Nordic Hamstring Testing',
      description:
        'Used in Week 1 and Week 8 to measure left-to-right limb symmetry, hamstring torque, and calf force capacity.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* SECTION 1: COACHING CREDENTIALS */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-semibold text-[#FF5500] mb-1">
            3.0 Coaches, Facility &amp; Results
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
            Human Movement Graduates &amp; Specialist Coaches
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
            Every session is programmed and coached on the floor by university-qualified exercise scientists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {COACH_PROFILES.map((coach) => (
            <div
              key={coach.id}
              className="rounded-xl bg-white border border-slate-200 p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold text-[#FF5500]">{coach.role}</div>
                  <h2 className="font-display text-xl font-bold text-slate-900 mt-0.5">
                    {coach.name}
                  </h2>
                  <div className="text-xs font-medium text-[#2563EB] mt-0.5">{coach.degree}</div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{coach.bio}</p>

                <div className="space-y-1.5 pt-2">
                  {coach.accreditations.map((acc) => (
                    <div key={acc} className="flex items-start gap-2 text-xs text-slate-700">
                      <Award className="w-3.5 h-3.5 text-[#FF5500] shrink-0 mt-0.5" />
                      <span>{acc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                <strong className="text-slate-700">Specialty:</strong> {coach.specialty}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: WEEKLY TIMETABLE */}
      <section className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Weekly Training Timetable
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Filter by session type and select any slot to reserve your spot.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start">
            {(
              [
                { id: 'ALL', label: 'All Sessions' },
                { id: 'Group Squad', label: 'Group Squads' },
                { id: '1-on-1 Mentoring', label: '1-on-1 Mentoring' },
                { id: '3RM & Movement Screening', label: 'Trial Screenings' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTimetableFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  timetableFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="py-3.5 px-4">Day &amp; Time</th>
                  <th className="py-3.5 px-4">Session</th>
                  <th className="py-3.5 px-4">Age · Format</th>
                  <th className="py-3.5 px-4">Coach</th>
                  <th className="py-3.5 px-4 text-right">Spots</th>
                  <th className="py-3.5 px-4 text-right">Book</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredTimetable.map((slot) => (
                  <tr key={slot.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{slot.day}</div>
                      <div className="text-xs font-mono text-slate-500 tabular-nums">
                        {slot.time}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {slot.programTitle}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600">
                      <span>{slot.ageBracket}</span>
                      <span aria-hidden="true"> · </span>
                      <span className="text-[#2563EB] font-medium">{slot.sessionType}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600">
                      {slot.coach}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right font-mono text-xs tabular-nums">
                      <span className="text-[#FF5500] font-semibold">
                        {slot.spotsLeft} left
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() =>
                          onBookFromTimetableOrPricing({
                            ageGroup:
                              slot.ageBracket.includes('U14') || slot.ageBracket.includes('U16')
                                ? 'U16 (15–16 yrs)'
                                : 'Senior Amateur / SANFL (18+)',
                            sessionType: slot.sessionType,
                          })
                        }
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#FF5500] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 3: TRANSPARENT SQUAD & MENTORING PRICING */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Transparent Squad &amp; Mentoring Pricing
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Clear session rates with no hidden registration fees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier, idx) => (
            <div
              key={tier.id}
              className={`rounded-xl p-6 flex flex-col justify-between space-y-6 border ${
                idx === 1
                  ? 'bg-white border-[#FF5500] ring-1 ring-[#FF5500]'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="text-xs font-medium text-slate-500">{tier.cadence}</div>
                <h3 className="font-display text-xl font-bold text-slate-900">{tier.name}</h3>
                <div className="flex items-baseline gap-1 font-mono tabular-nums">
                  <span className="text-3xl font-bold text-slate-900">${tier.priceAud}</span>
                  <span className="text-xs text-slate-500">AUD</span>
                </div>
                <p className="text-xs text-[#2563EB] font-medium">{tier.billingNote}</p>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  {tier.inclusions.map((inc) => (
                    <div key={inc} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onBookFromTimetableOrPricing({
                    sessionType: tier.defaultSessionType,
                  })
                }
                className={`w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  idx === 1
                    ? 'bg-[#FF5500] hover:bg-[#E04800] text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>{tier.ctaLabel}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: PLAYER RESULTS & FACILITY OVERVIEW (No Floorplan Diagram) */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Player Case Studies (Week 1 vs. Week 8)
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PLAYER_CASE_STUDIES.map((cs) => (
            <div
              key={cs.id}
              className="rounded-xl bg-white border border-slate-200 p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {cs.playerName}
                  </h3>
                  <div className="text-xs text-slate-500">
                    {cs.ageAndLevel} · {cs.club}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono tabular-nums">
                  <div>
                    <div className="text-[10px] text-slate-500">2KM TIME-TRIAL</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {cs.twoKmBefore} → <span className="text-[#FF5500]">{cs.twoKmAfter}</span>
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">{cs.twoKmDelta}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 truncate">{cs.threeRmLift}</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {cs.threeRmBefore} → <span className="text-[#2563EB]">{cs.threeRmAfter}</span>
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">{cs.threeRmDelta}</div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                  “{cs.quote}”
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs text-slate-400">
                {cs.programCompleted}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Holden Hill Facility Zones (Clean 3-Card Text Summary without SVG Floorplan Diagram) */}
      <section className="space-y-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-[#FF5500]" />
          <span>Holden Hill Facility · Unit 4, 560 North East Road, Holden Hill SA 5088</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {facilityZones.map((fz) => (
            <div
              key={fz.zone}
              className="rounded-xl bg-white border border-slate-200 p-5 space-y-2"
            >
              <div className="text-xs font-mono font-semibold text-[#2563EB]">{fz.zone}</div>
              <h3 className="font-display text-lg font-bold text-slate-900">{fz.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{fz.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
