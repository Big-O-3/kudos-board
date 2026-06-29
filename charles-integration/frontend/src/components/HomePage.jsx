import { useMemo, useState } from 'react'
import Header from './Header'
import Banner from './Banner'
import Footer from './Footer'
import SearchBar from './SearchBar'
import FilterButtons from './FilterButtons'
import { mockBoards } from '../data/mockBoards'
import './HomePage.css'

function HomePage() {
  // Phase 1 uses mock data; Phase 2 replaces this with a GET /boards fetch.
  const [boards] = useState(mockBoards)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredBoards = useMemo(() => {
    let result = boards

    // Search: match boards whose title contains the query (case-insensitive).
    if (searchQuery) {
      result = result.filter((board) =>
        board.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Category filter.
    if (selectedCategory === 'recent') {
      // Sort by newest first, take the first 6. Copy first so we don't mutate state.
      result = [...result]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6)
    } else if (selectedCategory !== 'all') {
      result = result.filter((board) => board.category === selectedCategory)
    }

    return result
  }, [boards, searchQuery, selectedCategory])

  return (
    <div className="home">
      <Header />
      <Banner />
      <main className="home__content">
        <SearchBar
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
        <FilterButtons
          selectedCategory={selectedCategory}
          onFilterChange={setSelectedCategory}
        />

        {/* BoardGrid lands here in Phase 2.
            Simple list for now so search + filter are visibly testable. */}
        {filteredBoards.length > 0 ? (
          <ul className="home__board-list">
            {filteredBoards.map((board) => (
              <li key={board.id} className="home__board-item">
                {board.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="home__placeholder">No boards match your search and filter.</p>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
