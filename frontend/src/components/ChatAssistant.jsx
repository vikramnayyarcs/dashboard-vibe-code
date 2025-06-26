import React, { useState } from 'react';
import { AGUIAgent } from '../agent/aguiAgent';

const agent = new AGUIAgent('/api/agent'); // endpoint is a placeholder

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'How can I help? (AG-UI Agent ready)' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setLoading(true);
    const response = await agent.sendMessage(input);
    setMessages(msgs => [...msgs, { from: 'bot', text: response.content }]);
    setInput('');
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 400 }}>
      <div style={{ minHeight: 80, marginBottom: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === 'bot' ? 'left' : 'right', margin: 2 }}>
            <span style={{ background: m.from === 'bot' ? '#eee' : '#cce', borderRadius: 6, padding: '4px 8px' }}>{m.text}</span>
          </div>
        ))}
        {loading && <div style={{ color: '#888' }}>Agent is typing...</div>}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} style={{ width: '80%' }} placeholder="Ask a question..." disabled={loading} />
      <button onClick={send} disabled={loading}>Send</button>
    </div>
  );
}
