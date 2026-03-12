import MovieForm from '@/components/MovieForm'

export default function NewMoviePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Add New Movie</h1>
        <p className="text-zinc-500 text-sm mt-1">Fill in the details below to add a new movie to the platform.</p>
      </div>
      <MovieForm contentType="movie" />
    </div>
  )
}
