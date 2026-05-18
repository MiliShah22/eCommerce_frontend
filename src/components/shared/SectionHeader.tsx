import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  viewAllHref?: string
  count?: number
}

export default function SectionHeader({ title, viewAllHref, count }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h2 className="font-syne font-bold text-text text-lg">{title}</h2>
        {count !== undefined && <span className="text-xs text-text-3">{count} items</span>}
      </div>
      {viewAllHref && (
        <Link href={viewAllHref} className="flex items-center gap-1 text-xs text-text-3 hover:text-text-2 transition-colors">
          View all <ArrowRight size={12} />
        </Link>
      )}
    </div>
  )
}
