import { useState } from 'react'
import api from '../../services/api'

const AIChat = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your BudgetBuddy AI advisor. I can see your real financial data — ask me anything about your spending, budgets, goals or investments!"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const history = updatedMessages
        .slice(1)
        .slice(0, -1)
        .map(msg => ({ role: msg.role, content: msg.content }))

      const res = await api.post('/ai/chat', {
        message: input,
        history
      })

      setMessages([...updatedMessages, {
        role: 'assistant',
        content: res.data.reply
      }])
    } catch (err) {
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: 'Sorry, I ran into an error. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestions = [
    'Summarize my finances',
    'Am I overspending?',
    'How are my investments doing?',
    'Tips to reach my goals faster'
  ]

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <div className="ai-panel-title">
          <div className="ai-dot" />
          <span>BudgetBuddy AI</span>
        </div>
        <button className="ai-close" onClick={onClose}>✕</button>
      </div>

      <div className="ai-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`ai-message ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="ai-avatar">AI</div>
            )}
            <div className="ai-bubble">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="ai-message assistant">
            <div className="ai-avatar">AI</div>
            <div className="ai-bubble ai-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>

      {messages.length === 1 && (
        <div className="ai-suggestions">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="ai-suggestion"
              onClick={() => setInput(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="ai-input-row">
        <input
          type="text"
          className="ai-input"
          placeholder="Ask about your finances..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="ai-send"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          →
        </button>
      </div>
    </div>
  )
}

export default AIChat