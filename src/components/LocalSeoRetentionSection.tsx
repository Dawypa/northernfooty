import React, { useState } from 'react';
import { Activity, Download, MapPin, Share2 } from 'lucide-react';
import {
  INSTAGRAM_REEL_HIGHLIGHTS,
  STRAVA_COMMUNITY_LEADERBOARD,
  SUBURB_PROXIMITY_LIST,
} from '../data/clinicData';
import { downloadOffSeasonBlueprintPdf } from '../utils/downloads';

export const LocalSeoRetentionSection: React.FC = () => {
  const [communityTab, setCommunityTab] = useState<'strava' | 'instagram'>('strava');
  const [quickEmail, setQuickEmail] = useState<string>('');
  const [quickSent, setQuickSent] = useState<boolean>(false);

  const handleQuickPdfDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEmail.trim() || !quickEmail.includes('@')) return;
    setQuickSent(true);
    downloadOffSeasonBlueprintPdf(quickEmail.split('@')[0], 'North-East Adelaide Athlete');
  };

  return (
    <section className="border-t border-slate-200 bg-slate-100/70 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-[#FF5500] mb-1">
              North-East Adelaide Location &amp; Community
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Holden Hill Facility Map &amp; Local Run Club
            </h2>
          </div>

          <form
            onSubmit={handleQuickPdfDelivery}
            className="flex flex-wrap sm:flex-nowrap items-center gap-2"
          >
            <input
              type="email"
              required
              value={quickEmail}
              onChange={(e) => setQuickEmail(e.target.value)}
              placeholder="Email for Free 6-Week Running PDF..."
              className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5500] w-60"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#FF5500] hover:bg-[#E04800] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{quickSent ? 'PDF Sent' : 'Get Free PDF'}</span>
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Embedded Map Pin + Suburb List */}
          <div className="lg:col-span-6 rounded-xl bg-white border border-slate-200 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF5500]" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Unit 4, 560 North East Road, Holden Hill SA 5088
                    </h3>
                  </div>
                </div>
              </div>

              <div className="relative h-56 w-full bg-slate-100 border-b border-slate-200">
                <iframe
                  title="Northern Edge Footy North-East Adelaide Location Map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=138.6400%2C-34.8650%2C138.7100%2C-34.8200&layer=mapnik&marker=-34.8439%2C138.6728"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="p-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
              {SUBURB_PROXIMITY_LIST.map((item, idx) => (
                <React.Fragment key={item.suburb}>
                  <span>
                    <strong className="text-slate-800">{item.suburb}:</strong> {item.driveTime}
                  </span>
                  {idx < SUBURB_PROXIMITY_LIST.length - 1 && (
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Column: Strava & Instagram Feed */}
          <div className="lg:col-span-6 rounded-xl bg-white border border-slate-200 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Community Feed
                </h3>

                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setCommunityTab('strava')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      communityTab === 'strava'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Strava Run Club
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommunityTab('instagram')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      communityTab === 'instagram'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Instagram
                  </button>
                </div>
              </div>

              {communityTab === 'strava' ? (
                <div className="divide-y divide-slate-100">
                  {STRAVA_COMMUNITY_LEADERBOARD.map((row) => (
                    <div
                      key={row.athlete}
                      className="py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <Activity className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-900">{row.athlete}</span>
                          <span className="text-slate-500"> · {row.session}</span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#2563EB] tabular-nums shrink-0">
                        {row.metric}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {INSTAGRAM_REEL_HIGHLIGHTS.map((post) => (
                    <div key={post.id} className="py-2.5 space-y-0.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-[#2563EB] flex items-center gap-1">
                          <Share2 className="w-3 h-3" />
                          {post.handle}
                        </span>
                        <span>{post.postedAgo}</span>
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-900">
                        {post.title}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
              Serving Tea Tree Gully, Modbury, Golden Grove, Campbelltown &amp; Norwood.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
