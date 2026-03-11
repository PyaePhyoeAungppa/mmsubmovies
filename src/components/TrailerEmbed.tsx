interface TrailerEmbedProps {
  url: string
}

function getYouTubeId(url: string): string | null {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export default function TrailerEmbed({ url }: TrailerEmbedProps) {
  const videoId = getYouTubeId(url)

  if (!videoId) {
    return (
      <div className="w-full aspect-video rounded-xl flex items-center justify-center"
        style={{ background: 'var(--dark-700)' }}>
        <p className="text-gray-500 text-sm">No trailer available</p>
      </div>
    )
  }

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/5">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title="Trailer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        style={{ border: 'none' }}
      />
    </div>
  )
}
