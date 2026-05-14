import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import Overview from '../components/dashboard/Overview'
import AIChat from '../components/dashboard/AIChat'

const Dashboard = () => {
  const { user } = useAuth()
  const [showAI, setShowAI] = useState(false)

  return (
    <div className="dashboard-layout">
      <Sidebar  onAIToggle={() => setShowAI(!showAI)} />
      <div className="dashboard-main">
        <DashboardHeader title="Overview" />
        <div className="dashboard-content">
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Welcome back, {user?.name}
          </p>
          <Overview />
        </div>
      </div>
      {showAI && <AIChat onClose={() => setShowAI(false)} />}
    </div>
  )
}

export default Dashboard