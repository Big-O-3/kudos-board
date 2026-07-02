import { Link } from 'react-router-dom'
import { Sun, Moon, TrendingUp } from 'lucide-react'
import { useTheme } from '../theme-context'

function Header() {
  const { isDark, toggle } = useTheme()
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1126px] items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-75"
        >
          <span className="text-[17px] font-semibold tracking-tight text-foreground">
            Kudos Board
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/stats"
            className="flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground shadow-sm transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
          >
            <TrendingUp size={14} />
            <span className="hidden sm:inline">Analytics</span>
          </Link>
          <button
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground shadow-sm transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
