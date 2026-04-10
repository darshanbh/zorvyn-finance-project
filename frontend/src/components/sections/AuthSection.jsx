// src/components/sections/AuthSection.jsx
import api from '../../utils/api'
import ApiEndpoint  from '../ApiEndpoint'
import SectionHeader from '../SectionHeader'

export default function AuthSection({ token, onAuth }) {

  return (
    <div>
      <SectionHeader
        title="Auth"
        description="Register, login, and get your profile. Login to receive a JWT token for protected routes."
        color="#16a34a"
      />

      {/* POST /api/auth/register */}
      <ApiEndpoint
        method="POST"
        path="/api/auth/register"
        description="Create a new user account"
        fields={[
          { name: 'name',     type: 'text',     placeholder: 'Darshan',           required: true },
          { name: 'email',    type: 'email',    placeholder: 'admin@test.com',     required: true },
          { name: 'password', type: 'password', placeholder: 'admin123',           required: true },
          { name: 'role',     options: ['viewer', 'analyst', 'admin'] },
        ]}
        defaultBody={{ name: 'Darshan', email: 'admin@test.com', password: 'admin123', role: 'admin' }}
        onSend={async (form) => {
          const res = await api.post('/auth/register', form)
          // Auto-save token when registration succeeds
          if (res.data.token) onAuth(res.data.token, res.data.user)
          return res
        }}
      />

      {/* POST /api/auth/login */}
      <ApiEndpoint
        method="POST"
        path="/api/auth/login"
        description="Login and receive JWT token"
        fields={[
          { name: 'email',    type: 'email',    placeholder: 'admin@test.com', required: true },
          { name: 'password', type: 'password', placeholder: 'admin123',       required: true },
        ]}
        defaultBody={{ email: 'admin@test.com', password: 'admin123' }}
        onSend={async (form) => {
          const res = await api.post('/auth/login', form)
          // Auto-save token when login succeeds
          if (res.data.token) onAuth(res.data.token, res.data.user)
          return res
        }}
      />

      {/* GET /api/auth/me */}
      <ApiEndpoint
        method="GET"
        path="/api/auth/me"
        description="Get currently logged in user's profile"
        requiresAuth={true}
        onSend={async () => api.get('/auth/me')}
      />
    </div>
  )
}