import { useState } from 'react'
import type { Priority } from '../lib/database.types'
import styles from './TaskForm.module.css'

interface Props {
  onSubmit: (title: string, description: string, priority: Priority, dueDate: string | null) => Promise<void>
  onCancel: () => void
}

export default function TaskForm({ onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    setSubmitting(true)
    await onSubmit(trimmed, description, priority, dueDate || null)
    setSubmitting(false)
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>New task</h2>
        <button className={styles.closeBtn} onClick={onCancel} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="task-title">Title</label>
          <input
            id="task-title"
            className={styles.input}
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="task-desc">Description <span className={styles.optional}>(optional)</span></label>
          <textarea
            id="task-desc"
            className={styles.textarea}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add more details…"
            rows={3}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="task-priority">Priority</label>
            <div className={styles.priorityGroup}>
              {(['low', 'medium', 'high'] as Priority[]).map(p => (
                <button
                  key={p}
                  type="button"
                  className={`${styles.priorityBtn} ${styles[`priority_${p}`]} ${priority === p ? styles.priorityBtnActive : ''}`}
                  onClick={() => setPriority(p)}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="task-due">Due date <span className={styles.optional}>(optional)</span></label>
            <input
              id="task-due"
              className={styles.input}
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn} disabled={submitting || !title.trim()}>
            {submitting ? 'Adding…' : 'Add task'}
          </button>
        </div>
      </form>
    </div>
  )
}
