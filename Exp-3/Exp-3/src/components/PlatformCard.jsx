import { useState } from 'react'
import { validatePost } from '../utils/validation'

const STATUS_LABEL = {
  ready: 'Ready',
  warn: 'Check',
  error: 'Over limit'
}

const ICON = { ok: '✓', warning: '!', error: '✕' }

// Displays live validation for a single platform: a fill gauge against
// its character limit, a status badge, and a message list that updates
// on every keystroke or media change (real-time feedback).
export default function PlatformCard({ platform, text, media, override, onOverrideChange }) {
  const [customizing, setCustomizing] = useState(false)
  const effectiveText = override ?? text
  const result = validatePost(platform, effectiveText, media)

  const usedPct = Math.min(100, (result.length / result.limit) * 100)
  const overPct = result.length > result.limit
    ? Math.min(30, ((result.length - result.limit) / result.limit) * 100)
    : 0

  return (
    <div className="platform-card">
      <div className="platform-card-head">
        <span className="chip-code">{platform.code}</span>
        <span className="platform-card-name">{platform.name}</span>
        <span className={`status-badge status-${result.status}`}>{STATUS_LABEL[result.status]}</span>
      </div>

      <div className="gauge">
        <div className={`gauge-fill gauge-${result.status}`} style={{ width: `${usedPct}%` }} />
        {overPct > 0 && <div className="gauge-overset" style={{ width: `${overPct}%` }} />}
      </div>
      <div className="gauge-count">
        <span>{result.length.toLocaleString()} / {result.limit.toLocaleString()} chars</span>
        <span>{result.hashtags} tags</span>
      </div>

      <ul className="message-list">
        {result.messages.map((m, i) => (
          <li key={i} className={`message message-${m.type}`}>
            <span className="message-icon">{ICON[m.type]}</span>
            <span>{m.text}</span>
          </li>
        ))}
      </ul>

      <button type="button" className="link-button" onClick={() => setCustomizing((v) => !v)}>
        {customizing ? 'Hide' : 'Customize'} copy for {platform.name}
      </button>

      {customizing && (
        <textarea
          className="override-textarea"
          placeholder={`Write ${platform.name}-specific copy, or leave blank to use the shared draft.`}
          value={override ?? ''}
          onChange={(e) => onOverrideChange(e.target.value.length ? e.target.value : null)}
        />
      )}
    </div>
  )
}
