import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import Overview from '../components/dashboard/Overview'

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader title="Overview" />
        <div className="dashboard-content">
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Welcome back, {user?.name}
          </p>
          <Overview />
        </div>
      </div>
    </div>
  )
}

export default Dashboard