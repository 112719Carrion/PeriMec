"use client"

import type React from "react"

import { useToast } from "@/src/hooks/use-toast"
import {
  Toast,
  ToastProvider as Provider,
  ToastTitle,
  ToastDescription,
  ToastViewport,
  ToastClose,
} from "@/src/components/ui/toast"
import { useEffect, useState } from "react"

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts } = useToast()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{children}</>
  }

  return (
    <Provider>
      {children}
      {toasts.map((toast, index) => (
        <Toast key={index} variant={toast.variant}>
          {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
          {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </Provider>
  )
}
