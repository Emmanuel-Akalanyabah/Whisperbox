import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-ink-700 dark:text-void-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl bg-white dark:bg-void-900 border text-ink-900 dark:text-void-50 placeholder:text-ink-400 dark:placeholder:text-void-500 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-whisper-500 focus:border-transparent',
            error
              ? 'border-red-400 dark:border-red-500'
              : 'border-ink-200 dark:border-void-700 hover:border-ink-300 dark:hover:border-void-600',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-ink-400 dark:text-void-500">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export default Input
