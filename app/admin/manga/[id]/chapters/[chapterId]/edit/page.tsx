import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ChapterForm from '@/components/admin/ChapterForm'

export default async function EditChapterPage({ params }: { params: Promise<{ id: string, chapterId: string }> }) {
  const { id: mangaId, chapterId } = await params
  const supabase = await createClient()
  
  const { data: chapter, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', chapterId)
    .single()

  if (error || !chapter) {
    notFound()
  }

  return (
    <div className="bg-neutral-900 min-h-screen p-8 text-white">
      <div className="max-w-xl mx-auto">
        <Link href={`/admin/manga/${mangaId}/chapters`} className="text-neutral-400 hover:text-white mb-6 inline-block transition">
          &larr; Back to Chapters
        </Link>
        <h1 className="text-3xl font-bold mb-8">Edit Chapter {chapter.chapter_number}</h1>
        <ChapterForm mangaId={mangaId} chapter={chapter} />
      </div>
    </div>
  )
}
