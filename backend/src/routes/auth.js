import { Router } from 'express'
import { adminAuth, adminDb } from '../config/firebase.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

// Get current user profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const doc = await adminDb().collection('users').doc(req.user.uid).get()
    if (!doc.exists) return res.status(404).json({ error: 'Utilisateur non trouvé' })
    res.json({ user: { uid: req.user.uid, ...doc.data() } })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Update progression
router.patch('/progression', verifyToken, async (req, res) => {
  const { matiere, valeur } = req.body
  if (!matiere || valeur === undefined) return res.status(400).json({ error: 'Données manquantes' })

  try {
    await adminDb().collection('users').doc(req.user.uid).update({
      [`progression.${matiere}`]: valeur
    })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Erreur mise à jour' })
  }
})

// Create demo account (called once at setup)
router.post('/setup-demo', async (req, res) => {
  const secret = req.headers['x-setup-secret']
  if (secret !== process.env.SETUP_SECRET) return res.status(403).json({ error: 'Interdit' })

  try {
    // Create demo user in Firebase Auth
    let user
    try {
      user = await adminAuth().getUserByEmail('demo@bacprep.mr')
    } catch {
      user = await adminAuth().createUser({
        email: 'demo@bacprep.mr',
        password: 'demo1234',
        displayName: 'Élève Demo',
      })
    }

    // Create user document
    await adminDb().collection('users').doc(user.uid).set({
      name: 'Élève Demo',
      email: 'demo@bacprep.mr',
      serie: 'C',
      progression: { maths: 35, physique: 20, svt: 10 },
      exercicesDone: 12,
      chapitresVus: 8,
      minutesRevision: 240,
      score: 150,
    }, { merge: true })

    res.json({ success: true, uid: user.uid })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
