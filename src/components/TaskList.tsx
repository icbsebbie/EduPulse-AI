import type { Task } from '../lib/database.types'
import type { Filter } from '../App'
import TaskCard from './TaskCard'
import styles from './TaskList.module.css'

interface Props {
  tasks: Task[]
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>) => void
  filter: Filter
}

export default function TaskList({ tasks, onToggle, onDelete, onUpdate, filter }: Props) {
  if (tasks.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon} aria-hidden="true">
          {filter === 'completed' ? '✓' : filter === 'active' ? '○' : '□'}
        </div>
        <p className={styles.emptyTitle}>
          {filter === 'completed' ? 'No completed tasks yet' :
           filter === 'active' ? 'No active tasks' :
           'No tasks yet'}
        </p>
        <p className={styles.emptySubtext}>
          {filter === 'all' ? 'Add a task to get started.' : 'Tasks will appear here.'}
        </p>
      </div>
    )
  }

  return (
    <ul className={styles.list}>
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  )
}
