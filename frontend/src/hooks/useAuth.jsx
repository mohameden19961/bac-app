import { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../utils/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        const ref = doc(db, 'users', firebaseUser.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) setUserData(snap.data())
      } else {
        setUser(null)
        setUserData(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const refreshUserData = async () => {
    if (!user) return
    const ref = doc(db, 'users', user.uid)
    const snap = await getDoc(ref)
    if (snap.exists()) setUserData(snap.data())
  }

  // Mettre à jour les stats dans Firestore + état local
  const updateStats = async ({ exercicesDone = 0, chapitresVus = 0, minutesRevision = 0, score = 0, matiere = null, progressionPct = 0 }) => {
    if (!user) return
    const ref = doc(db, 'users', user.uid)
    const updates = {}
    const initFields = {}
    if (!userData?.exercicesDone) initFields.exercicesDone = 0
    if (!userData?.chapitresVus) initFields.chapitresVus = 0
    if (!userData?.minutesRevision) initFields.minutesRevision = 0
    if (Object.keys(initFields).length > 0) await updateDoc(ref, initFields)

    if (exercicesDone > 0) updates.exercicesDone = increment(exercicesDone)
    if (chapitresVus > 0) updates.chapitresVus = increment(chapitresVus)
    if (minutesRevision > 0) updates.minutesRevision = increment(minutesRevision)
    if (score > 0) updates.score = increment(score)
    if (matiere && progressionPct > 0) {
      const key = matiere === 'Mathématiques' ? 'maths' : matiere === 'Physique & Chimie' ? 'physique' : 'svt'
      const current = userData?.progression?.[key] || 0
      const newPct = Math.min(100, Math.max(current, progressionPct))
      updates[`progression.${key}`] = newPct
    }

    await updateDoc(ref, updates)
    await updateDoc(ref, updates)
    await refreshUserData()
  }

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const loginDemo = async () => {
    return signInWithEmailAndPassword(auth, 'demo@bacprep.mr', 'demo1234')
  }

  const register = async (email, password, name, serie) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    await sendEmailVerification(cred.user)
    await setDoc(doc(db, 'users', cred.user.uid), {
      name,
      email,
      serie,
      createdAt: serverTimestamp(),
      progression: { maths: 0, physique: 0, svt: 0 },
      exercicesDone: 0,
      chapitresVus: 0,
      minutesRevision: 0,
      score: 0,
    })
    return cred
  }

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, userData, loading, login, loginDemo, register, logout, updateStats }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
