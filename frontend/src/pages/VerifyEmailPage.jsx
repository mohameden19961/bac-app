import { BookOpen, Mail, RefreshCw } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { sendEmailVerification } from 'firebase/auth'
import { auth } from '../utils/firebase'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function VerifyEmailPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)

  const resend = async () => {
    setSending(true)
    try {
      await sendEmailVerification(auth.currentUser)
      toast.success('Email renvoyé !')
    } catch {
      toast.error('Erreur lors de l\'envoi')
    } finally {
      setSending(false)
    }
  }

  const checkVerified = async () => {
    await auth.currentUser.reload()
    if (auth.currentUser.emailVerified) {
      toast.success('Email vérifié ! Bienvenue 🎉')
      navigate('/')
    } else {
      toast.error('Email pas encore vérifié')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--gradient-main)' }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center animate-slide-up">
        <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-4" />
        <Mail className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Vérifie ton email</h2>
        <p className="text-slate-500 mb-2">Un email de vérification a été envoyé à :</p>
        <p className="text-blue-600 font-semibold mb-6">{user?.email}</p>
        <p className="text-slate-500 text-sm mb-6">Clique sur le lien dans l'email puis reviens ici.</p>
        <div className="space-y-3">
          <button onClick={checkVerified}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
            J'ai vérifié mon email ✓
          </button>
          <button onClick={resend} disabled={sending}
            className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" /> Renvoyer l'email
          </button>
          <button onClick={logout}
            className="w-full py-2 text-slate-400 text-sm hover:text-red-500 transition">
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  )
}
