import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-body font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whisper-500 disabled:opacity-50 disabled:cursor-not-allowed select-none'
    const variants = {
      primary: 'bg-whisper-500 hover:bg-whisper-600 active:bg-whisper-700 text-white shadow-lg shadow-whisper-500/20',
      secondary: 'bg-ink-100 dark:bg-void-800 hover:bg-ink-200 dark:hover:bg-void-700 text-ink-800 dark:text-void-100',
      ghost: 'hover:bg-ink-100 dark:hover:bg-void-800 text-ink-700 dark:text-void-300',
      danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20',
      outline: 'border border-ink-200 dark:border-void-700 hover:bg-ink-50 dark:hover:bg-void-800 text-ink-700 dark:text-void-200',
    }
    const sizes = { sm: 'text-sm px-3 py-1.5', md: 'text-sm px-4 py-2.5', lg: 'text-base px-6 py-3' }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export default Button
