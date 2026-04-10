// src/components/sections/TransactionSection.jsx
import api from '../../utils/api'
import ApiEndpoint   from '../ApiEndpoint'
import SectionHeader from '../SectionHeader'

const CATEGORIES = ['salary','freelance','investment','food','rent','transport','health','entertainment','education','other']

export default function TransactionSection({ token }) {
  return (
    <div>
      <SectionHeader
        title="Financial APIs"
        description="Create, view, update, and delete financial records. Filter by type, category, and date."
        color="#2563eb"
      />

      {/* GET /api/transactions */}
      <ApiEndpoint
        method="GET"
        path="/api/transactions"
        description="Get all transactions with optional filters and pagination"
        requiresAuth={true}
        fields={[
          { name: 'type',      options: ['income', 'expense'],  },
          { name: 'category',  options: CATEGORIES },
          { name: 'startDate', type: 'date', placeholder: '2025-01-01' },
          { name: 'endDate',   type: 'date', placeholder: '2025-12-31' },
          { name: 'page',      type: 'number', placeholder: '1' },
          { name: 'limit',     type: 'number', placeholder: '20' },
        ]}
        onSend={async (form) => {
          // Build query params — only include non-empty values
          const params = {}
          if (form.type)      params.type      = form.type
          if (form.category)  params.category  = form.category
          if (form.startDate) params.startDate = form.startDate
          if (form.endDate)   params.endDate   = form.endDate
          if (form.page)      params.page      = form.page
          if (form.limit)     params.limit     = form.limit
          return api.get('/transactions', { params })
        }}
      />

      {/* POST /api/transactions */}
      <ApiEndpoint
        method="POST"
        path="/api/transactions"
        description="Create a new income or expense record (Analyst, Admin only)"
        requiresAuth={true}
        fields={[
          { name: 'amount',   type: 'number',  placeholder: '50000',        required: true },
          { name: 'type',     options: ['income', 'expense'],                required: true },
          { name: 'category', options: CATEGORIES,                           required: true },
          { name: 'date',     type: 'date',    placeholder: '2025-04-01',   required: true },
          { name: 'notes',    type: 'text',    placeholder: 'April salary', fullWidth: true },
        ]}
        defaultBody={{ amount: '50000', type: 'income', category: 'salary', date: new Date().toISOString().split('T')[0] }}
        onSend={async (form) => api.post('/transactions', form)}
      />

      {/* PATCH /api/transactions/:id */}
      <ApiEndpoint
        method="PATCH"
        path="/api/transactions/:id"
        description="Update a transaction (Analyst: own only, Admin: any)"
        requiresAuth={true}
        fields={[
          { name: 'id',       type: 'text',    placeholder: 'Transaction _id from GET response', required: true, fullWidth: true },
          { name: 'amount',   type: 'number',  placeholder: '60000' },
          { name: 'type',     options: ['income', 'expense'] },
          { name: 'category', options: CATEGORIES },
          { name: 'date',     type: 'date' },
          { name: 'notes',    type: 'text',    placeholder: 'Updated notes', fullWidth: true },
        ]}
        onSend={async (form) => {
          const { id, ...body } = form
          // Remove empty fields
          const clean = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== '' && v !== undefined))
          return api.patch(`/transactions/${id}`, clean)
        }}
      />

      {/* DELETE /api/transactions/:id */}
      <ApiEndpoint
        method="DELETE"
        path="/api/transactions/:id"
        description="Soft delete a transaction (Admin only)"
        requiresAuth={true}
        fields={[
          { name: 'id', type: 'text', placeholder: 'Transaction _id to delete', required: true, fullWidth: true },
        ]}
        onSend={async (form) => api.delete(`/transactions/${form.id}`)}
      />
    </div>
  )
}