import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Page } from '@/types/page'
import type { Chapter } from '@/types/chapter'

export default async function ReaderPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params
  const supabase = await createClient()

  // 1. Fetch current chapter and its pages
  const { data: chapter, error: chapterError } = await supabase
    .from('chapters')
    .select('*, manga:manga_id(title, slug)')
    .eq('id', chapterId)
    .single()

  if (chapterError || !chapter) {
    notFound()
  }

  const { data: pages, error: pagesError } = await supabase
    .from('pages')
    .select('*')
    .eq('chapter_id', chapterId)
    .order('page_number', { ascending: true })

  // 2. Fetch all chapters for this manga to find Next/Prev
  const { data: allChapters } = await supabase
    .from('chapters')
    .select('id, chapter_number')
    .eq('manga_id', chapter.manga_id)
    .order('chapter_number', { ascending: true })

  const currentIndex = allChapters?.findIndex((c: any) => c.id === chapterId) ?? -1
  const prevChapter = currentIndex > 0 ? allChapters?.[currentIndex - 1] : null
  const nextChapter = currentIndex < (allChapters?.length ?? 0) - 1 ? allChapters?.[currentIndex + 1] : null

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      {/* Reader Header */}
      <header className="sticky top-0 z-50 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/manga/${chapter.manga.slug}`} className="text-neutral-400 hover:text-white transition">
              &larr; <span className="hidden sm:inline">Back</span>
            </Link>
            <div>
              <h1 className="text-sm sm:text-base font-bold truncate max-w-[150px] sm:max-w-[300px]">
                {chapter.manga.title}
              </h1>
              <p className="text-xs text-neutral-400">Chapter {chapter.chapter_number}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {prevChapter && (
              <Link 
                href={`/read/${prevChapter.id}`}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-xs font-bold transition"
              >
                Prev
              </Link>
            )}
            <div className="px-3 py-1.5 bg-neutral-800 rounded text-xs font-bold text-neutral-400">
              {pages?.length || 0} Pages
            </div>
            {nextChapter && (
              <Link 
                href={`/read/${nextChapter.id}`}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-xs font-bold transition"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Reader Content - Vertical Scroll */}
      <main className="flex-1 w-full max-w-3xl mx-auto py-4">
        {pages && pages.length > 0 ? (
          <div className="flex flex-col items-center">
            {pages.map((page: Page) => (
              <div key={page.id} className="w-full relative min-h-[400px] bg-neutral-900">
                <img
                  src={page.image_url}
                  alt={`Page ${page.page_number}`}
                  className="w-full h-auto block"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
            <p className="text-neutral-500 italic">No pages found for this chapter.</p>
          </div>
        )}
      </main>

      {/* Reader Footer Navigation */}
      <footer className="bg-neutral-900 border-t border-neutral-800 p-8 mt-12">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-1">Finished Chapter {chapter.chapter_number}</h2>
            <p className="text-neutral-400 text-sm">What would you like to do next?</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {nextChapter ? (
              <Link 
                href={`/read/${nextChapter.id}`}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-center shadow-lg transition"
              >
                Read Next: Chapter {nextChapter.chapter_number}
              </Link>
            ) : (
              <div className="py-4 bg-neutral-800 text-neutral-500 font-bold rounded-xl text-center border border-neutral-700">
                End of Manga
              </div>
            )}
            <Link 
              href={`/manga/${chapter.manga.slug}`}
              className="w-full py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-center transition border border-neutral-700"
            >
              Back to Manga Detail
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
