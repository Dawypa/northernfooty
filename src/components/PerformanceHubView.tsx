import React, { useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Download, Mail, Search } from 'lucide-react';
import {
  AUTOMATED_EMAIL_SEQUENCE,
  BLOG_ARTICLES,
  BlogArticle,
  BlogCategory,
} from '../data/clinicData';
import { downloadOffSeasonBlueprintPdf } from '../utils/downloads';

interface PerformanceHubViewProps {
  onBookScreening: (goal?: string) => void;
}

export const PerformanceHubView: React.FC<PerformanceHubViewProps> = ({ onBookScreening }) => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticleId, setActiveArticleId] = useState<string>(BLOG_ARTICLES[0].id);

  const [leadName, setLeadName] = useState<string>('');
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadLevel, setLeadLevel] = useState<string>('Senior Amateur / SANFL (18+)');
  const [leadError, setLeadError] = useState<string>('');
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);

  const categories: BlogCategory[] = ['All', 'Strength', 'Running', 'Kicking', 'Recovery'];

  const filteredArticles = BLOG_ARTICLES.filter((article) => {
    const matchesCat = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeArticle: BlogArticle =
    BLOG_ARTICLES.find((a) => a.id === activeArticleId) ||
    filteredArticles[0] ||
    BLOG_ARTICLES[0];

  const handleLeadMagnetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim()) {
      setLeadError('Please enter the player or parent first name.');
      return;
    }
    if (!leadEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail.trim())) {
      setLeadError('Please enter a valid email address to receive the 6-Week PDF.');
      return;
    }
    setLeadError('');
    setLeadSubmitted(true);
    downloadOffSeasonBlueprintPdf(leadName, leadLevel);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {/* Header & Category Filters */}
      <div className="space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="text-xs font-semibold text-[#FF5500] mb-1">
              4.0 Footy Performance Hub
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Evidence-Based Running &amp; Injury Rehab Articles
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
              Practical conditioning guides and lower-limb protocols written by our coaching team.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="pl-9 pr-3 py-2 rounded-lg bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5500] w-full sm:w-52"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Article List + Reader Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-3">
          {filteredArticles.map((article) => {
            const isSelected = article.id === activeArticle.id;
            return (
              <button
                key={article.id}
                type="button"
                onClick={() => setActiveArticleId(article.id)}
                className={`w-full text-left p-5 rounded-xl border transition-colors cursor-pointer space-y-2 block ${
                  isSelected
                    ? 'bg-white border-[#FF5500] ring-1 ring-[#FF5500]'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="text-[#FF5500] font-semibold">{article.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.publishedDate}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.readTime}</span>
                </div>

                <h2 className="font-display text-xl font-bold text-slate-900 leading-snug">
                  {article.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                  {article.excerpt}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Column: Full Article Reader */}
        <div className="lg:col-span-7 rounded-xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="space-y-3 border-b border-slate-200 pb-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <BookOpen className="w-3.5 h-3.5 text-[#FF5500]" />
              <span className="text-[#FF5500] font-semibold">{activeArticle.category}</span>
              <span aria-hidden="true">·</span>
              <span>{activeArticle.publishedDate}</span>
              <span aria-hidden="true">·</span>
              <span>{activeArticle.readTime}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {activeArticle.title}
            </h2>

            <div className="text-xs text-slate-500">By {activeArticle.author}</div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800">
              <span className="font-semibold text-[#2563EB]">Key Takeaway: </span>
              {activeArticle.keyTakeaway}
            </div>
          </div>

          <div className="space-y-6">
            {activeArticle.contentSections.map((sec) => (
              <div key={sec.heading} className="space-y-2.5">
                <h3 className="font-display text-lg font-bold text-slate-900">{sec.heading}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{sec.body}</p>

                {sec.prescriptionTable && (
                  <div className="rounded-lg border border-slate-200 overflow-hidden mt-3">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                          <th className="py-2.5 px-3.5">Phase / Variable</th>
                          <th className="py-2.5 px-3.5">Target Prescription</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {sec.prescriptionTable.map((row) => (
                          <tr key={row.variable}>
                            <td className="py-2.5 px-3.5 font-medium text-slate-900">
                              {row.variable}
                            </td>
                            <td className="py-2.5 px-3.5 font-mono text-slate-700 tabular-nums">
                              {row.target}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-slate-600">
              Ready to benchmark your own {activeArticle.category.toLowerCase()} metrics?
            </div>
            <button
              type="button"
              onClick={() =>
                onBookScreening(
                  activeArticle.category === 'Kicking'
                    ? 'Drop-Punt Kicking Distance & Biomechanics'
                    : activeArticle.category === 'Recovery'
                    ? 'Bulletproof Calf / Hamstring Resilience'
                    : activeArticle.category === 'Running'
                    ? 'Pre-Season 2km Tank & Repeat Speed'
                    : '3RM Maximal Strength & Contested Power'
                )
              }
              className="px-4 py-2.5 rounded-lg bg-[#FF5500] hover:bg-[#E04800] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Book Trial Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* DOWNLOADABLE 6-WEEK OFF-SEASON PDF LEAD MAGNET */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-semibold text-[#FF5500]">
              Free Pre-Season Guide &amp; Automated Email Sequence
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Download the 6-Week Off-Season Running &amp; Calf Resilience PDF
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Includes our 1.2km/2km MAS speed calculator, turf interval cone charts, and 3x/week seated soleus and hamstring strengthening routine.
            </p>

            <form onSubmit={handleLeadMagnetSubmit} className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="First Name *"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5500]"
                />
                <input
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="Email Address *"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <select
                value={leadLevel}
                onChange={(e) => setLeadLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#FF5500]"
              >
                <option value="Senior Amateur / SANFL (18+)">Senior Amateur / SANFL (18+)</option>
                <option value="U18 / Colts (17–18 yrs)">U18 / Colts (17–18 yrs)</option>
                <option value="U16 Pathway (15–16 yrs)">U16 Pathway (15–16 yrs)</option>
                <option value="U14 Junior (12–14 yrs)">U14 Junior (12–14 yrs)</option>
              </select>

              {leadError && <div className="text-xs text-red-600 font-medium">{leadError}</div>}

              <button
                type="submit"
                className="px-5 py-3 rounded-lg bg-[#FF5500] hover:bg-[#E04800] text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download 6-Week PDF</span>
              </button>

              {leadSubmitted && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Your 6-Week Blueprint has downloaded and the automated coaching sequence is scheduled for{' '}
                    <strong>{leadEmail}</strong>.
                  </span>
                </div>
              )}
            </form>
          </div>

          <div className="lg:col-span-6 rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Mail className="w-4 h-4 text-[#2563EB]" />
              <span>Automated Email Delivery Sequence</span>
            </div>
            <div className="space-y-2.5">
              {AUTOMATED_EMAIL_SEQUENCE.map((item) => (
                <div
                  key={item.day}
                  className="p-3 rounded-lg bg-white border border-slate-200 space-y-0.5"
                >
                  <div className="text-xs font-mono font-semibold text-[#FF5500]">{item.day}</div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-900">
                    {item.subject}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
