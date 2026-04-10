// src/components/SectionHeader.jsx
// The colored section divider like "Auth", "Financial APIs" in Swagger UI

export default function SectionHeader({ title, description, color = '#6366f1' }) {
  return (
    <div style={{
      margin: '40px 0 16px',
      paddingBottom: '12px',
      borderBottom: `2px solid ${color}33`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '4px', height: '28px', background: color, borderRadius: '2px' }} />
        <div>
          <h2 style={{ fontSize: '20px', color: 'var(--text)' }}>{title}</h2>
          {description && (
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}