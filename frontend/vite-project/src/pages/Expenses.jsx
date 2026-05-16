import { useState, useEffect } from 'react'
import api from '../services/api'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import { SkeletonExpenseItem } from '../components/Skeleton'

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: ''
  })

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get('/expenses')
        setExpenses(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchExpenses()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/expenses', formData)
      setExpenses([...expenses, res.data])
      setFormData({
        description: '',
        amount: '',
        category: '',
        date: ''
      })
      setShowForm(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`)
      setExpenses(expenses.filter(exp => exp._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader title="Expenses" />
        <div className="dashboard-content">
          <div className="expenses-header">
            <div>
              <h2 className="section-title">My Expenses</h2>
              <p className="section-sub">{expenses.length} transactions recorded</p>
            </div>
            <button className="btn-add" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Add Expense'}
            </button>
          </div>

          {showForm && (
            <form className="expense-form" onSubmit={handleAdd}>
              <div className="form-row">
                <div className="input-group">
                  <label>Description</label>
                  <input
                    type="text"
                    name="description"
                    placeholder="e.g. Lunch"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Amount (KES)</label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
              </div>
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
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="btn-submit">Add Expense</button>
            </form>
          )}

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[...Array(4)].map((_, i) => <SkeletonExpenseItem key={i} />)}
            </div>
          ) : expenses.length === 0 ? (
            <div className="empty-state">
              <p>No expenses yet</p>
              <span>Click "Add Expense" to record your first one</span>
            </div>
          ) : (
            <div className="expenses-list">
              {expenses.map(exp => (
                <div key={exp._id} className="expense-item">
                  <div className="expense-category-badge">{exp.category}</div>
                  <div className="expense-info">
                    <p className="expense-description">{exp.description}</p>
                    <p className="expense-date">
                      {new Date(exp.date).toLocaleDateString('en-KE', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <p className="expense-amount">KES {Number(exp.amount).toLocaleString()}</p>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(exp._id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Expenses