import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'


const Settings = () => {
    const { user, login } = useAuth()
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    })
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })
    const [message, setMessage] = useState(null)

const handleProfileUpdate = async (e) => {
  e.preventDefault()
  try {
    const res = await api.put('/auth/profile', profileData)
    login(res.data, localStorage.getItem('token'))
    setMessage({ type: 'success', text: 'Profile updated successfully' })
  } catch (err) {
    setMessage({ type: 'error', text: err.response?.data?.message || 'Something went wrong' })
  }
}

const handlePasswordChange = async (e) => {
  e.preventDefault()
  if (passwordData.newPassword !== passwordData.confirmNewPassword) {
    return setMessage({ type: 'error', text: 'Passwords do not match' })
  }
  try {
    await api.put('/auth/password', passwordData)
    setMessage({ type: 'success', text: 'Password updated successfully' })
    setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
  } catch (err) {
    setMessage({ type: 'error', text: err.response?.data?.message || 'Something went wrong' })
  }
}

return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader title="Settings" />
        <div className="dashboard-content">
          <div className="expenses-header">
            <div>
              <h2 className="section-title">Settings</h2>
              <p className="section-sub">Manage your account preferences</p>
            </div>
          </div>

          {message && (
            <p className={message.type === 'success' ? 'success-msg' : 'error'}>
              {message.text}
            </p>
          )}

          <div className="settings-grid">
            {/* Profile card */}
            <div className="settings-card">
              <h3 className="settings-card-title">Profile</h3>
              <p className="settings-card-sub">Update your name and email</p>
              <form onSubmit={handleProfileUpdate}>
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={e => setProfileData({...profileData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group" style={{ marginTop: '1rem' }}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={e => setProfileData({...profileData, email: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn-submit" style={{ marginTop: '1.25rem' }}>
                  Save Changes
                </button>
              </form>
            </div>

            {/* Password card */}
            <div className="settings-card">
              <h3 className="settings-card-title">Change Password</h3>
              <p className="settings-card-sub">Keep your account secure</p>
              <form onSubmit={handlePasswordChange}>
                <div className="input-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group" style={{ marginTop: '1rem' }}>
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group" style={{ marginTop: '1rem' }}>
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmNewPassword}
                    onChange={e => setPasswordData({...passwordData, confirmNewPassword: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn-submit" style={{ marginTop: '1.25rem' }}>
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings