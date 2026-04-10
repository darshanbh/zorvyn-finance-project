// src/components/sections/UsersSection.jsx
import api from '../../utils/api'
import ApiEndpoint   from '../ApiEndpoint'
import SectionHeader from '../SectionHeader'

export default function UsersSection({ token }) {
  return (
    <div>
      <SectionHeader
        title="User Management"
        description="Admin-only endpoints to manage users, roles, and account status."
        color="#dc2626"
      />

      {/* GET /api/users */}
      <ApiEndpoint
        method="GET"
        path="/api/users"
        description="List all users (Admin only)"
        requiresAuth={true}
        onSend={async () => api.get('/users')}
      />

      {/* PATCH /api/users/:id */}
      <ApiEndpoint
        method="PATCH"
        path="/api/users/:id"
        description="Update user role or status (Admin only)"
        requiresAuth={true}
        fields={[
          { name: 'id',     type: 'text', placeholder: 'User _id from GET /users', required: true, fullWidth: true },
          { name: 'name',   type: 'text', placeholder: 'New name (optional)' },
          { name: 'role',   options: ['viewer', 'analyst', 'admin'] },
          { name: 'status', options: ['active', 'inactive'] },
        ]}
        onSend={async (form) => {
          const { id, ...body } = form
          const clean = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== '' && v !== undefined))
          return api.patch(`/users/${id}`, clean)
        }}
      />

      {/* DELETE /api/users/:id */}
      <ApiEndpoint
        method="DELETE"
        path="/api/users/:id"
        description="Delete a user permanently (Admin only)"
        requiresAuth={true}
        fields={[
          { name: 'id', type: 'text', placeholder: 'User _id to delete', required: true, fullWidth: true },
        ]}
        onSend={async (form) => api.delete(`/users/${form.id}`)}
      />
    </div>
  )
}