import Link from 'next/link'
import ChapterForm from '@/components/admin/ChapterForm'

export default async function NewChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="bg-neutral-900 min-h-screen p-8 text-white">
      <div className="max-w-xl mx-auto">
        <Link href={`/admin/manga/${id}/chapters`} className="text-neutral-400 hover:text-white mb-6 inline-block transition">
          &larr; Back to Chapters
        </Link>
        <h1 className="text-3xl font-bold mb-8">Add New Chapter</h1>
        <ChapterForm mangaId={id} />
      </div>
    </div>
  )
}
