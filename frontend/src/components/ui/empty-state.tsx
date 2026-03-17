import * as React from 'react'
import { InboxIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      icon = <InboxIcon className="h-12 w-12" />,
      title = 'No items found',
      description = 'There are no items to display at this time.',
      action,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border p-12 text-center',
        className
      )}
      {...props}
    >
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
)
EmptyState.displayName = 'EmptyState'

export { EmptyState }
export type { EmptyStateProps }
