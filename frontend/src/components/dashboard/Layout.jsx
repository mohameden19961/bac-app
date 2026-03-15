import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  BookOpen, LayoutDashboard, FlaskConical, MessageCircle,
  Calendar, LogOut, Menu, X, ChevronRight, GraduationCap
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Tableau de bord', end: true },
  { to: '/cours', icon: BookOpen, label: 'Cours' },
  { to: '/exercices', icon: FlaskConical, label: 'Exercices & QCM' },
  { to: '/assistant', icon: MessageCircle, label: 'Assistant IA' },
  { to: '/planning', icon: Calendar, label: 'Planning' },
]

export default function Layout() {
  const { user, userData, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? 'p-4' : 'p-6'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-slate-800">BacPrep MR</div>
          <div className="text-xs text-slate-400">Série {userData?.serie || 'C'}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to} to={to} end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
            {<ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100" />}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="border-t border-slate-100 pt-4 mt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-700 font-semibold text-sm">
              {(user?.displayName || 'U')[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-800 truncate">{user?.displayName || 'Élève'}</div>
            <div className="text-xs text-slate-400 truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 flex-shrink-0 shadow-sm">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl animate-slide-up">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-white border-b border-slate-100">
          <button onClick={() => setOpen(true)} className="text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-slate-800">BacPrep MR</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
