import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportApi } from '../api/api'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import { Send, Plus, Trash2, ArrowLeft, AlertCircle } from 'lucide-react'

export default function SubmitReport() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    officerName: user.fullName || '',
    department: '',
    designation: '',
    assessmentYear: '2025-2026',
    selfAppraisal: '',
  })
  const [targets, setTargets] = useState([{ target: '', achievement: '' }])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const setTarget = (i, k, v) =>
    setTargets((ts) => ts.map((t, j) => (j === i ? { ...t, [k]: v } : t)))

  const submit = async () => {
    setError('')
    // simple client-side validation
    if (!form.officerName.trim() || !form.department.trim() || !form.designation.trim()) {
      setError('Please fill all required fields.')
      return
    }
    const cleanTargets = targets.filter((t) => t.target.trim() && t.achievement.trim())
    if (cleanTargets.length === 0) {
      setError('Add at least one target and achievement.')
      return
    }
    setBusy(true)
    try {
      await reportApi.submit({ ...form, targets: cleanTargets })
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.error || 'Submission failed')
    } finally {
      setBusy(false)
    }
  }

  const input = 'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon/30'

  return (
    <Layout>
      <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-maroon mb-4">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-maroon border-b border-maroon/30 pb-2 mb-4">
          Submit APAR Report
        </h2>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Officer Name *</label>
            <input className={input} value={form.officerName} onChange={(e) => setField('officerName', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Assessment Year *</label>
            <input className={input} value={form.assessmentYear} onChange={(e) => setField('assessmentYear', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Department *</label>
            <input className={input} value={form.department} onChange={(e) => setField('department', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Designation *</label>
            <input className={input} value={form.designation} onChange={(e) => setField('designation', e.target.value)} />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Self Appraisal</label>
          <textarea rows={3} className={`${input} resize-none`} value={form.selfAppraisal}
            onChange={(e) => setField('selfAppraisal', e.target.value)}
            placeholder="Brief summary of your work during the cycle…" />
        </div>

        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-semibold uppercase text-gray-600">Targets &amp; Achievements *</label>
          <button type="button" onClick={() => setTargets((ts) => [...ts, { target: '', achievement: '' }])}
            className="flex items-center gap-1 text-xs font-semibold text-maroon">
            <Plus size={14} /> Add Row
          </button>
        </div>
        <table className="w-full text-sm border border-gray-200 rounded overflow-hidden mb-4">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Target</th>
              <th className="px-3 py-2 text-left">Achievement</th>
              <th className="px-3 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {targets.map((t, i) => (
              <tr key={i}>
                <td className="px-3 py-2">
                  <input className={`${input} text-xs`} placeholder="Target set"
                    value={t.target} onChange={(e) => setTarget(i, 'target', e.target.value)} />
                </td>
                <td className="px-3 py-2">
                  <input className={`${input} text-xs`} placeholder="Achievement"
                    value={t.achievement} onChange={(e) => setTarget(i, 'achievement', e.target.value)} />
                </td>
                <td className="px-3 py-2 text-center">
                  {i > 0 && (
                    <button type="button" onClick={() => setTargets((ts) => ts.filter((_, j) => j !== i))}
                      className="text-gray-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button disabled={busy} onClick={submit}
          className="w-full flex items-center justify-center gap-2 bg-maroon hover:bg-maroon-dark text-white font-semibold py-2.5 rounded disabled:opacity-60">
          <Send size={15} /> {busy ? 'Submitting…' : 'Submit Report'}
        </button>
      </div>
    </Layout>
  )
}
