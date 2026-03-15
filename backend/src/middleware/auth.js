import { adminAuth } from '../config/firebase.js'

export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' })
  }
  const token = authHeader.split('Bearer ')[1]
  try {
    const decoded = await adminAuth().verifyIdToken(token)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Token invalide ou expiré' })
  }
}

// Optional auth (does not block if no token)
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split('Bearer ')[1]
      req.user = await adminAuth().verifyIdToken(token)
    } catch {}
  }
  next()
}
