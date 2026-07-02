import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, Trophy, Flame, LayoutGrid, Heart, MessageCircle, TrendingUp } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'
import { getStats } from '../api'
import { CATEGORY_LABELS } from '../categories'

// Small labelled stat tile.
function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon size={15} />
        <span className="text-[11px] font-semibold uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-3xl font-bold text-card-foreground">{value}</span>
    </div>
  )
}

// Horizontal bar: label + proportional fill + value. max drives the scale.
function Bar({ label, value, max, sub }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 flex-shrink-0 truncate text-xs text-muted-foreground" title={label}>
        {label}
      </span>
      <div className="h-6 flex-1 overflow-hidden rounded-lg bg-secondary">
        <div
          className="flex h-full items-center rounded-lg bg-primary px-2 text-[11px] font-semibold text-primary-foreground transition-all duration-500"
          style={{ width: `${Math.max(pct, value > 0 ? 8 : 0)}%` }}
        >
          {value > 0 && (sub ?? value)}
        </div>
      </div>
    </div>
  )
}

function StatsPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    getStats()
      .then((data) => active && setStats(data))
      .catch((err) => active && setError(err.message))
    return () => {
      active = false
    }
  }, [])

  const categoryEntries = stats ? Object.entries(stats.boardsByCategory) : []
  const maxCategory = Math.max(1, ...categoryEntries.map(([, n]) => n))
  const maxActivity = stats ? Math.max(1, ...stats.activity.map((a) => a.count)) : 1

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[1126px] px-6 py-8">
          <button
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={14} />
            Back to boards
          </button>

          <div className="mb-8 flex items-center gap-2">
            <TrendingUp size={22} className="text-primary" />
            <h1 className="text-2xl font-bold sm:text-3xl">Board Analytics</h1>
          </div>

          {error ? (
            <p className="py-20 text-center text-sm text-red-500">{error}</p>
          ) : !stats ? (
            <div className="flex justify-center py-20">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {/* Totals */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatTile icon={LayoutGrid} label="Boards" value={stats.totals.boards} />
                <StatTile icon={MessageCircle} label="Cards" value={stats.totals.cards} />
                <StatTile icon={Heart} label="Upvotes" value={stats.totals.upvotes} />
                <StatTile
                  icon={LayoutGrid}
                  label="Avg cards/board"
                  value={stats.totals.avgCardsPerBoard}
                />
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Boards by category */}
                <section className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="mb-5 text-sm font-semibold text-card-foreground">
                    Boards by Category
                  </h2>
                  <div className="flex flex-col gap-3">
                    {categoryEntries.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No boards yet.</p>
                    ) : (
                      categoryEntries.map(([cat, n]) => (
                        <Bar
                          key={cat}
                          label={CATEGORY_LABELS[cat] || cat}
                          value={n}
                          max={maxCategory}
                        />
                      ))
                    )}
                  </div>
                </section>

                {/* Activity (last 14 days) */}
                <section className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="mb-5 text-sm font-semibold text-card-foreground">
                    Cards Created (last 14 days)
                  </h2>
                  <div className="flex h-40 items-end gap-1">
                    {stats.activity.map((a) => (
                      <div
                        key={a.date}
                        className="group flex flex-1 flex-col items-center justify-end"
                        title={`${a.date}: ${a.count} card${a.count !== 1 ? 's' : ''}`}
                      >
                        <div
                          className="w-full rounded-t bg-primary transition-all duration-500 group-hover:opacity-80"
                          style={{ height: `${(a.count / maxActivity) * 100}%`, minHeight: a.count > 0 ? '4px' : '0' }}
                        />
                        <span className="mt-1 text-[9px] text-muted-foreground">
                          {a.date.slice(8)}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Trending cards */}
                <section className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold text-card-foreground">
                    <Flame size={15} className="text-primary" />
                    Trending Cards
                  </h2>
                  <ol className="flex flex-col gap-3">
                    {stats.trendingCards.map((c, i) => (
                      <li
                        key={c.id}
                        className="flex cursor-pointer items-center gap-3 rounded-xl bg-secondary px-3 py-2 transition-colors hover:bg-primary/10"
                        onClick={() => navigate(`/boards/${c.boardId}`)}
                      >
                        <span className="text-sm font-bold text-primary">#{i + 1}</span>
                        <span className="min-w-0 flex-1 truncate text-sm text-card-foreground">
                          {c.message}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Heart size={11} /> {c.upvotes}
                        </span>
                      </li>
                    ))}
                    {stats.trendingCards.length === 0 && (
                      <p className="text-xs text-muted-foreground">No cards yet.</p>
                    )}
                  </ol>
                </section>

                {/* Top authors */}
                <section className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold text-card-foreground">
                    <Trophy size={15} className="text-primary" />
                    Top Authors (by upvotes)
                  </h2>
                  <div className="flex flex-col gap-3">
                    {stats.topAuthors.map((a) => (
                      <Bar
                        key={a.author}
                        label={a.author}
                        value={a.upvotes}
                        max={Math.max(1, stats.topAuthors[0]?.upvotes || 1)}
                      />
                    ))}
                    {stats.topAuthors.length === 0 && (
                      <p className="text-xs text-muted-foreground">No authors yet.</p>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default StatsPage
