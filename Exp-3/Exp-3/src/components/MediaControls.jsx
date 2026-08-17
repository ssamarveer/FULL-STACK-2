// Simple +/- steppers for simulating attached image and video counts.
// Real implementations would replace this with an actual file uploader,
// but the counts are what the validation rules care about.
export default function MediaControls({ media, onChange }) {
  const step = (key, delta) => {
    const next = Math.max(0, media[key] + delta)
    onChange({ ...media, [key]: next })
  }

  return (
    <div className="media-controls">
      <div className="stepper">
        <span className="stepper-label">Images</span>
        <div className="stepper-row">
          <button type="button" onClick={() => step('images', -1)} aria-label="Remove image">−</button>
          <span className="stepper-value">{media.images}</span>
          <button type="button" onClick={() => step('images', 1)} aria-label="Add image">+</button>
        </div>
      </div>
      <div className="stepper">
        <span className="stepper-label">Video</span>
        <div className="stepper-row">
          <button type="button" onClick={() => step('videos', -1)} aria-label="Remove video">−</button>
          <span className="stepper-value">{media.videos}</span>
          <button type="button" onClick={() => step('videos', 1)} aria-label="Add video">+</button>
        </div>
      </div>
    </div>
  )
}
