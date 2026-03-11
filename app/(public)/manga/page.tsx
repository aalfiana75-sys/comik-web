import { createClient } from '@/lib/supabase/server'
import MangaCard from '@/components/manga/MangaCard'
import type { Manga } from '@/types/manga'

export default async function MangaListPage() {
  const supabase = createClient()
  
  const { data: mangaList, error } = await supabase
    .from('manga')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-8 text-center text-red-500">Error loading manga: {error.message}</div>
  }

  return (
    <div className="bg-neutral-900 min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Manga List</h1>
            <p className="text-neutral-400">Browse all available manga</p>
          </div>
          <div className="bg-neutral-800 p-2 rounded-lg border border-neutral-700">
            {/* Simple genre/filter placeholder */}
            <span className="text-sm text-neutral-400 px-4">Latest Updates</span>
          </div>
        </header>

        {mangaList && mangaList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {mangaList.map((manga: Manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-800 rounded-xl">
            <p className="text-neutral-400">No manga found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
