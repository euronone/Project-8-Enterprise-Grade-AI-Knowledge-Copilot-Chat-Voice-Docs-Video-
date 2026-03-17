import * as React from 'react'
import { cn } from '@/lib/cn'

interface FormFieldProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  children?: React.ReactNode
}

const FormField = React.forwardRef<HTMLFieldSetElement, FormFieldProps>(
  ({ className, ...props }, ref) => (
    <fieldset ref={ref} className={cn('space-y-3', className)} {...props} />
  )
)
FormField.displayName = 'FormField'

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  error?: boolean
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, error, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        error && 'text-destructive',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-destructive">*</span>}
    </label>
  )
)
FormLabel.displayName = 'FormLabel'

interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

const FormError = React.forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm font-medium text-destructive', className)}
      role="alert"
      {...props}
    >
      {children}
    </p>
  )
)
FormError.displayName = 'FormError'

interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  )
)
FormDescription.displayName = 'FormDescription'

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-2', className)} {...props}>
      {children}
    </div>
  )
)
FormControl.displayName = 'FormControl'

interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {children}
    </div>
  )
)
FormGroup.displayName = 'FormGroup'

export {
  FormField,
  FormLabel,
  FormError,
  FormDescription,
  FormControl,
  FormGroup,
}
