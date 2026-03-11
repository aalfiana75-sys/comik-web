import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ChapterForm from '@/components/admin/ChapterForm'

export default async function EditChapterPage({ params }: { params: { id: string, chapterId: string } }) {
  const supabase = createClient()
  
  const { data: chapter, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', params.chapterId)
    .single()

  if (error || !chapter) {
    notFound()
  }

  return (
    <div className="bg-neutral-900 min-h-screen p-8 text-white">
      <div className="max-w-xl mx-auto">
        <Link href={`/admin/manga/${params.id}/chapters`} className="text-neutral-400 hover:text-white mb-6 inline-block transition">
          &larr; Back to Chapters
        </Link>
        <h1 className="text-3xl font-bold mb-8">Edit Chapter {chapter.chapter_number}</h1>
        <ChapterForm mangaId={params.id} chapter={chapter} />
      </div>
    </div>
  )
}
