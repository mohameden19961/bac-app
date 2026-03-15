import { useState } from 'react'
import { Calendar, Plus, Trash2, Clock, BookOpen } from 'lucide-react'

const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const matieres = ['Mathématiques', 'Physique', 'Sciences Naturelles', 'Révision générale']
const couleurs = {
  'Mathématiques': 'bg-blue-100 text-blue-700 border-blue-200',
  'Physique': 'bg-purple-100 text-purple-700 border-purple-200',
  'Sciences Naturelles': 'bg-green-100 text-green-700 border-green-200',
  'Révision générale': 'bg-amber-100 text-amber-700 border-amber-200',
}

const defaultPlanning = {
  Lun: [{ matiere: 'Mathématiques', heure: '08:00', duree: '2h', sujet: 'Suites numériques' }],
  Mar: [{ matiere: 'Physique', heure: '10:00', duree: '1h30', sujet: 'Lois de Newton' }],
  Mer: [{ matiere: 'Sciences Naturelles', heure: '09:00', duree: '2h', sujet: 'Génétique' }],
  Jeu: [{ matiere: 'Mathématiques', heure: '08:00', duree: '2h', sujet: 'Dérivées' }, { matiere: 'Physique', heure: '14:00', duree: '1h', sujet: 'Électricité' }],
  Ven: [{ matiere: 'Révision générale', heure: '09:00', duree: '3h', sujet: 'Fiches de révision' }],
  Sam: [{ matiere: 'Mathématiques', heure: '08:00', duree: '2h', sujet: 'Intégration' }],
  Dim: [],
}

export default function PlanningPage() {
  const [planning, setPlanning] = useState(defaultPlanning)
  const [showModal, setShowModal] = useState(false)
  const [selectedJour, setSelectedJour] = useState('Lun')
  const [form, setForm] = useState({ matiere: 'Mathématiques', heure: '08:00', duree: '1h', sujet: '' })

  const addSession = () => {
    if (!form.sujet.trim()) return
    setPlanning(prev => ({
      ...prev,
      [selectedJour]: [...(prev[selectedJour] || []), { ...form }]
    }))
    setShowModal(false)
    setForm({ matiere: 'Mathématiques', heure: '08:00', duree: '1h', sujet: '' })
  }

  const removeSession = (jour, idx) => {
    setPlanning(prev => ({
      ...prev,
      [jour]: prev[jour].filter((_, i) => i !== idx)
    }))
  }

  const totalHeures = Object.values(planning).flat().length

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-500" /> Mon planning de révision
          </h1>
          <p className="text-slate-500 text-sm mt-1">{totalHeures} sessions programmées cette semaine</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-600 transition shadow"
        >
          <Plus className="w-4 h-4" /> Ajouter une session
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Object.entries(
          Object.values(planning).flat().reduce((acc, s) => {
            acc[s.matiere] = (acc[s.matiere] || 0) + 1
            return acc
          }, {})
        ).map(([m, count]) => (
          <div key={m} className={`border rounded-xl px-4 py-3 text-sm ${couleurs[m]}`}>
            <div className="font-bold text-lg">{count}</div>
            <div className="opacity-80 text-xs">{m.split(' ')[0]}</div>
          </div>
        ))}
      </div>

      {/* Calendrier */}
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
        {jours.map(jour => (
          <div key={jour} className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm">
            <div className="text-center font-semibold text-sm text-slate-700 mb-3 pb-2 border-b border-slate-100">{jour}</div>
            <div className="space-y-2">
              {(planning[jour] || []).map((s, i) => (
                <div key={i} className={`border rounded-xl p-2 text-xs relative group ${couleurs[s.matiere]}`}>
                  <button
                    onClick={() => removeSession(jour, i)}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="font-medium mb-0.5 pr-4">{s.sujet}</div>
                  <div className="flex items-center gap-1 opacity-70">
                    <Clock className="w-3 h-3" />{s.heure} · {s.duree}
                  </div>
                </div>
              ))}
              <button
                onClick={() => { setSelectedJour(jour); setShowModal(true) }}
                className="w-full py-1.5 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 hover:border-amber-400 hover:text-amber-500 transition"
              >
                <Plus className="w-3 h-3 inline" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-slide-up">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-500" /> Nouvelle session
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jour</label>
                <select value={selectedJour} onChange={e => setSelectedJour(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">
                  {jours.map(j => <option key={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Matière</label>
                <select value={form.matiere} onChange={e => setForm(f => ({ ...f, matiere: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">
                  {matieres.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Heure</label>
                  <input type="time" value={form.heure} onChange={e => setForm(f => ({ ...f, heure: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Durée</label>
                  <select value={form.duree} onChange={e => setForm(f => ({ ...f, duree: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">
                    {['30min', '1h', '1h30', '2h', '2h30', '3h'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sujet / Chapitre</label>
                <input value={form.sujet} onChange={e => setForm(f => ({ ...f, sujet: e.target.value }))}
                  placeholder="ex: Équations du 2nd degré"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition">
                Annuler
              </button>
              <button onClick={addSession}
                className="flex-1 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition">
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
