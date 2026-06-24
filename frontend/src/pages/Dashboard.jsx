import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportApi } from '../api/api'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import { Plus, ChevronRight, Inbox } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    reportApi.list()
      .then(({ data }) => setRows(data))
      .catch((e) => setError(e.response?.data?.error || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const isEmployee = user.role === 'EMPLOYEE'

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-maroon">
          {isEmployee ? 'My APAR Reports' : 'All Submitted Reports'}
        </h2>
        {isEmployee && (
          <button onClick={() => navigate('/submit')}
            className="flex items-center gap-1.5 text-xs font-semibold bg-maroon hover:bg-maroon-dark text-white px-3 py-2 rounded">
            <Plus size={14} /> New APAR
          </button>
        )}
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && rows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Inbox size={40} />
          <p className="mt-2 text-sm">No reports yet.</p>
        </div>
      )}

      <div className="grid gap-3">
        {rows.map((r) => (
          <button key={r.id} onClick={() => navigate(`/report/${r.id}`)}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:shadow transition-shadow text-left">
            <div>
              <span className="font-semibold text-gray-800">{r.officerName}</span>
              <p className="text-xs text-gray-500">
                {r.department} · Cycle {r.assessmentYear}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={r.status} flagged={r.flagged} />
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </button>
        ))}
      </div>
    </Layout>
  )
}
