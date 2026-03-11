'use client'

import { useState } from 'react'
import { createChapter, updateChapter } from '@/lib/actions/chapter'
import type { Chapter, CreateChapterInput } from '@/types/chapter'

interface Props {
  mangaId: string;
  chapter?: Chapter;
}

export default function ChapterForm({ mangaId, chapter }: Props) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateChapterInput>({
    manga_id: mangaId,
    chapter_number: chapter?.chapter_number || 1,
    title: chapter?.title || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (chapter) {
        await updateChapter(chapter.id, mangaId, formData)
      } else {
        await createChapter(formData)
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-800 p-8 rounded-xl border border-neutral-700 max-w-xl mx-auto shadow-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-neutral-300 mb-1">Chapter Number</label>
          <input
            type="number"
            step="0.1"
            value={formData.chapter_number}
            onChange={(e) => setFormData(prev => ({ ...prev, chapter_number: parseFloat(e.target.value) }))}
            className="w-full bg-neutral-700 rounded-lg p-3 text-white border border-neutral-600 focus:border-red-500 focus:outline-none transition"
            required
            placeholder="e.g. 1 or 1.5"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-neutral-300 mb-1">Title (Optional)</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full bg-neutral-700 rounded-lg p-3 text-white border border-neutral-600 focus:border-red-500 focus:outline-none transition"
            placeholder="e.g. The Beginning"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          chapter ? 'Update Chapter' : 'Create Chapter'
        )}
      </button>
    </form>
  )
}
