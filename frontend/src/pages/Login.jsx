import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FileText, LogIn, AlertCircle } from 'lucide-react'

const DEMO = [
  ['Employee', 'employee@nic.in'],
  ['Authority', 'authority@nic.in'],
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(email.trim(), password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-maroon text-white rounded-t-lg px-8 py-6 flex items-center gap-3">
          <FileText size={30} />
          <div>
            <p className="text-[10px] tracking-widest uppercase text-white/70">Government of India · NIC</p>
            <h1 className="text-lg font-bold">APAR Portal Login</h1>
          </div>
        </div>
        <form onSubmit={submit} className="bg-white shadow-md rounded-b-lg px-8 py-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="name@nic.in" required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon/30" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon/30" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-maroon hover:bg-maroon-dark text-white font-semibold py-2.5 rounded transition-colors disabled:opacity-60">
            <LogIn size={16} /> {loading ? 'Signing in…' : 'Sign In'}
          </button>
          <div className="pt-2 border-t border-gray-100">
            <p className="text-[11px] text-gray-400 mb-2">Demo accounts (password: Password@123)</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO.map(([label, mail]) => (
                <button key={mail} type="button"
                  onClick={() => { setEmail(mail); setPassword('Password@123') }}
                  className="text-[11px] border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 text-left">
                  <span className="font-semibold block">{label}</span>
                  <span className="text-gray-400">{mail}</span>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
