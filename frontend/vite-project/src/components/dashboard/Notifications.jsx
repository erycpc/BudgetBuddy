import { useState, useEffect, useRef } from 'react'
import api from '../../services/api'

const Notifications = () => {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // generate notifications from real data
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [expRes, budRes, goalRes] = await Promise.all([
          api.get('/expenses'),
          api.get('/budgets'),
          api.get('/goals')
        ])

        const notes = []

        // budget alerts
        budRes.data.forEach(budget => {
          const spent = expRes.data
            .filter(exp =>
              exp.category === budget.category &&
              new Date(exp.date).getMonth() + 1 === budget.month &&
              new Date(exp.date).getFullYear() === budget.year
            )
            .reduce((sum, exp) => sum + exp.amount, 0)

          const percentage = (spent / budget.limit) * 100

          if (percentage >= 100) {
            notes.push({
              id: `budget-over-${budget._id}`,
              type: 'danger',
              title: 'Budget Exceeded',
              message: `Your ${budget.category} budget is over by KES ${(spent - budget.limit).toLocaleString()}`,
              icon: '⚠️'
            })
          } else if (percentage >= 80) {
            notes.push({
              id: `budget-warn-${budget._id}`,
              type: 'warning',
              title: 'Budget Warning',
              message: `You've used ${Math.round(percentage)}% of your ${budget.category} budget`,
              icon: '📊'
            })
          }
        })

        // goal alerts
        goalRes.data.forEach(goal => {
          const percentage = (goal.savedAmount / goal.targetAmount) * 100
          const daysLeft = Math.ceil(
            (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
          )

          if (percentage >= 100) {
            notes.push({
              id: `goal-complete-${goal._id}`,
              type: 'success',
              title: 'Goal Reached! 🎉',
              message: `You've reached your "${goal.title}" savings goal!`,
              icon: '🎯'
            })
          } else if (daysLeft <= 7 && daysLeft > 0 && percentage < 100) {
            notes.push({
              id: `goal-deadline-${goal._id}`,
              type: 'warning',
              title: 'Goal Deadline Soon',
              message: `"${goal.title}" is due in ${daysLeft} days — ${Math.round(percentage)}% saved`,
              icon: '⏰'
            })
          } else if (daysLeft < 0 && percentage < 100) {
            notes.push({
              id: `goal-overdue-${goal._id}`,
              type: 'danger',
              title: 'Goal Overdue',
              message: `"${goal.title}" deadline has passed — ${Math.round(percentage)}% saved`,
              icon: '❌'
            })
          } else if (percentage >= 50 && percentage < 100) {
            notes.push({
              id: `goal-halfway-${goal._id}`,
              type: 'success',
              title: 'Halfway There!',
              message: `You're ${Math.round(percentage)}% of the way to your "${goal.title}" goal`,
              icon: '💪'
            })
          }
        })

        // no notifications
        if (notes.length === 0) {
          notes.push({
            id: 'all-good',
            type: 'success',
            title: 'All good!',
            message: 'Your finances are on track. Keep it up!',
            icon: '✅'
          })
        }

        setNotifications(notes)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter(n => n.type === 'danger' || n.type === 'warning').length

  return (
    <div className="notif-wrapper" ref={ref}>
      <button
        className="dash-bell"
        onClick={() => setOpen(!open)}
        title="Notifications"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <p className="notif-title">Notifications</p>
            <p className="notif-count">{notifications.length} alerts</p>
          </div>

          <div className="notif-list">
            {loading ? (
              <p className="notif-empty">Loading...</p>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`notif-item ${n.type}`}>
                  <span className="notif-icon">{n.icon}</span>
                  <div className="notif-content">
                    <p className="notif-item-title">{n.title}</p>
                    <p className="notif-item-msg">{n.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications