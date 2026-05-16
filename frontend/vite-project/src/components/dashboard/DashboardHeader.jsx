import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Notifications from './Notifications'

const DashboardHeader = ({ title = 'Overview' }) => {
  const { user } = useAuth()
  const [search, setSearch] = useState('')

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'BB'

  return (
    <header className="dash-header">
      <h1 className="dash-title">{title}</h1>

      <div className="dash-header-right">
        <div className="dash-search">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="dash-user">
          <div className="dash-user-avatar">{initials}</div>
          <div className="dash-user-info">
            <span className="dash-user-name">{user?.name}</span>
            <span className="dash-user-email">{user?.email}</span>
          </div>
        </div>
        <Notifications />
      </div>
    </header>
  )
}

export default DashboardHeader