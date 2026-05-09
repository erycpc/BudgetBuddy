import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

const monthlyData = [
  { month: 'Jan', amount: 4200 },
  { month: 'Feb', amount: 1800 },
  { month: 'Mar', amount: 3100 },
  { month: 'Apr', amount: 1400 },
  { month: 'May', amount: 2800 },
  { month: 'Jun', amount: 3600 },
  { month: 'Jul', amount: 3200 },
  { month: 'Aug', amount: 2100 },
  { month: 'Sep', amount: 1600 },
  { month: 'Oct', amount: 2900 },
  { month: 'Nov', amount: 2400 },
  { month: 'Dec', amount: 3800 },
]

const filters = ['Weekly', 'Monthly', 'Yearly', 'Range']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value">${payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

const Overview = () => {
  const [activeFilter, setActiveFilter] = useState('Yearly')

  const total = monthlyData
    .reduce((sum, d) => sum + d.amount, 0)
    .toLocaleString()

  return (
    <div className="overview-grid">
      <div className="revenue-card">
        <div className="revenue-card-top">
          <div>
            <p className="revenue-label">Revenue</p>
            <p className="revenue-amount">
              <span className="revenue-currency">$</span>
              {total}
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
          <p className="bottom-card-value">$0.00</p>
          <p className="bottom-card-sub">No expenses yet</p>
        </div>
        <div className="bottom-card">
          <p className="bottom-card-label">Active Budgets</p>
          <p className="bottom-card-value">0</p>
          <p className="bottom-card-sub">No budgets set</p>
        </div>
        <div className="bottom-card">
          <p className="bottom-card-label">Savings Goals</p>
          <p className="bottom-card-value">0</p>
          <p className="bottom-card-sub">No goals yet</p>
        </div>
      </div>
    </div>
  )
}

export default Overview