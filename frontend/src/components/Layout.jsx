import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, FileText, ShieldCheck } from 'lucide-react'

const ROLE_LABEL = { EMPLOYEE: 'Employee', AUTHORITY: 'Reporting Authority' }

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="min-h-screen">
      <header className="bg-maroon text-white shadow">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText size={26} />
            <div>
              <p className="text-[10px] tracking-widest uppercase text-white/70 font-medium">
                Government of India · NIC
              </p>
              <h1 className="text-base font-bold leading-tight">APAR Management Portal</h1>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold">{user.fullName}</p>
                <p className="text-[11px] text-white/70 flex items-center gap-1 justify-end">
                  <ShieldCheck size={12} /> {ROLE_LABEL[user.role] || user.role}
                </p>
              </div>
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs bg-maroon-dark hover:bg-black/30 px-3 py-1.5 rounded transition-colors">
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-6">{children}</main>
      <footer className="text-center text-xs text-gray-400 py-6">
        National Informatics Centre · Ministry of Electronics &amp; Information Technology
      </footer>
    </div>
  )
}
