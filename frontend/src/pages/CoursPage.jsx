import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ChevronRight, Clock, Star, Search, Lock } from 'lucide-react'

const cours = {
  Mathématiques: [
    // Analyse
    { id: 1, titre: 'Suites numériques', chapitres: 4, duree: '3h', niveau: 'Avancé', desc: 'Suites arithmétiques, géométriques, convergence et divergence' },
    { id: 2, titre: 'Limites et continuité', chapitres: 4, duree: '2h30', niveau: 'Avancé', desc: 'Limites de fonctions, continuité, théorème des valeurs intermédiaires' },
    { id: 3, titre: 'Dérivation', chapitres: 5, duree: '3h', niveau: 'Intermédiaire', desc: 'Nombre dérivé, règles de dérivation, applications aux variations' },
    { id: 4, titre: 'Intégration', chapitres: 4, duree: '2h30', niveau: 'Avancé', desc: 'Primitives, intégrale de Riemann, calcul d\'aires' },
    { id: 5, titre: 'Équations différentielles', chapitres: 3, duree: '2h', niveau: 'Avancé', desc: 'Équations du 1er et 2ème ordre, applications (Série C)' },
    // Algèbre
    { id: 6, titre: 'Nombres complexes', chapitres: 4, duree: '2h30', niveau: 'Avancé', desc: 'Forme algébrique, trigonométrique, exponentielle et applications' },
    { id: 7, titre: 'Arithmétique', chapitres: 3, duree: '2h', niveau: 'Intermédiaire', desc: 'Divisibilité, PGCD, congruences, théorème de Bézout' },
    { id: 8, titre: 'Matrices et déterminants', chapitres: 4, duree: '2h30', niveau: 'Avancé', desc: 'Opérations sur les matrices, déterminants, systèmes linéaires (Série C)' },
    // Géométrie
    { id: 9, titre: 'Géométrie dans l\'espace', chapitres: 4, duree: '2h', niveau: 'Intermédiaire', desc: 'Vecteurs, droites, plans dans R³, produit scalaire et vectoriel' },
    { id: 10, titre: 'Coniques', chapitres: 3, duree: '1h45', niveau: 'Intermédiaire', desc: 'Parabole, ellipse, hyperbole et leurs équations (Série C)' },
    // Probabilités
    { id: 11, titre: 'Dénombrement et probabilités', chapitres: 4, duree: '2h', niveau: 'Intermédiaire', desc: 'Arrangements, permutations, combinaisons, probabilités conditionnelles' },
    { id: 12, titre: 'Variables aléatoires', chapitres: 4, duree: '2h30', niveau: 'Avancé', desc: 'Loi binomiale, loi de Poisson, loi normale, espérance et variance' },
  ],

  'Physique & Chimie': [
    // Mécanique
    { id: 13, titre: 'Cinématique', chapitres: 3, duree: '2h', niveau: 'Intermédiaire', desc: 'Mouvements rectilignes, circulaires, équations horaires' },
    { id: 14, titre: 'Dynamique — Lois de Newton', chapitres: 4, duree: '2h30', niveau: 'Intermédiaire', desc: 'Principe d\'inertie, loi fondamentale, interactions et forces' },
    { id: 15, titre: 'Énergie et travail', chapitres: 3, duree: '2h', niveau: 'Intermédiaire', desc: 'Travail d\'une force, énergie cinétique, potentielle, conservation' },
    { id: 16, titre: 'Oscillations mécaniques', chapitres: 4, duree: '2h30', niveau: 'Avancé', desc: 'Pendule simple, oscillateur masse-ressort, résonance' },
    // Électricité
    { id: 17, titre: 'Circuits en régime transitoire', chapitres: 4, duree: '3h', niveau: 'Avancé', desc: 'Dipôles RC, RL, RLC — charge, décharge, oscillations libres' },
    { id: 18, titre: 'Courant alternatif sinusoïdal', chapitres: 3, duree: '2h', niveau: 'Avancé', desc: 'Impédance, déphasage, puissance, résonance en tension' },
    // Optique
    { id: 19, titre: 'Optique géométrique', chapitres: 3, duree: '2h', niveau: 'Débutant', desc: 'Lois de Snell-Descartes, réflexion, réfraction, lentilles minces' },
    { id: 20, titre: 'Optique ondulatoire', chapitres: 3, duree: '1h45', niveau: 'Intermédiaire', desc: 'Diffraction, interférences, lumière cohérente' },
    // Chimie
    { id: 21, titre: 'Réactions acido-basiques', chapitres: 4, duree: '2h30', niveau: 'Intermédiaire', desc: 'Acides, bases, pH, neutralisation, dosages' },
    { id: 22, titre: 'Réactions d\'oxydoréduction', chapitres: 3, duree: '2h', niveau: 'Intermédiaire', desc: 'Oxydants, réducteurs, couples redox, piles électrochimiques' },
    { id: 23, titre: 'Cinétique chimique', chapitres: 3, duree: '2h', niveau: 'Avancé', desc: 'Vitesse de réaction, facteurs cinétiques, catalyse' },
  ],

  'Sciences Naturelles': [
    // Biologie cellulaire
    { id: 24, titre: 'La cellule et ses divisions', chapitres: 4, duree: '2h', niveau: 'Débutant', desc: 'Structure cellulaire, mitose, méiose et leurs rôles' },
    { id: 25, titre: 'Métabolisme cellulaire', chapitres: 3, duree: '2h', niveau: 'Intermédiaire', desc: 'Photosynthèse, respiration cellulaire, fermentation' },
    // Génétique
    { id: 26, titre: 'Génétique moléculaire', chapitres: 5, duree: '3h', niveau: 'Avancé', desc: 'ADN, ARN, réplication, transcription, traduction, mutations' },
    { id: 27, titre: 'Génétique mendélienne', chapitres: 4, duree: '2h30', niveau: 'Intermédiaire', desc: 'Lois de Mendel, hérédité liée au sexe, arbres généalogiques' },
    // Physiologie
    { id: 28, titre: 'Système nerveux', chapitres: 4, duree: '2h', niveau: 'Intermédiaire', desc: 'Neurone, influx nerveux, synapses, système nerveux central et périphérique' },
    { id: 29, titre: 'Immunologie', chapitres: 4, duree: '2h30', niveau: 'Intermédiaire', desc: 'Défenses naturelles, immunité spécifique, vaccins, sida' },
    { id: 30, titre: 'Reproduction et développement', chapitres: 3, duree: '2h', niveau: 'Intermédiaire', desc: 'Gamétogenèse, fécondation, développement embryonnaire, hormones' },
    // Géologie
    { id: 31, titre: 'Tectonique des plaques', chapitres: 4, duree: '2h', niveau: 'Intermédiaire', desc: 'Structure du globe, dérive des continents, dorsales, subduction' },
    { id: 32, titre: 'Roches et minéraux', chapitres: 3, duree: '1h30', niveau: 'Débutant', desc: 'Roches magmatiques, sédimentaires, métamorphiques et cycles' },
    // Écologie
    { id: 33, titre: 'Écosystèmes et biosphère', chapitres: 3, duree: '1h30', niveau: 'Débutant', desc: 'Chaînes alimentaires, cycles biogéochimiques, équilibres écologiques' },
  ],
}

const matieresBientot = [
  { nom: 'Éducation Islamique', icon: '☪️' },
  { nom: 'Arabe', icon: 'ع' },
  { nom: 'Français', icon: 'Fr' },
  { nom: 'Anglais', icon: 'En' },
]

const niveauColor = {
  Débutant: 'bg-green-100 text-green-700',
  Intermédiaire: 'bg-amber-100 text-amber-700',
  Avancé: 'bg-red-100 text-red-700',
}

const matiereColor = {
  Mathématiques: { tab: 'bg-blue-600 text-white', icon: '∑', accent: 'border-blue-200 hover:border-blue-400' },
  'Physique & Chimie': { tab: 'bg-purple-600 text-white', icon: '⚛️', accent: 'border-purple-200 hover:border-purple-400' },
  'Sciences Naturelles': { tab: 'bg-green-600 text-white', icon: '🧬', accent: 'border-green-200 hover:border-green-400' },
}

export default function CoursPage() {
  const navigate = useNavigate()
  const [matiere, setMatiere] = useState('Mathématiques')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const liste = cours[matiere].filter(c =>
    c.titre.toLowerCase().includes(search.toLowerCase()) ||
    c.desc.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" /> Bibliothèque de cours
        </h1>
        <p className="text-slate-500 text-sm mt-1">Programme officiel du baccalauréat mauritanien — Séries C & D</p>
      </div>

      {/* Matières scientifiques */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {Object.keys(cours).map(m => (
          <button key={m}
            onClick={() => { setMatiere(m); setSelected(null) }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition ${
              matiere === m ? matiereColor[m].tab : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
            <span>{matiereColor[m].icon}</span> {m}
          </button>
        ))}
      </div>

      {/* Matières bientôt disponibles */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {matieresBientot.map(m => (
          <div key={m.nom}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed select-none">
            <Lock className="w-3 h-3" />
            <span className="font-medium">{m.icon}</span> {m.nom}
            <span className="text-xs bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full">Bientôt</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un cours..."
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        />
      </div>

      {/* Cours list */}
      <div className="grid sm:grid-cols-2 gap-4">
        {liste.map(c => (
          <div key={c.id}
            onClick={(e) => { e.stopPropagation(); setSelected(selected?.id === c.id ? null : c) }}
            className={`bg-white border rounded-xl p-5 cursor-pointer transition-all shadow-sm ${matiereColor[matiere].accent} ${selected?.id === c.id ? 'ring-2 ring-blue-400' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-slate-800 text-sm leading-tight">{c.titre}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 flex-shrink-0 ${niveauColor[c.niveau]}`}>{c.niveau}</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">{c.desc}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{c.chapitres} chapitres</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.duree}</span>
            </div>

            {selected?.id === c.id && (
              <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/cours/${c.id}`) }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition flex items-center justify-center gap-1">
                    <ChevronRight className="w-3 h-3" /> Commencer le cours
                  </button>
                  <button className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 transition flex items-center justify-center gap-1">
                    <Star className="w-3 h-3" /> Ajouter aux favoris
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
