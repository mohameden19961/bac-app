import admin from 'firebase-admin'

let initialized = false

export function initFirebase() {
  if (initialized) return
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
    } else {
      // Dev mode: use application default credentials
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      })
    }
    initialized = true
    console.log('✅ Firebase Admin initialisé')
  } catch (err) {
    console.error('❌ Erreur Firebase Admin:', err.message)
  }
}

export const adminAuth = () => admin.auth()
export const adminDb = () => admin.firestore()
