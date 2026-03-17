import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle, Info, CheckCircle2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/cn'

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-100 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400',
        success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-100 [&>svg]:text-green-600 dark:[&>svg]:text-green-400',
        info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
  )
)
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
  )
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
  )
)
AlertDescription.displayName = 'AlertDescription'

// Convenience components for different alert types
const SuccessAlert = ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => (
  <Alert variant="success" {...props}>
    <CheckCircle2 className="h-4 w-4" />
    {children}
  </Alert>
)

const WarningAlert = (props: any) => (
  <Alert variant="warning" {...props}>
    <AlertTriangle className="h-4 w-4" />
    {props.children}
  </Alert>
)

const ErrorAlert = (props: any) => (
  <Alert variant="destructive" {...props}>
    <AlertCircle className="h-4 w-4" />
    {props.children}
  </Alert>
)

const InfoAlert = (props: any) => (
  <Alert variant="info" {...props}>
    <Info className="h-4 w-4" />
    {props.children}
  </Alert>
)

export {
  Alert,
  AlertTitle,
  AlertDescription,
  alertVariants,
  SuccessAlert,
  WarningAlert,
  ErrorAlert,
  InfoAlert,
}
