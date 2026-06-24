const META = {
  SUBMITTED: { label: 'Submitted', color: '#b45309' },
  REVIEWED:  { label: 'Reviewed',  color: '#16a34a' },
}

export default function StatusBadge({ status, flagged }) {
  const m = META[status] || { label: status, color: '#6b7280' }
  return (
    <span className="inline-flex items-center gap-2">
      <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
        style={{ backgroundColor: m.color }}>{m.label}</span>
      {flagged && (
        <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white bg-red-600">
          Flagged
        </span>
      )}
    </span>
  )
}
