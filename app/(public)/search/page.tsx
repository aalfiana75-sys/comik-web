import { createClient } from '@/lib/supabase/server'
import MangaCard from '@/components/manga/MangaCard'
import SearchBar from '@/components/shared/SearchBar'
import type { Manga } from '@/types/manga'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; genre?: string; sort?: string }
}) {
  const supabase = createClient()
  const { q, genre, sort } = searchParams

  // Build Query
  let query = supabase
    .from('manga')
    .select('*')

  // Search by Title (ilike)
  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  // Filter by Genre (TEXT[] contains)
  if (genre) {
    query = query.contains('genres', [genre])
  }

  // Sorting Logic
  if (sort === 'az') {
    query = query.order('title', { ascending: true })
  } else if (sort === 'new') {
    query = query.order('created_at', { ascending: false })
  } else {
    // Default: Sort by last updated (which should update on chapter creation)
    query = query.order('updated_at', { ascending: false })
  }

  const { data: mangaResults, error } = await query

  return (
    <div className="bg-neutral-900 min-h-screen p-6 md:p-12 text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Search Manga</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Find your next favorite series. Search by title, filter by genres, and sort by latest updates.
          </p>
          <div className="pt-6">
            <SearchBar />
          </div>
        </header>

        <section>
          {error && (
            <div className="p-8 bg-red-500/10 border border-red-500 rounded-xl text-center text-red-500">
              Error performing search: {error.message}
            </div>
          )}

          {!error && mangaResults && mangaResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {mangaResults.map((manga: Manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-neutral-800 rounded-2xl border border-dashed border-neutral-700">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-1">No manga found</h3>
              <p className="text-neutral-500">
                Try adjusting your search terms or filters.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
