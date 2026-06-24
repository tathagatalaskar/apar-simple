import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { reportApi } from '../api/api'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import { ArrowLeft, Send, AlertTriangle, CheckCircle, Flag } from 'lucide-react'

const GRADES = ['Outstanding', 'Very Good', 'Good', 'Average', 'Below Average']

export default function ReportDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [report, setReport] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  // authority review form
  const [grade, setGrade] = useState('')
  const [remarks, setRemarks] = useState('')
  const [flagged, setFlagged] = useState(false)
  const [flagReason, setFlagReason] = useState('')

  const load = useCallback(async () => {
    try {
      const { data } = await reportApi.get(id)
      setReport(data)
      setGrade(data.grade || '')
      setRemarks(data.authorityRemarks || '')
      setFlagged(data.flagged || false)
      setFlagReason(data.flagReason || '')
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load report')
    }
  }, [id])

  useEffect(() => { load() }, [load])

  const submitReview = async () => {
    setError(''); setNotice(''); setBusy(true)
    if (!grade) { setError('Please select a grade.'); setBusy(false); return }
    if (flagged && !flagReason.trim()) { setError('Please give a flag reason.'); setBusy(false); return }
    try {
      const { data } = await reportApi.review(id, { grade, remarks, flagged, flagReason })
      setReport(data)
      setNotice('Review saved successfully.')
    } catch (e) {
      setError(e.response?.data?.error || 'Review failed')
    } finally { setBusy(false) }
  }

  if (!report) {
    return <Layout>{error ? <p className="text-red-600 text-sm">{error}</p> : <p className="text-sm text-gray-500">Loading…</p>}</Layout>
  }

  const isAuthority = user.role === 'AUTHORITY'
  const input = 'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon/30'

  return (
    <Layout>
      <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-maroon mb-4">
        <ArrowLeft size={16} /> Back to dashboard
      </button>

      {notice && (
        <div className="mb-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
          <CheckCircle size={16} /> {notice}
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* Report details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{report.officerName}</h2>
            <p className="text-sm text-gray-500">{report.designation} · {report.department}</p>
            <p className="text-xs text-gray-400 mt-1">Cycle {report.assessmentYear}</p>
          </div>
          <StatusBadge status={report.status} flagged={report.flagged} />
        </div>

        {report.selfAppraisal && (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Self Appraisal</p>
            <p className="text-sm text-gray-700 whitespace-pre-line">{report.selfAppraisal}</p>
          </div>
        )}

        <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Targets &amp; Achievements</p>
        <table className="w-full text-sm border border-gray-200 rounded overflow-hidden">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr><th className="px-3 py-2 text-left">Target</th><th className="px-3 py-2 text-left">Achievement</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {report.targets.map((t, i) => (
              <tr key={i}>
                <td className="px-3 py-2">{t.target}</td>
                <td className="px-3 py-2">{t.achievement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Authority review section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-maroon border-b border-maroon/30 pb-2 mb-4">
          Authority Review
        </h3>

        {isAuthority ? (
          <>
            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Grade *</label>
              <select className={input} value={grade} onChange={(e) => setGrade(e.target.value)}>
                <option value="">— Select grade —</option>
                {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Remarks</label>
              <textarea rows={3} className={`${input} resize-none`} value={remarks}
                onChange={(e) => setRemarks(e.target.value)} placeholder="Your assessment remarks…" />
            </div>
            <label className="flex items-center gap-2 text-sm mb-3 cursor-pointer">
              <input type="checkbox" checked={flagged} onChange={(e) => setFlagged(e.target.checked)} />
              <Flag size={14} className="text-red-600" /> Flag this report for further review
            </label>
            {flagged && (
              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Flag Reason</label>
                <input className={input} value={flagReason} onChange={(e) => setFlagReason(e.target.value)}
                  placeholder="Why is this being flagged?" />
              </div>
            )}
            <button disabled={busy} onClick={submitReview}
              className="w-full flex items-center justify-center gap-2 bg-maroon hover:bg-maroon-dark text-white font-semibold py-2.5 rounded disabled:opacity-60">
              <Send size={15} /> {busy ? 'Saving…' : 'Save Review'}
            </button>
          </>
        ) : (
          // Employee read-only view of the review
          report.status === 'REVIEWED' ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">Grade</p>
                <p className="text-sm font-semibold text-gray-800">{report.grade}</p>
              </div>
              {report.authorityRemarks && (
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">Remarks</p>
                  <p className="text-sm text-gray-700">{report.authorityRemarks}</p>
                </div>
              )}
              {report.flagged && (
                <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                  <AlertTriangle size={16} className="mt-0.5" />
                  <span><b>Flagged:</b> {report.flagReason}</span>
                </div>
              )}
              <p className="text-xs text-gray-400">Reviewed by {report.reviewedByName}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Your report is awaiting review by the authority.</p>
          )
        )}
      </div>
    </Layout>
  )
}
