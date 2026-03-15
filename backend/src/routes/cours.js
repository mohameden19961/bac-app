import { Router } from 'express'
import { optionalAuth } from '../middleware/auth.js'

const router = Router()

// Static cours data (would come from Firestore in production)
const coursData = [
  { id: '1', matiere: 'maths', titre: 'Les suites numériques', chapitres: 4, niveau: 'avance', serie: ['C', 'D'] },
  { id: '2', matiere: 'maths', titre: 'Fonctions dérivées', chapitres: 5, niveau: 'intermediaire', serie: ['C', 'D'] },
  { id: '3', matiere: 'maths', titre: 'Intégration', chapitres: 4, niveau: 'avance', serie: ['C', 'D'] },
  { id: '4', matiere: 'physique', titre: 'Mécanique du point', chapitres: 5, niveau: 'intermediaire', serie: ['C'] },
  { id: '5', matiere: 'physique', titre: 'Électricité', chapitres: 4, niveau: 'intermediaire', serie: ['C'] },
  { id: '6', matiere: 'svt', titre: 'La cellule', chapitres: 4, niveau: 'debutant', serie: ['D'] },
  { id: '7', matiere: 'svt', titre: 'Génétique', chapitres: 5, niveau: 'intermediaire', serie: ['D'] },
]

router.get('/', optionalAuth, (req, res) => {
  const { matiere, serie } = req.query
  let result = coursData
  if (matiere) result = result.filter(c => c.matiere === matiere)
  if (serie) result = result.filter(c => c.serie.includes(serie))
  res.json({ cours: result, total: result.length })
})

router.get('/:id', optionalAuth, (req, res) => {
  const cours = coursData.find(c => c.id === req.params.id)
  if (!cours) return res.status(404).json({ error: 'Cours non trouvé' })
  res.json({ cours })
})

export default router
