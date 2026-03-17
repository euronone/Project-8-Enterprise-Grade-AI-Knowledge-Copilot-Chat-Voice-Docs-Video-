import * as React from 'react'

export interface ToastMessage {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface UseToastReturn {
  toasts: ToastMessage[]
  toast: (message: Omit<ToastMessage, 'id'>) => void
  dismiss: (id: string) => void
  dismissAll: () => void
}

const ToastContext = React.createContext<UseToastReturn | null>(null)

interface ToastProviderProps {
  children: React.ReactNode
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback((message: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastMessage = {
      ...message,
      id,
      duration: message.duration ?? 3000,
    }

    setToasts((prev) => [...prev, newToast])

    if (newToast.duration) {
      setTimeout(() => {
        dismiss(id)
      }, newToast.duration)
    }
  }, [dismiss])

  const dismissAll = React.useCallback(() => {
    setToasts([])
  }, [])

  const value: UseToastReturn = {
    toasts,
    toast,
    dismiss,
    dismissAll,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

const useToast = (): UseToastReturn => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export { ToastProvider, useToast }
export type { UseToastReturn }
