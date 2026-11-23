import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Download, MapPin } from 'lucide-react';
import { CalendarSlotOption, INITIAL_CALENDAR_SLOTS } from '../data/clinicData';
import { downloadBookingIcs } from '../utils/downloads';

export interface ConfirmedBooking {
  id: string;
  playerName: string;
  contactEmailOrPhone: string;
  ageGroup: string;
  club: string;
  primaryGoal: string;
  slot: CalendarSlotOption;
  createdAt: string;
}

interface BookingAssessmentViewProps {
  presetAgeGroup?: string;
  presetPrimaryGoal?: string;
  presetSessionType?: '3RM & Movement Screening' | '1-on-1 Mentoring' | 'Group Squad';
}

const STORAGE_KEY = 'northern_edge_footy_bookings_v1';

export const BookingAssessmentView: React.FC<BookingAssessmentViewProps> = ({
  presetAgeGroup,
  presetPrimaryGoal,
  presetSessionType,
}) => {
  const [sessionFilter, setSessionFilter] = useState<
    'ALL' | '3RM & Movement Screening' | '1-on-1 Mentoring' | 'Group Squad'
  >(presetSessionType || 'ALL');

  const [slots, setSlots] = useState<CalendarSlotOption[]>(INITIAL_CALENDAR_SLOTS);
  const [selectedSlotId, setSelectedSlotId] = useState<string>(INITIAL_CALENDAR_SLOTS[4].id);

  const [playerName, setPlayerName] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>('');
  const [ageGroup, setAgeGroup] = useState<string>(
    presetAgeGroup || 'Senior Amateur / SANFL (18+)'
  );
  const [club, setClub] = useState<string>('Tea Tree Gully District FC');
  const [primaryGoal, setPrimaryGoal] = useState<string>(
    presetPrimaryGoal || 'Pre-Season 2km Tank & Repeat Speed'
  );

  const [formError, setFormError] = useState<string>('');
  const [confirmedBookings, setConfirmedBookings] = useState<ConfirmedBooking[]>([]);
  const [latestConfirmation, setLatestConfirmation] = useState<ConfirmedBooking | null>(null);

  useEffect(() => {
    if (presetAgeGroup) setAgeGroup(presetAgeGroup);
    if (presetPrimaryGoal) setPrimaryGoal(presetPrimaryGoal);
    if (presetSessionType) {
      setSessionFilter(presetSessionType);
      const matchingSlot = slots.find(
        (s) => s.sessionType === presetSessionType && s.spotsAvailable > 0
      );
      if (matchingSlot) setSelectedSlotId(matchingSlot.id);
    }
  }, [presetAgeGroup, presetPrimaryGoal, presetSessionType]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: ConfirmedBooking[] = JSON.parse(saved);
        setConfirmedBookings(parsed);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const filteredSlots =
    sessionFilter === 'ALL'
      ? slots
      : slots.filter((s) => s.sessionType === sessionFilter);

  const selectedSlot =
    slots.find((s) => s.id === selectedSlotId) || filteredSlots[0] || slots[0];

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setFormError('Please enter the Player or Parent full name.');
      return;
    }
    if (!contactInfo.trim() || contactInfo.trim().length < 6) {
      setFormError('Please enter a valid mobile number or email.');
      return;
    }
    if (!club.trim()) {
      setFormError('Please enter your current football club or school.');
      return;
    }
    if (!selectedSlot || selectedSlot.spotsAvailable <= 0) {
      setFormError('Please select an available calendar time slot.');
      return;
    }

    setFormError('');

    const newBooking: ConfirmedBooking = {
      id: `NEF-${Date.now().toString().slice(-5)}`,
      playerName: playerName.trim(),
      contactEmailOrPhone: contactInfo.trim(),
      ageGroup,
      club: club.trim(),
      primaryGoal,
      slot: selectedSlot,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedBookings = [newBooking, ...confirmedBookings];
    setConfirmedBookings(updatedBookings);
    setLatestConfirmation(newBooking);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookings));
    } catch {
      // ignore storage errors
    }

    setSlots((prev) =>
      prev.map((s) =>
        s.id === selectedSlot.id
          ? { ...s, spotsAvailable: Math.max(0, s.spotsAvailable - 1) }
          : s
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <div className="text-xs font-semibold text-[#FF5500] mb-1">
          5.0 Book a Trial Assessment &amp; Session
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          Select a Time Slot &amp; Complete Your 4-Field Intake
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
          Choose an available screening, 1-on-1 mentoring, or group squad time slot on the left and enter your details on the right.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Clean Online Calendar Selector */}
        <section className="lg:col-span-7 rounded-xl bg-white border border-slate-200 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#FF5500]" />
              <h2 className="font-display text-xl font-bold text-slate-900">
                1. Choose a Calendar Time Slot
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {(
                [
                  { id: 'ALL', label: 'All' },
                  { id: '3RM & Movement Screening', label: '3RM Screen' },
                  { id: '1-on-1 Mentoring', label: '1-on-1' },
                  { id: 'Group Squad', label: 'Squad' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSessionFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    sessionFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredSlots.map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;
              const isFull = slot.spotsAvailable <= 0;
              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={isFull}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`text-left p-4 rounded-xl border transition-colors flex flex-col justify-between space-y-2.5 ${
                    isFull
                      ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'border-[#FF5500] bg-orange-50/40 ring-1 ring-[#FF5500] cursor-pointer'
                      : 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">
                        {slot.dayLabel}, {slot.dateShort}
                      </span>
                      <span
                        className={
                          isFull
                            ? 'text-red-600 font-semibold'
                            : 'text-[#2563EB] font-medium'
                        }
                      >
                        {isFull ? 'Full' : `${slot.spotsAvailable} left`}
                      </span>
                    </div>

                    <div className="font-mono text-sm font-bold text-slate-900 tabular-nums flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#FF5500]" />
                      <span>{slot.time}</span>
                    </div>

                    <div className="text-xs font-semibold text-[#FF5500]">
                      {slot.sessionType}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    Coach: {slot.coach}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-600">
            <MapPin className="w-4 h-4 text-[#FF5500] shrink-0" />
            <span>
              Unit 4, 560 North East Rd, Holden Hill SA 5088 · Free On-Site Parking
            </span>
          </div>
        </section>

        {/* Right Column: Clean 4-Field Intake Form */}
        <section className="lg:col-span-5 rounded-xl bg-white border border-slate-200 p-6 space-y-5">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="font-display text-xl font-bold text-slate-900">
              2. Athlete Intake Details
            </h2>
            {selectedSlot && (
              <p className="text-xs text-[#2563EB] font-medium mt-1">
                Selected: {selectedSlot.dayLabel} {selectedSlot.dateShort} ({selectedSlot.time}) ·{' '}
                {selectedSlot.sessionType}
              </p>
            )}
          </div>

          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                1. Player or Parent Name *
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="e.g. Lachlan Dawson"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile or Email (for Confirmation) *
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="0412 345 678 or email@domain.com.au"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                2. Age Group *
              </label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#FF5500]"
              >
                <option value="U14 (12–14 yrs)">U14 Pathway (12–14 yrs)</option>
                <option value="U16 (15–16 yrs)">U16 Pathway (15–16 yrs)</option>
                <option value="U18 / Colts (17–18 yrs)">U18 / Colts (17–18 yrs)</option>
                <option value="Senior Amateur / SANFL (18+)">
                  Senior Amateur / SANFL (18+)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                3. Local Club or School *
              </label>
              <input
                type="text"
                list="adelaide-northeast-clubs"
                value={club}
                onChange={(e) => setClub(e.target.value)}
                placeholder="e.g. Tea Tree Gully, Modbury, Golden Grove..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5500]"
              />
              <datalist id="adelaide-northeast-clubs">
                <option value="Tea Tree Gully District FC" />
                <option value="Modbury Hawks FC" />
                <option value="Golden Grove FC" />
                <option value="Norwood FC (SANFL)" />
                <option value="Payneham Norwood Union FC" />
                <option value="Hope Valley FC" />
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                4. Primary Performance Goal *
              </label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#FF5500]"
              >
                <option value="Pre-Season 2km Tank & Repeat Speed">
                  Pre-Season 2km Tank &amp; Repeat Speed (MAS)
                </option>
                <option value="3RM Maximal Strength & Contested Power">
                  3RM Maximal Strength &amp; Contested Power
                </option>
                <option value="Drop-Punt Kicking Distance & Biomechanics">
                  Drop-Punt Kicking Distance &amp; Biomechanics
                </option>
                <option value="Bulletproof Calf / Hamstring Resilience">
                  Bulletproof Calf / Hamstring Resilience
                </option>
              </select>
            </div>

            {formError && <div className="text-xs text-red-600 font-medium">{formError}</div>}

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-lg bg-[#FF5500] hover:bg-[#E04800] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Confirm Booking ({selectedSlot.dateShort} · {selectedSlot.time.split('–')[0].trim()})
            </button>
          </form>

          {latestConfirmation && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs text-slate-700">
                  <div className="font-bold text-emerald-800">
                    Booking Confirmed · Ref #{latestConfirmation.id}
                  </div>
                  <div className="font-semibold text-slate-900">
                    {latestConfirmation.playerName} ({latestConfirmation.ageGroup})
                  </div>
                  <div>
                    {latestConfirmation.slot.dayLabel}, {latestConfirmation.slot.dateShort} at{' '}
                    {latestConfirmation.slot.time}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  downloadBookingIcs({
                    playerName: latestConfirmation.playerName,
                    ageGroup: latestConfirmation.ageGroup,
                    club: latestConfirmation.club,
                    primaryGoal: latestConfirmation.primaryGoal,
                    dateIso: latestConfirmation.slot.dateIso,
                    timeRange: latestConfirmation.slot.time,
                    sessionType: latestConfirmation.slot.sessionType,
                    coach: latestConfirmation.slot.coach,
                    bay: latestConfirmation.slot.bay,
                  })
                }
                className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Add to Calendar (.ICS)</span>
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
