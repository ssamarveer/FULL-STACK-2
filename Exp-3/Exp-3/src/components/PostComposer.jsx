import { useMemo, useState } from 'react'
import { api } from '../api'
import { PLATFORMS, getPlatform } from '../data/platforms'
import { validatePost } from '../utils/validation'
import PlatformSelector from './PlatformSelector'
import MediaControls from './MediaControls'
import PlatformCard from './PlatformCard'
import CharacterCounter from './CharacterCounter'

const DEFAULT_TEXT =
  'Big news: our new field kit ships next week. Built for people who work outdoors all day and need gear that keeps up. #fieldkit #outdoors #newrelease'

export default function PostComposer({ user }) {
  const [text, setText] = useState(DEFAULT_TEXT)
  const [selectedIds, setSelectedIds] = useState(['x', 'instagram', 'linkedin'])
  const [media, setMedia] = useState({ images: 1, videos: 0 })
  const [overrides, setOverrides] = useState({}) // { [platformId]: string | null }
  const [sent, setSent] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const canPublish = user?.role === 'Admin'

  const togglePlatform = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const setOverride = (id, value) => {
    setOverrides((prev) => ({ ...prev, [id]: value }))
  }

  // Recomputed on every render so every keystroke, media change, or
  // platform toggle is reflected immediately (real-time validation).
  const results = useMemo(
    () =>
      selectedIds.map((id) => {
        const platform = getPlatform(id)
        const effectiveText = overrides[id] ?? text
        return { id, platform, result: validatePost(platform, effectiveText, media) }
      }),
    [selectedIds, overrides, text, media]
  )

  const readyCount = results.filter((r) => r.result.status !== 'error').length
  const totalCount = results.length
  const validToPublish = totalCount > 0 && readyCount === totalCount

  const publish = async () => {
    if (!canPublish || !validToPublish) return
    setSaving(true); setMessage('')
    try {
      await api('/posts', { method: 'POST', body: JSON.stringify({ text, platforms: selectedIds.map(id => getPlatform(id).name), media, overrides }) })
      setSent(true); setMessage('Post saved successfully. Open Posts to view it.')
    } catch (e) { setMessage(e.message) } finally { setSaving(false) }
  }

  return (
    <div className="composer">
      <header className="composer-header">
        <h1>Post Composer</h1>
        <p className="composer-subtitle">Write once, validate against every platform's rules in real time</p>
      </header>

      <div className="composer-layout">
        <section className="composer-column">
          <h2 className="section-label">Draft</h2>
          <textarea
            className="draft-textarea"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setSent(false)
            }}
            placeholder="Write your post..."
          />
          <CharacterCounter text={text} />

          <h2 className="section-label">Media</h2>
          <MediaControls
            media={media}
            onChange={(next) => {
              setMedia(next)
              setSent(false)
            }}
          />

          <h2 className="section-label">Platforms</h2>
          <PlatformSelector selectedIds={selectedIds} onToggle={togglePlatform} />
        </section>

        <section className="composer-column">
          <h2 className="section-label">Validation</h2>
          {results.length === 0 && (
            <p className="empty-state">Select at least one platform to see its constraints.</p>
          )}
          {results.map(({ id, platform, result }) => (
            <PlatformCard
              key={id}
              platform={platform}
              text={text}
              media={media}
              override={overrides[id] ?? null}
              onOverrideChange={(value) => {
                setOverride(id, value)
                setSent(false)
              }}
            />
          ))}
        </section>
      </div>

      <footer className="composer-footer">
        <span className="footer-status">
          <strong>{readyCount} of {totalCount}</strong> platforms ready
        </span>
        <div>{message && <span className="footer-message">{message}</span>}</div>
        <button
          type="button"
          className={`publish-button${sent ? ' sent' : ''}`}
          disabled={!canPublish || !validToPublish || saving}
          onClick={publish}
        >
          {!canPublish ? 'Admin only' : saving ? 'Publishing…' : sent ? 'Published' : 'Publish post'}
        </button>
      </footer>
    </div>
  )
}
