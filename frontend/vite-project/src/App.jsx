import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function App() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path='/login' element={
        user ? <Navigate to='/dashboard' /> : <Login />
      } />
      <Route path='/register' element={<Register />} />
      <Route path='/dashboard' element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path='*' element={<Navigate to='/login' />} />
    </Routes>
  )
}

export default App