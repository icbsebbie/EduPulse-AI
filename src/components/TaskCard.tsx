import { useState } from 'react'
import type { Task, Priority } from '../lib/database.types'
import styles from './TaskCard.module.css'

interface Props {
  task: Task
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>) => void
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high: { label: 'High', className: styles.priorityHigh },
  medium: { label: 'Medium', className: styles.priorityMedium },
  low: { label: 'Low', className: styles.priorityLow },
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.floor((date.getTime() - today.getTime()) / 86400000)

  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isOverdue(dateStr: string): boolean {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

export default function TaskCard({ task, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDesc, setEditDesc] = useState(task.description ?? '')
  const [deleting, setDeleting] = useState(false)

  const saveEdit = () => {
    const trimmed = editTitle.trim()
    if (!trimmed) return
    onUpdate(task.id, { title: trimmed, description: editDesc.trim() || null })
    setEditing(false)
  }

  const cancelEdit = () => {
    setEditTitle(task.title)
    setEditDesc(task.description ?? '')
    setEditing(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    onDelete(task.id)
  }

  const overdue = !task.completed && task.due_date && isOverdue(task.due_date)
  const cfg = priorityConfig[task.priority as Priority]

  return (
    <li className={`${styles.card} ${task.completed ? styles.cardCompleted : ''} ${deleting ? styles.cardDeleting : ''}`}>
      <button
        className={`${styles.checkbox} ${task.completed ? styles.checkboxChecked : ''}`}
        onClick={() => onToggle(task.id, !task.completed)}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className={styles.body}>
        {editing ? (
          <div className={styles.editForm}>
            <input
              className={styles.editTitle}
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
              autoFocus
            />
            <textarea
              className={styles.editDesc}
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
              placeholder="Add a description…"
              rows={2}
            />
            <div className={styles.editActions}>
              <button className={styles.editSave} onClick={saveEdit}>Save</button>
              <button className={styles.editCancel} onClick={cancelEdit}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <p className={`${styles.title} ${task.completed ? styles.titleCompleted : ''}`}>
              {task.title}
            </p>
            {task.description && (
              <p className={styles.description}>{task.description}</p>
            )}
            <div className={styles.meta}>
              <span className={`${styles.priority} ${cfg.className}`}>{cfg.label}</span>
              {task.due_date && (
                <span className={`${styles.dueDate} ${overdue ? styles.dueDateOverdue : ''}`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M4 1v2M8 1v2M1 5h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  {formatDate(task.due_date)}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {!editing && (
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={() => setEditing(true)}
            aria-label="Edit task"
            title="Edit"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={handleDelete}
            aria-label="Delete task"
            title="Delete"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.8 7.5h6.4L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </li>
  )
}
