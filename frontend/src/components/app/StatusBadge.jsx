import { STATUS } from '../../data/mockData'

export default function StatusBadge({ status }) {
  const s = STATUS[status]
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  )
}