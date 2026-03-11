import Link from 'next/link'
import ChapterForm from '@/components/admin/ChapterForm'

export default function NewChapterPage({ params }: { params: { id: string } }) {
  return (
    <div className="bg-neutral-900 min-h-screen p-8 text-white">
      <div className="max-w-xl mx-auto">
        <Link href={`/admin/manga/${params.id}/chapters`} className="text-neutral-400 hover:text-white mb-6 inline-block transition">
          &larr; Back to Chapters
        </Link>
        <h1 className="text-3xl font-bold mb-8">Add New Chapter</h1>
        <ChapterForm mangaId={params.id} />
      </div>
    </div>
  )
}
