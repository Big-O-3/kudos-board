import './FilterButtons.css'

// Filter options. `value` is what we match/sort on; `label` is the display text.
const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'recent', label: 'Recent' },
  { value: 'celebration', label: 'Celebration' },
  { value: 'thank you', label: 'Thank You' },
  { value: 'inspiration', label: 'Inspiration' },
]

// Props:
//   selectedCategory — the active filter value
//   onFilterChange(value) — called when a filter button is clicked
function FilterButtons({ selectedCategory, onFilterChange }) {
  return (
    <div className="filter-buttons" role="group" aria-label="Filter boards by category">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={
            'filter-buttons__button' +
            (selectedCategory === filter.value ? ' filter-buttons__button--active' : '')
          }
          aria-pressed={selectedCategory === filter.value}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

export default FilterButtons
