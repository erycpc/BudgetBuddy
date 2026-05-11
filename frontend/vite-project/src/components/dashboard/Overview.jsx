import { useState, useEffect } from 'react'
import api from '../../services/api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

const filters = ['Weekly', 'Monthly', 'Yearly', 'Range']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value">KES {payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

const filterExpenses = (expenses, filter) => {
  const now = new Date()

  if (filter === 'Weekly') {
    const weekAgo = new Date()
    weekAgo.setDate(now.getDate() - 7)
    return expenses.filter(exp => new Date(exp.date) >= weekAgo)
  }

  if (filter === 'Monthly') {
    return expenses.filter(exp => {
      const d = new Date(exp.date)
      return d.getMonth() === now.getMonth() &&
             d.getFullYear() === now.getFullYear()
    })
  }

  if (filter === 'Yearly') {
    return expenses.filter(exp =>
      new Date(exp.date).getFullYear() === now.getFullYear()
    )
  }

  return expenses
}

const Overview = () => {
  const [activeFilter, setActiveFilter] = useState('Yearly')
  const [monthlyData, setMonthlyData] = useState([])
  const [allExpenses, setAllExpenses] = useState([])
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalBudgets: 0,
    totalGoals: 0
  })

  // fetch all data once on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [expRes, budRes, goalRes] = await Promise.all([
          api.get('/expenses'),
          api.get('/budgets'),
          api.get('/goals')
        ])

        setAllExpenses(expRes.data)

        setStats(prev => ({
          ...prev,
          totalBudgets: budRes.data.length,
          totalGoals: goalRes.data.length
        }))

      } catch (err) {
        console.error(err)
      }
    }
    fetchStats()
  }, [])

  // refilter whenever activeFilter or allExpenses changes
  useEffect(() => {
    if (allExpenses.length === 0) return

    const filtered = filterExpenses(allExpenses, activeFilter)

    const totalExpenses = filtered.reduce(
      (sum, exp) => sum + exp.amount, 0
    )

    setStats(prev => ({ ...prev, totalExpenses }))

    const months = ['Jan','Feb','Mar','Apr','May','Jun',
                    'Jul','Aug','Sep','Oct','Nov','Dec']

    const grouped = months.map((month, index) => {
      const total = filtered
        .filter(exp => new Date(exp.date).getMonth() === index)
        .reduce((sum, exp) => sum + exp.amount, 0)
      return { month, amount: total }
    })

    setMonthlyData(grouped)

  }, [activeFilter, allExpenses])

  return (
    <div className="overview-grid">
      <div className="revenue-card">
        <div className="revenue-card-top">
          <div>
            <p className="revenue-label">
              {activeFilter === 'Weekly' ? 'This Week' :
               activeFilter === 'Monthly' ? 'This Month' :
               activeFilter === 'Yearly' ? 'This Year' : 'All Time'} Expenses
            </p>
            <p className="revenue-amount">
              <span className="revenue-currency">KES</span>
              {stats.totalExpenses.toLocaleString()}
            </p>
          </div>
          <div className="revenue-filters">
            {filters.map(f => (
              <button
                key={f}
                className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              barSize={28}
            >
              <CartesianGrid
                vertical={false}
                stroke="#2a2a2a"
                strokeDasharray="0"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#888', fontSize: 12, fontFamily: 'Space Grotesk' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#888', fontSize: 12, fontFamily: 'Space Grotesk' }}
                tickFormatter={v => v === 0 ? '0' : `${v/1000}k`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar
                dataKey="amount"
                fill="#2a2a2a"
                radius={[4, 4, 0, 0]}
                activeBar={{ fill: '#3dff54' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bottom-cards">
        <div className="bottom-card">
          <p className="bottom-card-label">Total Expenses</p>
          <p className="bottom-card-value">
            KES {stats.totalExpenses.toLocaleString()}
          </p>
          <p className="bottom-card-sub">
            {stats.totalExpenses === 0 ? 'No expenses yet' : 'All time spending'}
          </p>
        </div>
        <div className="bottom-card">
          <p className="bottom-card-label">Active Budgets</p>
          <p className="bottom-card-value">{stats.totalBudgets}</p>
          <p className="bottom-card-sub">
            {stats.totalBudgets === 0 ? 'No budgets set' : 'Categories tracked'}
          </p>
        </div>
        <div className="bottom-card">
          <p className="bottom-card-label">Savings Goals</p>
          <p className="bottom-card-value">{stats.totalGoals}</p>
          <p className="bottom-card-sub">
            {stats.totalGoals === 0 ? 'No goals yet' : 'Goals in progress'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Overview