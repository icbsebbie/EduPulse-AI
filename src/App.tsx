import { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase'
import type { Task, Priority } from './lib/database.types'
import styles from './App.module.css'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import FilterBar from './components/FilterBar'
import Header from './components/Header'

export type Filter = 'all' | 'active' | 'completed'
export type SortBy = 'created_at' | 'priority' | 'due_date'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [sortBy, setSortBy] = useState<SortBy>('created_at')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [showForm, setShowForm] = useState(false)

  const fetchTasks = useCallback(async () => {
    setError(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('Failed to load tasks. Please try again.')
    } else {
      setTasks((data ?? []) as Task[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTask = async (title: string, description: string, priority: Priority, dueDate: string | null) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('tasks')
      .insert({ title, description: description || null, priority, due_date: dueDate, completed: false })
      .select()
      .single()

    if (error) {
      setError('Failed to add task.')
      return
    }
    setTasks(prev => [data as Task, ...prev])
    setShowForm(false)
  }

  const toggleTask = async (id: string, completed: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('tasks')
      .update({ completed })
      .eq('id', id)

    if (error) {
      setError('Failed to update task.')
      return
    }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed } : t))
  }

  const deleteTask = async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      setError('Failed to delete task.')
      return
    }
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('tasks')
      .update(updates)
      .eq('id', id)

    if (error) {
      setError('Failed to update task.')
      return
    }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

  const filteredTasks = tasks
    .filter(t => {
      if (filter === 'active') return !t.completed
      if (filter === 'completed') return t.completed
      return true
    })
    .filter(t => priorityFilter === 'all' || t.priority === priorityFilter)
    .sort((a, b) => {
      if (sortBy === 'priority') return priorityOrder[a.priority as Priority] - priorityOrder[b.priority as Priority]
      if (sortBy === 'due_date') {
        if (!a.due_date && !b.due_date) return 0
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        return a.due_date.localeCompare(b.due_date)
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  const counts = {
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  }

  return (
    <div className={styles.app}>
      <Header onAddTask={() => setShowForm(true)} />

      <main className={styles.main}>
        <div className={styles.container}>
          {error && (
            <div className={styles.errorBanner}>
              <span>{error}</span>
              <button onClick={() => setError(null)} className={styles.errorClose}>×</button>
            </div>
          )}

          <FilterBar
            filter={filter}
            setFilter={setFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            counts={counts}
          />

          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <span>Loading tasks…</span>
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
              filter={filter}
            />
          )}
        </div>
      </main>

      {showForm && (
        <div className={styles.overlay} onClick={() => setShowForm(false)}>
          <div onClick={e => e.stopPropagation()}>
            <TaskForm
              onSubmit={addTask}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
