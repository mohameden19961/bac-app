import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { BookOpen, LogIn, Zap } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, loginDemo } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      toast.error('Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = async () => {
    setLoading(true)
    try {
      await loginDemo()
      navigate('/')
    } catch {
      toast.error('Erreur connexion démo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--gradient-main)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 p-12 text-white">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">BacPrep MR</span>
          </div>
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Prépare ton bac avec<br />
            <span className="text-cyan-300">l'intelligence artificielle</span>
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Cours interactifs, exercices corrigés et assistant IA disponible 24h/24 pour les séries C et D du baccalauréat mauritanien.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Cours', value: '120+' },
              { label: 'Exercices', value: '500+' },
              { label: 'Élèves', value: '1000+' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 rounded-xl p-4 text-center backdrop-blur">
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-white/70 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">BacPrep MR</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Connexion</h2>
          <p className="text-slate-500 mb-8">Accède à ton espace de révision</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="ton@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><LogIn className="w-4 h-4" />Se connecter</>}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-sm"><span className="bg-white px-3 text-slate-400">ou</span></div>
          </div>

          <button
            onClick={handleDemo}
            disabled={loading}
            className="w-full py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-semibold hover:bg-emerald-100 transition flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Accès démo (user: demo / pass: demo)
          </button>

          <p className="text-center text-slate-500 text-sm mt-6">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
