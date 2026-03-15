import { useState } from 'react'
import { FlaskConical, CheckCircle, XCircle, RotateCcw, Trophy, ChevronRight, Sparkles, Loader } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'

const MATIERES = {
  Mathématiques: {
    color: 'bg-blue-600',
    light: 'bg-blue-50 border-blue-200',
    icon: '∑',
    topics: ['Équations du 2nd degré', 'Dérivation', 'Suites numériques', 'Intégration', 'Nombres complexes', 'Probabilités', 'Limites et continuité', 'Arithmétique', 'Géométrie dans l\'espace', 'Variables aléatoires'],
  },
  'Physique & Chimie': {
    color: 'bg-purple-600',
    light: 'bg-purple-50 border-purple-200',
    icon: '⚛️',
    topics: ['Lois de Newton', 'Énergie et travail', 'Circuits RC/RL', 'Optique géométrique', 'Réactions acido-basiques', 'Cinématique', 'Oscillations mécaniques', 'Oxydoréduction', 'Courant alternatif', 'Cinétique chimique'],
  },
  'Sciences Naturelles': {
    color: 'bg-green-600',
    light: 'bg-green-50 border-green-200',
    icon: '🧬',
    topics: ['La cellule', 'Génétique moléculaire', 'Génétique mendélienne', 'Système nerveux', 'Immunologie', 'Tectonique des plaques', 'Métabolisme cellulaire', 'Reproduction', 'Roches et minéraux', 'Écosystèmes'],
  },
}

const NIVEAUX = ['Débutant', 'Intermédiaire', 'Avancé']

export default function ExercicesPage() {
  const { updateStats } = useAuth()
  const [matiere, setMatiere] = useState('Mathématiques')
  const [topic, setTopic] = useState('')
  const [niveau, setNiveau] = useState('Intermédiaire')
  const [nbQuestions, setNbQuestions] = useState(5)
  const [exercice, setExercice] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [error, setError] = useState('')

  const generateExercice = async () => {
    const sujet = topic || MATIERES[matiere].topics[0]
    setGenerating(true)
    setError('')
    setExercice(null)
    setAnswers({})
    setSubmitted(false)

    try {
      const prompt = `Génère un QCM de ${nbQuestions} questions sur le sujet "${sujet}" en ${matiere} pour le baccalauréat mauritanien (série C et D), niveau ${niveau}.

Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans backticks, sans explication. Format exact :
{
  "titre": "titre du QCM",
  "questions": [
    {
      "q": "texte de la question",
      "options": ["option A", "option B", "option C", "option D"],
      "correct": 0,
      "explication": "explication de la bonne réponse"
    }
  ]
}

Règles :
- "correct" est l'index (0,1,2,3) de la bonne réponse dans "options"
- Les questions doivent être adaptées au programme mauritanien
- Les explications doivent être claires et pédagogiques
- Utilise des formules simples (pas de LaTeX complexe)`

      const res = await axios.post('http://192.168.100.6:5000/api/assistant/chat', {
        message: prompt
      })

      let text = res.data.message.trim()
      // Nettoyer le JSON si l'IA ajoute des backticks
      text = text.replace(/```json/g, '').replace(/```/g, '').trim()
      
      const data = JSON.parse(text)
      setExercice({ ...data, matiere, sujet })
    } catch (err) {
      setError("Erreur lors de la génération. Réessaie.")
    } finally {
      setGenerating(false)
    }
  }

  const handleAnswer = (qi, ai) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qi]: ai }))
  }

  const handleSubmit = async () => {
    const total = exercice.questions.length
    let s = 0
    exercice.questions.forEach((q, i) => {
      if (answers[i] === q.correct) s++
    })
    setScore(s)
    setSubmitted(true)
    await updateStats({ exercicesDone: 1, score: s * 10, minutesRevision: 5, matiere: exercice.matiere, progressionPct: Math.round((s / total) * 100) })
  }

  const reset = () => {
    setExercice(null)
    setAnswers({})
    setSubmitted(false)
    setScore(0)
  }

  // Vue résultats + questions
  if (exercice) {
    const total = exercice.questions.length
    const pct = submitted ? Math.round((score / total) * 100) : 0

    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={reset} className="text-sm text-slate-500 hover:text-blue-600 transition">← Nouveau QCM</button>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{exercice.titre}</h2>
            <p className="text-xs text-slate-500">{exercice.matiere} · {exercice.sujet} · {niveau}</p>
          </div>
          <span className="ml-auto flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full border border-purple-200">
            <Sparkles className="w-3 h-3" /> Généré par IA
          </span>
        </div>

        {submitted && (
          <div className={`rounded-2xl p-5 mb-6 text-center ${pct >= 60 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <Trophy className={`w-10 h-10 mx-auto mb-2 ${pct >= 60 ? 'text-green-600' : 'text-red-500'}`} />
            <div className="text-3xl font-bold text-slate-800">{score}/{total}</div>
            <div className={`text-lg font-semibold ${pct >= 60 ? 'text-green-700' : 'text-red-600'}`}>{pct}%</div>
            <p className="text-sm text-slate-600 mt-1">
              {pct >= 80 ? 'Excellent ! 🎉' : pct >= 60 ? 'Bien, continue ! 💪' : 'Révise et réessaie ! 📚'}
            </p>
            <div className="flex gap-2 justify-center mt-3">
              <button onClick={() => { setAnswers({}); setSubmitted(false); setScore(0) }}
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                <RotateCcw className="w-4 h-4" /> Recommencer
              </button>
              <span className="text-slate-300">·</span>
              <button onClick={generateExercice}
                className="flex items-center gap-1 text-sm text-purple-600 hover:underline">
                <Sparkles className="w-4 h-4" /> Nouveau QCM
              </button>
            </div>
          </div>
        )}

        <div className="space-y-5">
          {exercice.questions.map((question, qi) => {
            const isCorrect = answers[qi] === question.correct
            return (
              <div key={qi} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start gap-2 mb-4">
                  <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{qi + 1}</span>
                  <p className="font-medium text-slate-800 text-sm">{question.q}</p>
                </div>
                <div className="space-y-2">
                  {question.options.map((opt, oi) => {
                    let style = 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                    if (submitted) {
                      if (oi === question.correct) style = 'border-green-400 bg-green-50 text-green-800'
                      else if (answers[qi] === oi) style = 'border-red-400 bg-red-50 text-red-700'
                      else style = 'border-slate-200 bg-slate-50 text-slate-400'
                    } else if (answers[qi] === oi) {
                      style = 'border-blue-500 bg-blue-50 text-blue-800'
                    }
                    return (
                      <button key={oi} onClick={() => handleAnswer(qi, oi)}
                        className={`w-full text-left px-4 py-3 border rounded-xl text-sm transition flex items-center gap-2 ${style}`}>
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs flex-shrink-0">
                          {String.fromCharCode(65 + oi)}
                        </span>
                        {opt}
                        {submitted && oi === question.correct && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
                        {submitted && answers[qi] === oi && oi !== question.correct && <XCircle className="w-4 h-4 text-red-500 ml-auto" />}
                      </button>
                    )
                  })}
                </div>
                {submitted && (
                  <div className={`mt-3 p-3 rounded-xl text-xs ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'}`}>
                    💡 {question.explication}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {!submitted && (
          <button onClick={handleSubmit}
            disabled={Object.keys(answers).length < exercice.questions.length}
            className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" /> Valider mes réponses ({Object.keys(answers).length}/{exercice.questions.length})
          </button>
        )}
      </div>
    )
  }

  // Vue génération
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-purple-600" /> Exercices & QCM
        </h1>
        <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-purple-500" /> Exercices générés par IA selon le programme mauritanien
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">

        {/* Matière */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Matière</label>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(MATIERES).map(m => (
              <button key={m} onClick={() => { setMatiere(m); setTopic('') }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${matiere === m ? MATIERES[m].color + ' text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {MATIERES[m].icon} {m}
              </button>
            ))}
          </div>
        </div>

        {/* Sujet */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Sujet / Chapitre</label>
          <div className="grid grid-cols-2 gap-2">
            {MATIERES[matiere].topics.map(t => (
              <button key={t} onClick={() => setTopic(t)}
                className={`text-left px-3 py-2 rounded-xl text-xs transition border ${topic === t ? 'border-blue-400 bg-blue-50 text-blue-700 font-medium' : 'border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50'}`}>
                {t}
              </button>
            ))}
          </div>
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Ou tape un sujet personnalisé..."
            className="mt-2 w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Niveau + Nombre de questions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Niveau</label>
            <div className="flex gap-2 flex-wrap">
              {NIVEAUX.map(n => (
                <button key={n} onClick={() => setNiveau(n)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${niveau === n ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Nombre de questions : <span className="text-blue-600">{nbQuestions}</span></label>
            <input type="range" min="3" max="10" value={nbQuestions}
              onChange={e => setNbQuestions(Number(e.target.value))}
              className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>3</span><span>10</span></div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl">{error}</p>}

        {/* Bouton générer */}
        <button onClick={generateExercice} disabled={generating}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2">
          {generating ? (
            <><Loader className="w-4 h-4 animate-spin" /> L'IA génère vos questions...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Générer le QCM avec l'IA <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  )
}
