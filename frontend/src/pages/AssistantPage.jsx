import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Send, Bot, User, Trash2, BookOpen, Lightbulb, Calculator } from 'lucide-react'
import axios from 'axios'

const suggestions = [
  { icon: Calculator, text: 'Explique-moi les équations du second degré', matiere: 'Maths' },
  { icon: BookOpen, text: 'Comment fonctionne la photosynthèse ?', matiere: 'SVT' },
  { icon: Lightbulb, text: 'Quelles sont les lois de Newton ?', matiere: 'Physique' },
  { icon: Calculator, text: 'Aide-moi à résoudre : 2x² - 5x + 3 = 0', matiere: 'Maths' },
]

export default function AssistantPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Salut ! Je suis ton assistant IA pour la préparation du baccalauréat mauritanien (séries C et D) 🎓\n\nJe peux t'aider avec :\n- **Mathématiques** : Algèbre, Analyse, Géométrie\n- **Physique** : Mécanique, Électricité, Optique, Chimie\n- **Sciences Naturelles** : Biologie, Géologie\n\nPose-moi n'importe quelle question sur ton programme !`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return
    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      // Connexion au backend Docker avec ton IP
      // const res = await axios.post('http://192.168.100.6:5000/api/assistant/chat', {
      //   message: text
      // })

      const res = await axios.post('http://192.168.100.6:5000/api/assistant/chat', {
      message: text,
      history: messages.slice(1).map(m => ({ role: m.role, content: m.content }))
})
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.message }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Désolé, une erreur est survenue. Réessaie dans un instant.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" /> Assistant IA
          </h1>
          <p className="text-sm text-slate-500">Spécialisé programme mauritanien — Séries C & D</p>
        </div>
        <button
          onClick={() => setMessages([messages[0]])}
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-red-500 transition"
        >
          <Trash2 className="w-4 h-4" /> Effacer
        </button>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto bg-white border border-slate-100 rounded-2xl p-4 space-y-4 shadow-sm">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold
              ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-slate-50 border border-slate-100 rounded-tl-none'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="prose-ai text-sm text-slate-700">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-2 gap-2 my-3">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => sendMessage(s.text)}
              className="text-left p-3 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition text-sm shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{s.matiere}</span>
              </div>
              <span className="text-slate-600">{s.text}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 mt-3">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Pose ta question... (Entrée pour envoyer)"
          rows={1}
          className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
          style={{ minHeight: '48px', maxHeight: '120px' }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
