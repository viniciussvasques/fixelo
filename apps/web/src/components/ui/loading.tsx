import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingProps {
  className?: string
  size?: "sm" | "md" | "lg"
  text?: string
}

const Loading = ({ className, size = "md", text }: LoadingProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className={cn("animate-spin", sizeClasses[size])} />
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    </div>
  )
}

// Componente de loading para páginas inteiras
const PageLoading = ({ text = "Carregando..." }: { text?: string }) => (
  <div className="flex min-h-screen items-center justify-center">
    <Loading size="lg" text={text} />
  </div>
)

// Componente de loading para botões
const ButtonLoading = ({ className }: { className?: string }) => (
  <Loader2 className={cn("h-4 w-4 animate-spin", className)} />
)

// Componente de loading para cards
const CardLoading = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center p-8", className)}>
    <Loading size="md" />
  </div>
)

// Skeleton Loading Component
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      {...props}
    />
  )
}

// Skeleton específicos para diferentes tipos de conteúdo
const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn(
          "h-4",
          i === lines - 1 ? "w-3/4" : "w-full"
        )}
      />
    ))}
  </div>
)

const SkeletonCard = () => (
  <div className="space-y-4">
    <Skeleton className="h-48 w-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
)

const SkeletonAvatar = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  }
  
  return <Skeleton className={cn("rounded-full", sizeClasses[size])} />
}

export {
  Loading,
  PageLoading,
  ButtonLoading,
  CardLoading,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar
} 