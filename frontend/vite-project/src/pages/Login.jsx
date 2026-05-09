import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        setError(null)
        e.preventDefault()
        setLoading(true)
        try {
            const res = await api.post('/auth/login', formData)
            login(res.data.user, res.data.token)
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
            setLoading(false)
        }
    }


return (
    <div className="auth">
      <Link to="/" className="auth-logo">Budget Buddy</Link>
      <span className="auth-badge">✦ Welcome back</span>
      <h1>Login to your account</h1>
      <p className="subtitle">Good to see you again.</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login →'}
        </button>
      </form>
      <p className="switch">Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  )
}

export default Login