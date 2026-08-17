import { PLATFORMS } from '../data/platforms'

// Renders one toggle chip per platform. Selecting/deselecting a chip
// adds or removes that platform from the parent's selectedIds state.
export default function PlatformSelector({ selectedIds, onToggle }) {
  return (
    <div className="platform-selector">
      {PLATFORMS.map((platform) => {
        const active = selectedIds.includes(platform.id)
        return (
          <button
            key={platform.id}
            type="button"
            className={`platform-chip${active ? ' active' : ''}`}
            aria-pressed={active}
            onClick={() => onToggle(platform.id)}
          >
            <span className="chip-code">{platform.code}</span>
            <span>{platform.name}</span>
            <span className="chip-limit">{platform.limit.toLocaleString()}</span>
          </button>
        )
      })}
    </div>
  )
}
