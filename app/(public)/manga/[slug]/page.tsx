import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Manga } from '@/types/manga'

export default async function MangaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: manga, error: mangaError } = await supabase
    .from('manga')
    .select('*')
    .eq('slug', slug)
    .single()

  if (mangaError || !manga) {
    notFound()
  }

  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('*')
    .eq('manga_id', manga.id)
    .order('chapter_number', { ascending: false })

  return (
    <div className="bg-neutral-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Cover */}
          <div className="w-full md:w-1/3 max-w-[300px] mx-auto md:mx-0">
            <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-2xl bg-neutral-800">
              {manga.cover_url ? (
                <img 
                  src={manga.cover_url} 
                  alt={manga.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-500">No Cover</div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-extrabold">{manga.title}</h1>
            <div className="flex flex-wrap gap-2">
              {manga.genres?.map((genre: string) => (
                <span key={genre} className="px-3 py-1 bg-neutral-800 rounded-full text-xs text-neutral-300 border border-neutral-700">
                  {genre}
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-neutral-400">
              <div>
                <span className="block font-bold text-white">Status</span>
                <span className="capitalize">{manga.status}</span>
              </div>
              <div>
                <span className="block font-bold text-white">Author</span>
                <span>{manga.author || 'Unknown'}</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <p className="text-neutral-300 leading-relaxed">
                {manga.description || 'No description available.'}
              </p>
            </div>

            <div className="pt-4 flex gap-4">
              <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-lg">
                Read Now
              </button>
              <button className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-lg transition border border-neutral-700 shadow-lg">
                Bookmark
              </button>
            </div>
          </div>
        </div>

        {/* Chapters Section */}
        <section className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700/50">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Chapters
            <span className="text-sm font-normal text-neutral-400">({chapters?.length || 0})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {chapters && chapters.length > 0 ? (
              chapters.map((chapter) => (
                <Link 
                  key={chapter.id} 
                  href={`/read/${chapter.id}`}
                  className="p-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl transition flex items-center justify-between group"
                >
                  <span className="font-medium group-hover:text-red-500 transition-colors">
                    Chapter {chapter.chapter_number} {chapter.title && `- ${chapter.title}`}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {new Date(chapter.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center py-8 text-neutral-500 italic">No chapters uploaded yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
