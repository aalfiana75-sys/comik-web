import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ChapterPageUpload from '@/components/admin/ChapterPageUpload'
import { deletePage } from '@/lib/actions/page'
import type { Page } from '@/types/page'

export default async function AdminChapterPagesPage({ params }: { params: Promise<{ id: string, chapterId: string }> }) {
  const { id, chapterId } = await params
  const supabase = await createClient()
  
  const { data: chapter, error: chapterError } = await supabase
    .from('chapters')
    .select('*, manga:manga_id(title)')
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

  return (
    <div className="bg-neutral-900 min-h-screen p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <Link href={`/admin/manga/${id}/chapters`} className="text-neutral-500 hover:text-white transition text-sm mb-4 inline-block">
            &larr; Back to Chapters
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">
              {chapter.manga.title} - Chapter {chapter.chapter_number} Pages
            </h1>
            <span className="text-sm bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700 text-neutral-400">
              {pages?.length || 0} Pages
            </span>
          </div>
        </header>

        <section className="mb-12">
          <ChapterPageUpload chapterId={chapterId} />
        </section>

        <section>
          <h2 className="text-xl font-bold mb-6">Uploaded Pages</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {pages?.map((page: Page) => (
              <div key={page.id} className="relative group bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
                <div className="aspect-[3/4] relative">
                  <img 
                    src={page.image_url} 
                    alt={`Page ${page.page_number}`} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-xs font-bold text-white">
                    {page.page_number}
                  </div>
                </div>
                <div className="p-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent">
                  <form action={deletePage.bind(null, page.id, chapterId)}>
                    <button className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition font-bold">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
            {(!pages || pages.length === 0) && (
              <div className="col-span-full py-20 text-center text-neutral-500 bg-neutral-800/50 rounded-xl border border-dashed border-neutral-700">
                No pages uploaded yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
