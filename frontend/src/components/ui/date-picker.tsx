import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  placeholder?: string
  disabled?: boolean
  disabledDates?: Date[]
  fromDate?: Date
  toDate?: Date
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ value, onChange, placeholder = 'Pick a date', disabled = false, ...props }, ref) => {
    const [date, setDate] = React.useState<Date | undefined>(value)

    React.useEffect(() => {
      setDate(value)
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = new Date(e.target.value)
      setDate(newDate)
      onChange?.(newDate)
    }

    return (
      <div className="relative flex items-center">
        <input
          ref={ref}
          type="date"
          value={date ? format(date, 'yyyy-MM-dd') : ''}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            'pr-10'
          )}
          {...props}
        />
        <CalendarIcon className="absolute right-3 h-4 w-4 opacity-50 pointer-events-none" />
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'

export { DatePicker }
export type { DatePickerProps }
