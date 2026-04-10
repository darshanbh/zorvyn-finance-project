// src/App.jsx
// Single-page API documentation + tester (like Swagger UI)
// All APIs are listed with expandable panels to test directly from browser

import { useState } from 'react'
import Header   from './components/Header'
import AuthSection        from './components/sections/AuthSection'
import TransactionSection from './components/sections/TransactionSection'
import DashboardSection   from './components/sections/DashboardSection'
import UsersSection       from './components/sections/UsersSection'

export default function App() {
  // token is stored here and passed to all sections
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
  })

  const saveToken = (t, u) => {
    localStorage.setItem('token', t)
    localStorage.setItem('user', JSON.stringify(u))
    setToken(t)
    setUser(u)
  }

  const clearToken = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken('')
    setUser(null)
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 80px' }}>
      <Header token={token} user={user} onClear={clearToken} />

      {/* Token display bar */}
      {token && (
        <div style={{
          background: '#f0fdf4', border: '1px solid #bbf7d0',
          borderRadius: '8px', padding: '12px 16px', marginBottom: '32px',
          display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#16a34a' }}>✓ AUTHENTICATED</span>
          <span style={{
            fontFamily: 'DM Mono', fontSize: '11px', color: '#64748b',
            background: 'white', padding: '4px 10px', borderRadius: '4px',
            border: '1px solid #e2e8f0', flex: 1, overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {token.substring(0, 60)}...
          </span>
          <span style={{
            fontSize: '12px', padding: '4px 10px', borderRadius: '20px',
            background: user?.role === 'admin' ? '#eef2ff' : user?.role === 'analyst' ? '#fef3c7' : '#f1f5f9',
            color: user?.role === 'admin' ? '#6366f1' : user?.role === 'analyst' ? '#d97706' : '#64748b',
            fontWeight: '700', textTransform: 'uppercase',
          }}>
            {user?.name} · {user?.role}
          </span>
        </div>
      )}

      {/* API Sections */}
      <AuthSection        token={token} onAuth={saveToken} />
      <TransactionSection token={token} />
      <DashboardSection   token={token} />
      <UsersSection       token={token} />
    </div>
  )
}