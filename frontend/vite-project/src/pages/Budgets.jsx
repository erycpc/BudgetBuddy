import { useState, useEffect } from 'react'
import api from '../services/api'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import { SkeletonCard } from '../components/Skeleton'

const Budgets = () => {
  const [budgets, setBudgets] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budRes, expRes] = await Promise.all([
          api.get('/budgets'),
          api.get('/expenses')
        ])
        setBudgets(budRes.data)
        setExpenses(expRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getSpend = (budget) => {
    return expenses
      .filter(exp =>
        exp.category === budget.category &&
        new Date(exp.date).getMonth() + 1 === budget.month &&
        new Date(exp.date).getFullYear() === budget.year
      )
      .reduce((sum, exp) => sum + exp.amount, 0)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/budgets', formData)
      setBudgets([...budgets, res.data])
      setFormData({
        category: '',
        limit: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      })
      setShowForm(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/budgets/${id}`)
      setBudgets(budgets.filter(b => b._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec']

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader title="Budgets" />
        <div className="dashboard-content">
          <div className="expenses-header">
            <div>
              <h2 className="section-title">My Budgets</h2>
              <p className="section-sub">{budgets.length} categories tracked</p>
            </div>
            <button className="btn-add" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Add Budget'}
            </button>
          </div>

          {showForm && (
            <form className="expense-form" onSubmit={handleAdd}>
              <div className="form-row">
                <div className="input-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="">Select category</option>
                    <option>Food</option>
                    <option>Transport</option>
                    <option>Bills</option>
                    <option>Shopping</option>
                    <option>Health</option>
                    <option>Entertainment</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Monthly Limit (KES)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={formData.limit}
                    onChange={e => setFormData({...formData, limit: e.target.value})}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-submit">Set Budget</button>
            </form>
          )}

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : budgets.length === 0 ? (
            <div className="empty-state">
              <p>No budgets set yet</p>
              <span>Click "Add Budget" to set a spending limit</span>
            </div>
          ) : (
            <div className="budgets-list">
              {budgets.map(budget => {
                const spent = getSpend(budget)
                const percentage = Math.min((spent / budget.limit) * 100, 100)
                const isOver = spent > budget.limit

                return (
                  <div key={budget._id} className="budget-card">
                    <div className="budget-card-top">
                      <div>
                        <div className="expense-category-badge">{budget.category}</div>
                        <p className="budget-month">
                          {months[budget.month - 1]} {budget.year}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p className={`budget-amount ${isOver ? 'over' : ''}`}>
                          KES {spent.toLocaleString()}
                          <span className="budget-limit"> / {Number(budget.limit).toLocaleString()}</span>
                        </p>
                        <p className="budget-remaining">
                          {isOver
                            ? `KES ${(spent - budget.limit).toLocaleString()} over budget`
                            : `KES ${(budget.limit - spent).toLocaleString()} remaining`
                          }
                        </p>
                      </div>
                      <button className="btn-delete" onClick={() => handleDelete(budget._id)}>✕</button>
                    </div>

                    <div className="progress-track">
                      <div
                        className={`progress-bar ${isOver ? 'danger' : percentage > 75 ? 'warning' : ''}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="progress-label">{Math.round(percentage)}% used</p>
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

export default Budgets