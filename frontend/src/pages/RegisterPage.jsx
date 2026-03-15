import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { BookOpen, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', serie: 'C' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Mot de passe trop court (min 6 caractères)')
    setLoading(true)
    try {
      await register(form.email, form.password, form.name, form.serie)
      toast.success('Compte créé ! Vérifie ton email pour activer ton compte.')
      navigate('/verify-email')
    } catch (err) {
      toast.error(err.code === 'auth/email-already-in-use' ? 'Email déjà utilisé' : 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--gradient-main)' }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold text-blue-600">BacPrep MR</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Créer un compte</h2>
        <p className="text-slate-500 mb-6">Rejoins des milliers d'élèves mauritaniens</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
            <input
              value={form.name} onChange={set('name')} required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ton nom complet"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email" value={form.email} onChange={set('email')} required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ton@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Série</label>
            <select
              value={form.serie} onChange={set('serie')}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="C">Série C (Maths & Physique)</option>
              <option value="D">Série D (Maths & Sciences naturelles)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
            <input
              type="password" value={form.password} onChange={set('password')} required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Minimum 6 caractères"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading
              ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><UserPlus className="w-4 h-4" />Créer mon compte</>}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
