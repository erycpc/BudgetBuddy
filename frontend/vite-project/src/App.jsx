import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Budgets from './pages/Budgets'
import Goals from './pages/Goals'
import Settings from './pages/Settings'
import Investments from './pages/Investments'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function App() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path='/login' element={
        user ? <Navigate to='/dashboard' /> : <Login />
      } />
      <Route path='/register' element={
        user ? <Navigate to='/dashboard' /> : <Register />
      } />
      <Route path='/dashboard' element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path='/expenses' element={
        <ProtectedRoute>
          <Expenses />
        </ProtectedRoute>
      } />
      <Route path='/budgets' element={
        <ProtectedRoute>
          <Budgets />
        </ProtectedRoute>
      } />
      <Route path='/goals' element={
        <ProtectedRoute>
          <Goals />
        </ProtectedRoute>
      } />
      <Route path='/investments' element={
        <ProtectedRoute>
          <Investments />
        </ProtectedRoute>
      } />
      <Route path='/settings' element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path='*' element={<Navigate to='/login' />} />
    </Routes>
  )
}

export default App