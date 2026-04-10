// src/components/ApiEndpoint.jsx
// This is the main reusable component — one panel per API endpoint
// Shows method, path, description, expandable form to test, and response

import { useState } from 'react'

export default function ApiEndpoint({
  method,       // "GET" | "POST" | "PATCH" | "DELETE"
  path,         // e.g. "/api/auth/login"
  description,  // short text shown next to the path
  fields = [],  // array of { name, type, placeholder, required, options }
  onSend,       // async function that calls the API and returns response
  requiresAuth = false, // show lock icon
  defaultBody = {},    // pre-filled form values
}) {
  const [open,      setOpen]      = useState(false)
  const [form,      setForm]      = useState(defaultBody)
  const [response,  setResponse]  = useState(null)
  const [status,    setStatus]    = useState(null)
  const [loading,   setLoading]   = useState(false)

  const methodColors = {
    GET:    '#2563eb',
    POST:   '#16a34a',
    PATCH:  '#d97706',
    DELETE: '#dc2626',
  }

  const handleSend = async () => {
    setLoading(true)
    setResponse(null)
    try {
      const result = await onSend(form)
      setResponse(JSON.stringify(result.data, null, 2))
      setStatus(result.status)
    } catch (err) {
      setResponse(JSON.stringify(err.response?.data || { message: err.message }, null, 2))
      setStatus(err.response?.status || 0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      marginBottom: '8px',
      overflow: 'hidden',
      background: 'var(--surface)',
    }}>

      {/* ── Collapsed Header Row (always visible) ── */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '14px 20px', cursor: 'pointer',
          background: open ? '#fafbff' : 'white',
          transition: 'background 0.15s',
          borderLeft: `4px solid ${methodColors[method]}`,
        }}
      >
        {/* Method badge */}
        <span className={`method-badge ${method}`}>{method}</span>

        {/* Path */}
        <span style={{ fontFamily: 'DM Mono', fontSize: '14px', fontWeight: '500', color: 'var(--text)', flex: 1 }}>
          {path}
        </span>

        {/* Description */}
        <span style={{ fontSize: '13px', color: 'var(--muted)', flex: 2 }}>
          {description}
        </span>

        {/* Lock icon for auth-required routes */}
        {requiresAuth && (
          <span style={{ fontSize: '14px', color: 'var(--light)' }} title="Requires token">🔒</span>
        )}

        {/* Status badge from last response */}
        {status && (
          <span style={{
            fontSize: '12px', fontFamily: 'DM Mono', padding: '2px 8px',
            borderRadius: '4px', fontWeight: '700',
            background: status < 300 ? '#dcfce7' : '#fee2e2',
            color: status < 300 ? '#15803d' : '#dc2626',
            border: `1px solid ${status < 300 ? '#bbf7d0' : '#fecaca'}`,
          }}>
            {status}
          </span>
        )}

        {/* Expand arrow */}
        <span style={{
          color: 'var(--light)', fontSize: '16px',
          transform: open ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s',
        }}>▼</span>
      </div>

      {/* ── Expanded Panel ── */}
      {open && (
        <div className="fade-in" style={{
          padding: '20px 24px',
          borderTop: '1px solid var(--border)',
          background: '#fafbff',
        }}>

          {/* Auth required note */}
          {requiresAuth && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 14px', background: '#eef2ff', borderRadius: '6px',
              marginBottom: '16px', fontSize: '12px', color: '#6366f1',
              border: '1px solid #c7d2fe',
            }}>
              🔒 <span>This endpoint requires a <strong>Bearer Token</strong>. Login first to get your token.</span>
            </div>
          )}

          {/* Input fields */}
          {fields.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Request Body / Parameters
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {fields.map((field) => (
                  <div key={field.name} style={{ gridColumn: field.fullWidth ? '1 / -1' : 'auto' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '5px', fontFamily: 'DM Mono' }}>
                      {field.name}
                      {field.required && <span style={{ color: 'var(--delete)', marginLeft: '3px' }}>*</span>}
                    </label>

                    {field.options ? (
                      // Dropdown select
                      <select
                        value={form[field.name] || ''}
                        onChange={e => setForm({ ...form, [field.name]: e.target.value })}
                        className="input-field"
                      >
                        <option value="">-- select --</option>
                        {field.options.map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        placeholder={field.placeholder}
                        value={form[field.name] || ''}
                        onChange={e => setForm({ ...form, [field.name]: e.target.value })}
                        className="input-field"
                        style={{ resize: 'vertical' }}
                      />
                    ) : (
                      <input
                        type={field.type || 'text'}
                        placeholder={field.placeholder}
                        value={form[field.name] || ''}
                        onChange={e => setForm({ ...form, [field.name]: e.target.value })}
                        className="input-field"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '12px', height: '12px', border: '2px solid #ffffff55',
                  borderTop: '2px solid white', borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite', display: 'inline-block',
                }} />
                Sending...
              </span>
            ) : `Send ${method} Request`}
          </button>

          {/* Response */}
          {response && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Response
                </p>
                <span style={{
                  fontSize: '12px', fontFamily: 'DM Mono', padding: '2px 8px',
                  borderRadius: '4px', fontWeight: '700',
                  background: status < 300 ? '#dcfce7' : '#fee2e2',
                  color: status < 300 ? '#15803d' : '#dc2626',
                  border: `1px solid ${status < 300 ? '#bbf7d0' : '#fecaca'}`,
                }}>
                  {status} {status < 300 ? 'OK' : 'ERROR'}
                </span>
              </div>
              <div className={`response-box ${status < 300 ? 'response-ok' : 'response-err'}`}>
                {response}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}