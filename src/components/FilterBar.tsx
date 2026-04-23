import type { Filter, SortBy } from '../App'
import type { Priority } from '../lib/database.types'
import styles from './FilterBar.module.css'

interface Props {
  filter: Filter
  setFilter: (f: Filter) => void
  sortBy: SortBy
  setSortBy: (s: SortBy) => void
  priorityFilter: Priority | 'all'
  setPriorityFilter: (p: Priority | 'all') => void
  counts: { all: number; active: number; completed: number }
}

const filterLabels: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Done' },
]

export default function FilterBar({ filter, setFilter, sortBy, setSortBy, priorityFilter, setPriorityFilter, counts }: Props) {
  return (
    <div className={styles.bar}>
      <div className={styles.tabs}>
        {filterLabels.map(({ value, label }) => (
          <button
            key={value}
            className={`${styles.tab} ${filter === value ? styles.tabActive : ''}`}
            onClick={() => setFilter(value)}
          >
            {label}
            <span className={`${styles.badge} ${filter === value ? styles.badgeActive : ''}`}>
              {counts[value]}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        <div className={styles.selectWrap}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={styles.selectIcon} aria-hidden="true">
            <path d="M2 4h10M4 7h6M6 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <select
            className={styles.select}
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as Priority | 'all')}
            aria-label="Filter by priority"
          >
            <option value="all">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className={styles.selectWrap}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={styles.selectIcon} aria-hidden="true">
            <path d="M7 2v10M4 9l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <select
            className={styles.select}
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortBy)}
            aria-label="Sort tasks"
          >
            <option value="created_at">Newest first</option>
            <option value="priority">By priority</option>
            <option value="due_date">By due date</option>
          </select>
        </div>
      </div>
    </div>
  )
}
