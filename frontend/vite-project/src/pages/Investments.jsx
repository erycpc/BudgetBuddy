import { useState, useEffect } from 'react'
import api from '../services/api'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import { SkeletonCard } from '../components/Skeleton'

const Investments = () => {
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    amountInvested: '',
    currentValue: ''
  })

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await api.get('/investments')
        setInvestments(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchInvestments()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/investments', formData)
      setInvestments([...investments, res.data])
      setFormData({ name: '', type: '', amountInvested: '', currentValue: '' })
      setShowForm(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/investments/${id}`)
      setInvestments(investments.filter(inv => inv._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  // portfolio totals calculated from the array
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amountInvested, 0)
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalReturn = totalValue - totalInvested
  const isPortfolioPositive = totalReturn >= 0

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader title="Investments" />
        <div className="dashboard-content">
          <div className="expenses-header">
            <div>
              <h2 className="section-title">My Portfolio</h2>
              <p className="section-sub">{investments.length} investments tracked</p>
            </div>
            <button className="btn-add" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Add Investment'}
            </button>
          </div>

          {/* portfolio summary */}
          {investments.length > 0 && (
            <div className="portfolio-summary">
              <div className="portfolio-stat">
                <p className="portfolio-stat-label">Total Invested</p>
                <p className="portfolio-stat-value">
                  KES {totalInvested.toLocaleString()}
                </p>
              </div>
              <div className="portfolio-stat">
                <p className="portfolio-stat-label">Current Value</p>
                <p className="portfolio-stat-value">
                  KES {totalValue.toLocaleString()}
                </p>
              </div>
              <div className="portfolio-stat">
                <p className="portfolio-stat-label">Total Return</p>
                <p className={`portfolio-stat-value ${isPortfolioPositive ? 'positive' : 'negative'}`}>
                  {isPortfolioPositive ? '+' : ''}KES {totalReturn.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {showForm && (
            <form className="expense-form" onSubmit={handleAdd}>
              <div className="form-row">
                <div className="input-group">
                  <label>Investment Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Apple Stock"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    required
                  >
                    <option value="">Select type</option>
                    <option>Stock</option>
                    <option>Crypto</option>
                    <option>Real Estate</option>
                    <option>Bond</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Amount Invested (KES)</label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={formData.amountInvested}
                    onChange={e => setFormData({...formData, amountInvested: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Current Value (KES)</label>
                  <input
                    type="number"
                    placeholder="e.g. 62000"
                    value={formData.currentValue}
                    onChange={e => setFormData({...formData, currentValue: e.target.value})}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-submit">Add Investment</button>
            </form>
          )}

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : investments.length === 0 ? (
            <div className="empty-state">
              <p>No investments yet</p>
              <span>Click "Add Investment" to track your portfolio</span>
            </div>
          ) : (
            <div className="investments-list">
              {investments.map(inv => {
                const returnAmount = inv.currentValue - inv.amountInvested
                const returnPercent = ((returnAmount / inv.amountInvested) * 100).toFixed(1)
                const isPositive = returnAmount >= 0

                return (
                  <div key={inv._id} className="investment-item">
                    <div className="investment-left">
                      <div className="investment-type-badge">{inv.type}</div>
                      <div>
                        <p className="investment-name">{inv.name}</p>
                        <p className="investment-invested">
                          Invested: KES {Number(inv.amountInvested).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="investment-right">
                      <p className="investment-value">
                        KES {Number(inv.currentValue).toLocaleString()}
                      </p>
                      <p className={`investment-return ${isPositive ? 'positive' : 'negative'}`}>
                        {isPositive ? '▲' : '▼'} {Math.abs(returnPercent)}%
                        ({isPositive ? '+' : ''}KES {returnAmount.toLocaleString()})
                      </p>
                    </div>
                    <button className="btn-delete" onClick={() => handleDelete(inv._id)}>✕</button>
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

export default Investments