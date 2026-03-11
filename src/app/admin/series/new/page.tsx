import MovieForm from '@/components/MovieForm'

export default function NewSeriesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Add New Series</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details below to add a new series</p>
      </div>
      <MovieForm contentType="series" />
    </div>
  )
}
