import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BookOpen, ChevronLeft, Bot, CheckCircle, Circle, Clock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'

const coursData = {
  // MATHÉMATIQUES
  '1': { titre: 'Suites numériques', matiere: 'Mathématiques', chapitres: ['Définitions et notations', 'Suites arithmétiques', 'Suites géométriques', 'Convergence et limites'] },
  '2': { titre: 'Limites et continuité', matiere: 'Mathématiques', chapitres: ['Limite d\'une fonction', 'Opérations sur les limites', 'Continuité', 'Théorème des valeurs intermédiaires'] },
  '3': { titre: 'Dérivation', matiere: 'Mathématiques', chapitres: ['Nombre dérivé', 'Fonction dérivée', 'Règles de dérivation', 'Applications aux variations', 'Extremums'] },
  '4': { titre: 'Intégration', matiere: 'Mathématiques', chapitres: ['Primitives', 'Intégrale de Riemann', 'Calcul d\'aires', 'Applications'] },
  '5': { titre: 'Équations différentielles', matiere: 'Mathématiques', chapitres: ['Équations du 1er ordre', 'Équations du 2ème ordre', 'Applications physiques'] },
  '6': { titre: 'Nombres complexes', matiere: 'Mathématiques', chapitres: ['Forme algébrique', 'Module et argument', 'Forme trigonométrique', 'Forme exponentielle'] },
  '7': { titre: 'Arithmétique', matiere: 'Mathématiques', chapitres: ['Divisibilité', 'PGCD et PPCM', 'Congruences', 'Théorème de Bézout'] },
  '8': { titre: 'Matrices et déterminants', matiere: 'Mathématiques', chapitres: ['Opérations sur les matrices', 'Déterminants', 'Systèmes linéaires', 'Applications'] },
  '9': { titre: 'Géométrie dans l\'espace', matiere: 'Mathématiques', chapitres: ['Vecteurs dans R³', 'Droites et plans', 'Produit scalaire', 'Produit vectoriel'] },
  '10': { titre: 'Coniques', matiere: 'Mathématiques', chapitres: ['Parabole', 'Ellipse', 'Hyperbole', 'Applications'] },
  '11': { titre: 'Dénombrement et probabilités', matiere: 'Mathématiques', chapitres: ['Arrangements', 'Permutations', 'Combinaisons', 'Probabilités conditionnelles'] },
  '12': { titre: 'Variables aléatoires', matiere: 'Mathématiques', chapitres: ['Loi binomiale', 'Loi de Poisson', 'Loi normale', 'Espérance et variance'] },
  // PHYSIQUE & CHIMIE
  '13': { titre: 'Cinématique', matiere: 'Physique & Chimie', chapitres: ['Mouvement rectiligne', 'Mouvement circulaire', 'Équations horaires'] },
  '14': { titre: 'Dynamique — Lois de Newton', matiere: 'Physique & Chimie', chapitres: ['1ère loi — Inertie', '2ème loi — Loi fondamentale', '3ème loi — Action-Réaction', 'Applications'] },
  '15': { titre: 'Énergie et travail', matiere: 'Physique & Chimie', chapitres: ['Travail d\'une force', 'Énergie cinétique', 'Énergie potentielle', 'Conservation de l\'énergie'] },
  '16': { titre: 'Oscillations mécaniques', matiere: 'Physique & Chimie', chapitres: ['Pendule simple', 'Oscillateur masse-ressort', 'Énergie des oscillations', 'Résonance'] },
  '17': { titre: 'Circuits en régime transitoire', matiere: 'Physique & Chimie', chapitres: ['Dipôle RC', 'Dipôle RL', 'Circuit RLC', 'Oscillations libres'] },
  '18': { titre: 'Courant alternatif sinusoïdal', matiere: 'Physique & Chimie', chapitres: ['Impédance', 'Déphasage', 'Puissance', 'Résonance'] },
  '19': { titre: 'Optique géométrique', matiere: 'Physique & Chimie', chapitres: ['Réflexion', 'Réfraction', 'Lentilles minces', 'Constructions géométriques'] },
  '20': { titre: 'Optique ondulatoire', matiere: 'Physique & Chimie', chapitres: ['Diffraction', 'Interférences', 'Lumière cohérente'] },
  '21': { titre: 'Réactions acido-basiques', matiere: 'Physique & Chimie', chapitres: ['Acides et bases', 'pH', 'Neutralisation', 'Dosages'] },
  '22': { titre: 'Réactions d\'oxydoréduction', matiere: 'Physique & Chimie', chapitres: ['Oxydants et réducteurs', 'Couples redox', 'Piles électrochimiques'] },
  '23': { titre: 'Cinétique chimique', matiere: 'Physique & Chimie', chapitres: ['Vitesse de réaction', 'Facteurs cinétiques', 'Catalyse'] },
  // SCIENCES NATURELLES
  '24': { titre: 'La cellule et ses divisions', matiere: 'Sciences Naturelles', chapitres: ['Structure cellulaire', 'Mitose', 'Méiose', 'Rôles biologiques'] },
  '25': { titre: 'Métabolisme cellulaire', matiere: 'Sciences Naturelles', chapitres: ['Photosynthèse', 'Respiration cellulaire', 'Fermentation'] },
  '26': { titre: 'Génétique moléculaire', matiere: 'Sciences Naturelles', chapitres: ['ADN', 'ARN', 'Réplication', 'Transcription', 'Traduction'] },
  '27': { titre: 'Génétique mendélienne', matiere: 'Sciences Naturelles', chapitres: ['Lois de Mendel', 'Hérédité liée au sexe', 'Arbres généalogiques'] },
  '28': { titre: 'Système nerveux', matiere: 'Sciences Naturelles', chapitres: ['Neurone', 'Influx nerveux', 'Synapses', 'Système nerveux central'] },
  '29': { titre: 'Immunologie', matiere: 'Sciences Naturelles', chapitres: ['Défenses naturelles', 'Immunité spécifique', 'Vaccins', 'SIDA'] },
  '30': { titre: 'Reproduction et développement', matiere: 'Sciences Naturelles', chapitres: ['Gamétogenèse', 'Fécondation', 'Développement embryonnaire', 'Hormones'] },
  '31': { titre: 'Tectonique des plaques', matiere: 'Sciences Naturelles', chapitres: ['Structure du globe', 'Dérive des continents', 'Dorsales océaniques', 'Subduction'] },
  '32': { titre: 'Roches et minéraux', matiere: 'Sciences Naturelles', chapitres: ['Roches magmatiques', 'Roches sédimentaires', 'Roches métamorphiques'] },
  '33': { titre: 'Écosystèmes et biosphère', matiere: 'Sciences Naturelles', chapitres: ['Chaînes alimentaires', 'Cycles biogéochimiques', 'Équilibres écologiques'] },
}

export default function CoursDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cours = coursData[id]

  const { updateStats } = useAuth()
  const [chapitreActif, setChapitreActif] = useState(0)
  const [contenu, setContenu] = useState('')
  const [loading, setLoading] = useState(false)
  const [chapitresFaits, setChapitresFaits] = useState([])

  useEffect(() => {
    if (cours) chargerChapitre(0)
  }, [id])

  const chargerChapitre = async (index) => {
    setChapitreActif(index)
    setContenu('')
    setLoading(true)
    try {
      const chapitre = cours.chapitres[index]
      const res = await axios.post('http://192.168.100.6:5000/api/assistant/chat', {
        message: `Explique-moi le chapitre "${chapitre}" de la matière "${cours.matiere}" pour le baccalauréat mauritanien série C et D. 
        Donne une explication claire avec :
        1. Les notions essentielles à retenir
        2. Les formules importantes (en LaTeX)
        3. Un exemple concret résolu
        Sois concis et pédagogique.`
      })
      setContenu(res.data.message)
      await updateStats({ chapitresVus: 1, minutesRevision: 10, matiere: cours.matiere, progressionPct: Math.round(((index + 1) / cours.chapitres.length) * 100) })
      if (!chapitresFaits.includes(index)) {
        setChapitresFaits(prev => [...prev, index])
      }
    } catch {
      setContenu('❌ Erreur lors du chargement. Réessaie.')
    } finally {
      setLoading(false)
    }
  }

  if (!cours) return (
    <div className="text-center py-20">
      <p className="text-slate-500">Cours introuvable.</p>
      <button onClick={() => navigate('/cours')} className="mt-4 text-blue-600 hover:underline">
        ← Retour aux cours
      </button>
    </div>
  )

  const progression = Math.round((chapitresFaits.length / cours.chapitres.length) * 100)

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/cours')}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition">
          <ChevronLeft className="w-4 h-4" /> Retour
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" /> {cours.titre}
          </h1>
          <p className="text-xs text-slate-500">{cours.matiere}</p>
        </div>
        {/* Barre de progression */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="w-4 h-4" />
          <span>{progression}% complété</span>
          <div className="w-24 h-2 bg-slate-100 rounded-full">
            <div className="h-2 bg-blue-500 rounded-full transition-all" style={{ width: `${progression}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Liste chapitres */}
        <div className="col-span-1">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Chapitres</h2>
            <div className="space-y-2">
              {cours.chapitres.map((ch, i) => (
                <button key={i} onClick={() => chargerChapitre(i)}
                  className={`w-full text-left flex items-center gap-2 p-3 rounded-xl text-sm transition ${
                    chapitreActif === i
                      ? 'bg-blue-50 border border-blue-200 text-blue-700'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}>
                  {chapitresFaits.includes(i)
                    ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    : <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  }
                  <span className="leading-tight">{ch}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenu du chapitre */}
        <div className="col-span-2">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm min-h-96">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Bot className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-slate-800 text-sm">{cours.chapitres[chapitreActif]}</h2>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <p className="text-sm text-slate-400">L'IA prépare le cours...</p>
              </div>
            ) : (
              <div className="prose-ai text-sm text-slate-700">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {contenu}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Navigation chapitres */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => chapitreActif > 0 && chargerChapitre(chapitreActif - 1)}
              disabled={chapitreActif === 0}
              className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition">
              ← Chapitre précédent
            </button>
            <button
              onClick={() => chapitreActif < cours.chapitres.length - 1 && chargerChapitre(chapitreActif + 1)}
              disabled={chapitreActif === cours.chapitres.length - 1}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 transition">
              Chapitre suivant →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
