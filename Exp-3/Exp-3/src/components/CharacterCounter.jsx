import { countHashtags } from '../utils/validation'

// Small reusable readout showing character and hashtag counts for a
// given piece of text. Used under the shared draft textarea.
export default function CharacterCounter({ text }) {
  return (
    <div className="char-counter">
      <span>{text.length.toLocaleString()} characters</span>
      <span>{countHashtags(text)} hashtags</span>
    </div>
  )
}
