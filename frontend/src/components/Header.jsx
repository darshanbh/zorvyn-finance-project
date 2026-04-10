// src/components/Header.jsx
export default function Header({ token, user, onClear }) {
  return (
    <div style={{
      padding: '40px 0 32px',
      borderBottom: '2px solid var(--border)',
      marginBottom: '40px',
    }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
        <h1 style={{ fontSize: '28px', color: 'var(--text)' }}>
          Finance Data Processing & Access Control API
        </h1>
        <span style={{
          padding: '3px 10px', background: '#dbeafe', color: '#1d4ed8',
          borderRadius: '4px', fontSize: '12px', fontFamily: 'DM Mono',
          fontWeight: '600', border: '1px solid #bfdbfe',
        }}>1.0.0</span>
        <span style={{
          padding: '3px 10px', background: '#dcfce7', color: '#15803d',
          borderRadius: '4px', fontSize: '12px', fontFamily: 'DM Mono',
          fontWeight: '600', border: '1px solid #bbf7d0',
        }}>MERN</span>
      </div>

      <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '6px' }}>
        Backend API for a finance dashboard with role-based access control, financial record management, and summary analytics.
      </p>
      <p style={{ color: 'var(--light)', fontSize: '12px', fontFamily: 'DM Mono' }}>
        Base URL: <strong style={{ color: 'var(--accent)' }}>http://localhost:5000</strong>
        &nbsp;·&nbsp; Auth: <strong style={{ color: 'var(--accent)' }}>Bearer Token (JWT)</strong>
      </p>

      {/* Roles legend */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
        {[
          { role: 'viewer',  color: '#64748b', bg: '#f1f5f9', desc: 'Read only' },
          { role: 'analyst', color: '#d97706', bg: '#fef3c7', desc: 'Read + Create own' },
          { role: 'admin',   color: '#6366f1', bg: '#eef2ff', desc: 'Full access' },
        ].map(({ role, color, bg, desc }) => (
          <div key={role} style={{
            padding: '6px 14px', background: bg, borderRadius: '20px',
            border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color, textTransform: 'uppercase' }}>{role}</span>
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>— {desc}</span>
          </div>
        ))}
        {token && (
          <button onClick={onClear} style={{
            padding: '6px 14px', background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '20px', fontSize: '12px', color: '#dc2626', fontWeight: '600',
          }}>
            ✕ Clear Token
          </button>
        )}
      </div>
    </div>
  )
}