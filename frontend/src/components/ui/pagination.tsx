import * as React from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/button'

interface PaginationProps extends React.ComponentProps<'nav'> {
  isFirstPage: boolean
  isLastPage: boolean
  onFirst?: () => void
  onPrev?: () => void
  onNext?: () => void
  onLast?: () => void
}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, isFirstPage, isLastPage, onFirst, onPrev, onNext, onLast, ...props }, ref) => (
    <nav
      ref={ref}
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    >
      <ul className="flex flex-row items-center gap-1">
        <li>
          <Button
            onClick={onFirst}
            disabled={isFirstPage}
            variant="ghost"
            size="icon"
            aria-label="Go to first page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        </li>
        <li>
          <Button
            onClick={onPrev}
            disabled={isFirstPage}
            variant="ghost"
            size="icon"
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </li>
        <li>
          <Button
            onClick={onNext}
            disabled={isLastPage}
            variant="ghost"
            size="icon"
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
        <li>
          <Button
            onClick={onLast}
            disabled={isLastPage}
            variant="ghost"
            size="icon"
            aria-label="Go to last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  )
)
Pagination.displayName = 'Pagination'

export { Pagination }
export type { PaginationProps }
