import Link from 'next/link'
import Image from 'next/image'
import type { Manga } from '@/types/manga'

interface Props {
  manga: Manga;
}

export default function MangaCard({ manga }: Props) {
  return (
    <Link href={`/manga/${manga.slug}`} className="group">
      <div className="bg-neutral-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
        <div className="relative aspect-[3/4] overflow-hidden">
          {manga.cover_url ? (
            <img
              src={manga.cover_url}
              alt={manga.title}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-neutral-500">
              No Cover
            </div>
          )}
          <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-xs font-bold rounded">
            {manga.status.toUpperCase()}
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-bold text-sm line-clamp-2 text-white group-hover:text-red-500 transition-colors">
            {manga.title}
          </h3>
          {manga.genres && manga.genres.length > 0 && (
            <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
              {manga.genres.join(', ')}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
