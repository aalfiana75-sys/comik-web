'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { addPagesToChapter } from '@/lib/actions/page'
import { useRouter } from 'next/navigation'

interface Props {
  chapterId: string;
}

export default function ChapterPageUpload({ chapterId }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(Array.from(e.target.files))
    }
  }

  const uploadFiles = async (files: File[]) => {
    // Sort files by name to maintain page order
    const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
    
    setUploading(true)
    setProgress(0)
    const totalFiles = sortedFiles.length
    const pageData = []

    try {
      for (let i = 0; i < totalFiles; i++) {
        const file = sortedFiles[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${chapterId}/${Date.now()}-${i}.${fileExt}`
        
        // Upload to Supabase Storage (Bucket: chapter-pages)
        const { data, error: uploadError } = await supabase.storage
          .from('chapter-pages')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('chapter-pages')
          .getPublicUrl(fileName)

        pageData.push({
          chapter_id: chapterId,
          page_number: i + 1,
          image_url: publicUrl
        })

        setProgress(Math.round(((i + 1) / totalFiles) * 100))
      }

      // Save page records to database
      await addPagesToChapter(chapterId, pageData)
      router.refresh()
      alert('Pages uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload pages')
    } finally {
      setUploading(false)
      setProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
          ${isDragging 
            ? 'border-red-500 bg-red-500/10 scale-[1.02]' 
            : 'border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 hover:border-neutral-500'
          }
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileInput}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center text-3xl">
            {uploading ? '⌛' : '📤'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {uploading ? `Uploading... ${progress}%` : 'Upload Chapter Pages'}
            </h3>
            <p className="text-neutral-400">
              Drag & drop images here, or click to browse
            </p>
            <p className="text-xs text-neutral-500 mt-2 italic">
              * Files will be sorted by name for page ordering
            </p>
          </div>
        </div>

        {uploading && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-neutral-700 overflow-hidden rounded-b-2xl">
            <div 
              className="h-full bg-red-600 transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
