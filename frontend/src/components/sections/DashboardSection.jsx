// src/components/sections/DashboardSection.jsx
import api from '../../utils/api'
import ApiEndpoint   from '../ApiEndpoint'
import SectionHeader from '../SectionHeader'

export default function DashboardSection({ token }) {
  return (
    <div>
      <SectionHeader
        title="Dashboard Analytics"
        description="Summary and trend data for the finance dashboard. Accessible to all authenticated roles."
        color="#7c3aed"
      />

      {/* GET /api/dashboard/summary */}
      <ApiEndpoint
        method="GET"
        path="/api/dashboard/summary"
        description="Get total income, expenses, net balance and record count"
        requiresAuth={true}
        onSend={async () => api.get('/dashboard/summary')}
      />

      {/* GET /api/dashboard/category-summary */}
      <ApiEndpoint
        method="GET"
        path="/api/dashboard/category-summary"
        description="Get totals grouped by category and type (for pie/bar charts)"
        requiresAuth={true}
        onSend={async () => api.get('/dashboard/category-summary')}
      />

      {/* GET /api/dashboard/monthly-trends */}
      <ApiEndpoint
        method="GET"
        path="/api/dashboard/monthly-trends"
        description="Get month-by-month income and expense totals for last 12 months"
        requiresAuth={true}
        onSend={async () => api.get('/dashboard/monthly-trends')}
      />

      {/* GET /api/dashboard/recent-activity */}
      <ApiEndpoint
        method="GET"
        path="/api/dashboard/recent-activity"
        description="Get the 10 most recent transactions"
        requiresAuth={true}
        onSend={async () => api.get('/dashboard/recent-activity')}
      />
    </div>
  )
}