// Counts hashtags in a string, e.g. "#launch #new" -> 2
export function countHashtags(text) {
  const matches = text.match(/#[\w]+/g)
  return matches ? matches.length : 0
}

// Runs every constraint check for one platform and returns a structured
// result the UI can render directly: status level + a list of messages.
// status is one of: 'ready' | 'warn' | 'error'
export function validatePost(platform, text, media) {
  const length = text.length
  const hashtags = countHashtags(text)
  const { images, videos } = media
  const messages = []
  let status = 'ready'

  const flagError = (msg) => {
    messages.push({ type: 'error', text: msg })
    status = 'error'
  }
  const flagWarning = (msg) => {
    messages.push({ type: 'warning', text: msg })
    if (status === 'ready') status = 'warn'
  }

  // Character limit
  if (length > platform.limit) {
    flagError(`${length - platform.limit} characters over the ${platform.limit}-character limit`)
  }

  // Soft / recommended limit (does not block, just informs)
  if (platform.softLimit && length > platform.softLimit && length <= platform.limit) {
    flagWarning(`Longer than the recommended ${platform.softLimit} characters for best reach`)
  }

  // Media presence
  if (platform.mediaRequired && images + videos === 0) {
    flagError('This platform requires at least one image or video')
  }

  // Video-only platforms (e.g. TikTok)
  if (platform.videoOnly && images > 0) {
    flagError('This platform only accepts video, remove the image(s)')
  }

  // Media count limits
  if (platform.maxImages !== undefined && images > platform.maxImages) {
    flagError(`Max ${platform.maxImages} image(s) allowed, currently ${images}`)
  }
  if (platform.maxVideos !== undefined && videos > platform.maxVideos) {
    flagError(`Max ${platform.maxVideos} video allowed, currently ${videos}`)
  }

  // Mixed media not allowed (e.g. X: images OR one video, not both)
  if (platform.noMixedMedia && images > 0 && videos > 0) {
    flagError('Cannot combine images and video on this platform')
  }

  // Hashtag cap
  if (platform.hashtagCap && hashtags > platform.hashtagCap) {
    flagError(`${hashtags} hashtags used, limit is ${platform.hashtagCap}`)
  }

  if (status === 'ready') {
    messages.unshift({ type: 'ok', text: 'Meets all requirements, ready to publish' })
  }

  return { length, hashtags, status, messages, limit: platform.limit }
}
