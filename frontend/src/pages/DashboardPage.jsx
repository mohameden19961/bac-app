import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { BookOpen, FlaskConical, MessageCircle, Calendar, TrendingUp, Star, Clock } from 'lucide-react'

const matieres = [
  { name: 'Mathématiques', key: 'maths', color: 'blue', icon: '∑', desc: 'Analyse, Algèbre, Géométrie' },
  { name: 'Physique', key: 'physique', color: 'purple', icon: '⚛', desc: 'Mécanique, Électricité, Optique' },
  { name: 'Sciences Naturelles', key: 'svt', color: 'green', icon: '🧬', desc: 'Biologie, Géologie, Écologie' },
]

const colorMap = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', bar: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600', bar: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700' },
  green: { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-600', bar: 'bg-green-500', badge: 'bg-green-100 text-green-700' },
}

const quickLinks = [
  { to: '/cours', icon: BookOpen, label: 'Voir les cours', color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
  { to: '/exercices', icon: FlaskConical, label: 'S\'exercer', color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
  { to: '/assistant', icon: MessageCircle, label: 'Poser une question', color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' },
  { to: '/planning', icon: Calendar, label: 'Mon planning', color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
]

export default function DashboardPage() {
  const { user, userData } = useAuth()
  const progression = userData?.progression || { maths: 0, physique: 0, svt: 0 }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Bonjour'
    if (h < 18) return 'Bon après-midi'
    return 'Bonsoir'
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-sm mb-1">{greeting()},</p>
            <h1 className="text-2xl font-bold">{user?.displayName || 'Élève'} 👋</h1>
            <p className="text-blue-100 mt-2">
              Série <strong>{userData?.serie || 'C'}</strong> · Continue tes révisions !
            </p>
          </div>
          <div className="text-right bg-white/10 rounded-xl p-4 backdrop-blur">
            <div className="text-3xl font-bold">{userData?.score || 0}</div>
            <div className="text-blue-100 text-xs flex items-center gap-1 mt-1"><Star className="w-3 h-3" />Points</div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickLinks.map(({ to, icon: Icon, label, color }) => (
          <Link key={to} to={to}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl text-sm font-medium transition ${color}`}>
            <Icon className="w-6 h-6" />
            {label}
          </Link>
        ))}
      </div>

      {/* Progression par matière */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Ma progression
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {matieres.map((m) => {
            const c = colorMap[m.color]
            const pct = progression[m.key] || 0
            return (
              <div key={m.key} className={`${c.bg} border ${c.border} rounded-xl p-5`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <div className={`text-sm font-semibold ${c.text}`}>{m.name}</div>
                    <div className="text-xs text-slate-500">{m.desc}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progression</span>
                    <span className="font-medium">{pct}%</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div className={`h-full ${c.bar} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Exercices réalisés', value: userData?.exercicesDone || 0, icon: FlaskConical, color: 'text-purple-600' },
          { label: 'Chapitres vus', value: userData?.chapitresVus || 0, icon: BookOpen, color: 'text-blue-600' },
          { label: 'Minutes de révision', value: userData?.minutesRevision || 0, icon: Clock, color: 'text-emerald-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
            <Icon className={`w-6 h-6 ${color} mb-2`} />
            <div className="text-2xl font-bold text-slate-800">{value}</div>
            <div className="text-sm text-slate-500">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
