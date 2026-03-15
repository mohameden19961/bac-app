import { Router } from 'express'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

router.post('/chat', verifyToken, async (req, res) => {
  const { messages } = req.body
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages requis' })
  }
  try {
    const lastMessage = messages[messages.length - 1].content
    const prompt = `Tu es un assistant pédagogique pour le baccalauréat mauritanien séries C et D. Réponds en français de façon claire et pédagogique.\n\nQuestion: ${lastMessage}`
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )
    const data = await response.json()
    console.log('Gemini:', JSON.stringify(data).slice(0, 200))
    const message = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Erreur Gemini: ' + JSON.stringify(data?.error)
    res.json({ message })
  } catch (err) {
    console.error('Gemini error:', err.message)
    res.status(500).json({ error: 'Erreur IA' })
  }
})

export default router
