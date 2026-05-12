import { useState, useEffect } from 'react'
import api from '../services/api'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'

const Goals = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [addingTo, setAddingTo] = useState(null)
  const [addAmount, setAddAmount] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    savedAmount: 0,
    deadline: ''
  })

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await api.get('/goals')
        setGoals(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchGoals()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/goals', formData)
      setGoals([...goals, res.data])
      setFormData({ title: '', targetAmount: '', savedAmount: 0, deadline: '' })
      setShowForm(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/goals/${id}`)
      setGoals(goals.filter(g => g._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddMoney = async (goal) => {
    try {
      const newSaved = goal.savedAmount + Number(addAmount)
      const res = await api.put(`/goals/${goal._id}`, { savedAmount: newSaved })
      setGoals(goals.map(g => g._id === goal._id ? res.data : g))
      setAddingTo(null)
      setAddAmount('')
    } catch (err) {
      console.error(err)
    }
  }

  const getDaysLeft = (deadline) => {
    const days = Math.ceil(
      (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
    )
    if (days < 0)
         return 'Overdue'
    if (days === 0)
         return 'Due today'
    return `${days} days left`
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader title="Goals" />
        <div className="dashboard-content">
          <div className="expenses-header">
            <div>
              <h2 className="section-title">My Goals</h2>
              <p className="section-sub">{goals.length} savings goals</p>
            </div>
            <button className="btn-add" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Add Goal'}
            </button>
          </div>

          {showForm && (
            <form className="expense-form" onSubmit={handleAdd}>
              <div className="form-row">
                <div className="input-group">
                  <label>Goal Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Buy a Laptop"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Target Amount (KES)</label>
                  <input
                    type="number"
                    placeholder="e.g. 80000"
                    value={formData.targetAmount}
                    onChange={e => setFormData({...formData, targetAmount: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Initial Saved Amount (KES)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.savedAmount}
                    onChange={e => setFormData({...formData, savedAmount: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-submit">Create Goal</button>
            </form>
          )}

          {loading ? (
            <p className="loading-text">Loading goals...</p>
          ) : goals.length === 0 ? (
            <div className="empty-state">
              <p>No goals yet</p>
              <span>Click "Add Goal" to start saving towards something</span>
            </div>
          ) : (
            <div className="goals-grid">
              {goals.map(goal => {
                const percentage = Math.min(
                  (goal.savedAmount / goal.targetAmount) * 100, 100
                )
                const isComplete = goal.savedAmount >= goal.targetAmount
                const daysLeft = getDaysLeft(goal.deadline)

                return (
                  <div key={goal._id} className={`goal-card ${isComplete ? 'complete' : ''}`}>
                    <div className="goal-card-top">
                      <div>
                        <p className="goal-title">{goal.title}</p>
                        <p className={`goal-days ${daysLeft === 'Overdue' ? 'overdue' : ''}`}>
                          {isComplete ? '🎉 Goal reached!' : daysLeft}
                        </p>
                      </div>
                      <button className="btn-delete" onClick={() => handleDelete(goal._id)}>✕</button>
                    </div>

                    <div className="goal-amounts">
                      <span className="goal-saved">
                        KES {Number(goal.savedAmount).toLocaleString()}
                      </span>
                      <span className="goal-target">
                        of KES {Number(goal.targetAmount).toLocaleString()}
                      </span>
                    </div>

                    <div className="progress-track">
                      <div
                        className={`progress-bar ${isComplete ? '' : percentage > 75 ? '' : ''}`}
                        style={{
                          width: `${percentage}%`,
                          background: isComplete ? 'var(--green)' : 'var(--green)'
                        }}
                      />
                    </div>
                    <p className="progress-label">{Math.round(percentage)}% saved</p>

                    {addingTo === goal._id ? (
                      <div className="goal-add-money">
                        <input
                          type="number"
                          placeholder="Amount to add"
                          value={addAmount}
                          onChange={e => setAddAmount(e.target.value)}
                          className="goal-input"
                        />
                        <button
                          className="btn-submit"
                          onClick={() => handleAddMoney(goal)}
                          style={{ padding: '0.5rem 1rem' }}
                        >
                          Add
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => setAddingTo(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      !isComplete && (
                        <button
                          className="btn-add-money"
                          onClick={() => setAddingTo(goal._id)}
                        >
                          + Add Money
                        </button>
                      )
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Goals