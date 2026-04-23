import styles from './Header.module.css'

interface Props {
  onAddTask: () => void
}

export default function Header({ onAddTask }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="13" height="2" rx="1" fill="currentColor" opacity="0.3" />
            <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" />
            <rect x="3" y="17" width="10" height="2" rx="1" fill="currentColor" opacity="0.6" />
            <circle cx="20" cy="6" r="3" fill="#1c7ed6" />
          </svg>
          <span className={styles.logo}>TaskFlow</span>
        </div>
        <button className={styles.addBtn} onClick={onAddTask}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          New task
        </button>
      </div>
    </header>
  )
}
