import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, Loader2, X } from 'lucide-react'
import { searchGifs } from '../api'

const labelCls =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'

// Debounced GIPHY search + thumbnail picker, with a manual paste-URL fallback
// so a card can always get a GIF even if the GIPHY key is missing/banned.
// Props: selected (gif | null), onSelect(gif | null)
function GifSearch({ selected, onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState(null)
  const [manualUrl, setManualUrl] = useState('')
  const timerRef = useRef(null)

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([])
      setSearched(false)
      setError(null)
      return
    }
    setSearching(true)
    setError(null)
    try {
      setResults(await searchGifs(q))
    } catch (err) {
      setResults([])
      setError(err.message)
    } finally {
      setSearching(false)
      setSearched(true)
    }
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => doSearch(query), 500)
    return () => clearTimeout(timerRef.current)
  }, [query, doSearch])

  // Use a pasted GIF URL as the selection.
  function applyManualUrl() {
    const url = manualUrl.trim()
    if (!url) return
    onSelect({ id: `manual-${url}`, url, previewUrl: url, title: 'Pasted GIF' })
    setManualUrl('')
  }

  return (
    <div>
      <label className={labelCls}>GIF Search</label>
      <div className="relative mb-3">
        <Search
          size={13}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search GIPHY… e.g. celebrate, thank you"
          className="w-full rounded-xl border border-border bg-background py-2 pl-8 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
        />
      </div>

      {searching && (
        <div className="flex justify-center py-5">
          <Loader2 size={18} className="animate-spin text-primary" />
        </div>
      )}

      {!searching && results.length > 0 && (
        <div
          className="mb-3 grid grid-cols-3 gap-1.5 overflow-y-auto pr-0.5 sm:grid-cols-4"
          style={{ maxHeight: 200 }}
        >
          {results.map((g) => {
            const isSel = selected?.id === g.id
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => onSelect(isSel ? null : g)}
                className={`relative aspect-video overflow-hidden rounded-lg border-2 transition-all duration-150 ${
                  isSel
                    ? 'scale-[0.97] border-primary ring-2 ring-primary/30'
                    : 'border-transparent hover:border-primary/40'
                }`}
              >
                <img src={g.previewUrl} alt={g.title} className="h-full w-full object-cover" />
              </button>
            )
          })}
        </div>
      )}

      {!searching && error && (
        <p className="mb-2 text-xs text-amber-600 dark:text-amber-400">{error}</p>
      )}

      {!searching && searched && !error && results.length === 0 && (
        <p className="py-4 text-center text-xs text-muted-foreground">
          No GIFs found — try a different search.
        </p>
      )}

      {/* Manual fallback: paste any GIF/image URL directly. */}
      <div className="mb-1 flex gap-2">
        <input
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              applyManualUrl()
            }
          }}
          placeholder="…or paste a GIF URL"
          className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
        />
        <button
          type="button"
          onClick={applyManualUrl}
          className="rounded-xl bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Use
        </button>
      </div>

      {selected && (
        <div className="mt-3">
          <p className={labelCls}>Selected Preview</p>
          <div
            className="relative w-full overflow-hidden rounded-xl bg-secondary"
            style={{ aspectRatio: '16/9' }}
          >
            <img
              src={selected.url}
              alt={selected.title}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onSelect(null)}
              aria-label="Remove selected gif"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
            >
              <X size={11} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GifSearch
