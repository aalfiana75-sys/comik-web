import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { deleteChapter } from '@/lib/actions/chapter'
import type { Chapter } from '@/types/chapter'

export default async function AdminChapterListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: mangaId } = await params
  const supabase = await createClient()
  
  const { data: manga, error: mangaError } = await supabase
    .from('manga')
    .select('title')
    .eq('id', mangaId)
    .single()

  if (mangaError || !manga) {
    notFound()
  }

  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('*')
    .eq('manga_id', mangaId)
    .order('chapter_number', { ascending: false })

  return (
    <div className="bg-neutral-900 min-h-screen p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin/manga" className="text-neutral-500 hover:text-white transition text-sm mb-2 inline-block">
              &larr; Back to Manga Manager
            </Link>
            <h1 className="text-3xl font-bold">{manga.title} - Chapters</h1>
            <p className="text-neutral-400">Manage all chapters for this manga</p>
          </div>
          <Link 
            href={`/admin/manga/${mangaId}/chapters/new`} 
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Add New Chapter
          </Link>
        </header>

        <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-xl border border-neutral-700">
          <table className="w-full text-left">
            <thead className="bg-neutral-700/50 text-neutral-300 text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Chapter #</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {chapters?.map((chapter: Chapter) => (
                <tr key={chapter.id} className="hover:bg-neutral-700/30 transition">
                  <td className="px-6 py-4 font-bold">Chapter {chapter.chapter_number}</td>
                  <td className="px-6 py-4 text-neutral-300">{chapter.title || 'Untitled'}</td>
                  <td className="px-6 py-4 text-sm text-neutral-400">
                    {new Date(chapter.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link 
                      href={`/admin/manga/${mangaId}/chapters/${chapter.id}/edit`} 
                      className="text-neutral-300 hover:text-white transition underline"
                    >
                      Edit
                    </Link>
                    <Link 
                      href={`/admin/manga/${mangaId}/chapters/${chapter.id}/pages`} 
                      className="text-red-500 hover:text-red-400 transition underline"
                    >
                      Upload Pages
                    </Link>
                    <form action={deleteChapter.bind(null, chapter.id, mangaId)} className="inline">
                      <button className="text-red-500 hover:text-red-400 transition underline">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {(!chapters || chapters.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    No chapters found for this manga.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
