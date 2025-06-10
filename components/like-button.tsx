"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { LikesManager } from "@/lib/likes"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
  resourceId: string
  title: string
  url: string
  className?: string
  size?: "sm" | "default" | "lg"
  showCount?: boolean
}

export function LikeButton({ resourceId, title, url, className = "", size = "sm", showCount = true }: LikeButtonProps) {
  const [likes, setLikes] = useState(0)
  const [userLiked, setUserLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Gerar ID se não fornecido
  const finalResourceId = resourceId || LikesManager.generateResourceId(title, url)

  useEffect(() => {
    // Carregar estado inicial
    setLikes(LikesManager.getLikes(finalResourceId))
    setUserLiked(LikesManager.hasUserLiked(finalResourceId))
  }, [finalResourceId])

  const handleLike = async () => {
    setIsLoading(true)

    try {
      const result = LikesManager.toggleLike(finalResourceId)
      setLikes(result.count)
      setUserLiked(result.userLiked)
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-1 transition-all duration-200",
        userLiked
          ? "text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100"
          : "text-gray-500 hover:text-red-600 hover:bg-red-50",
        className,
      )}
      title={userLiked ? "Remover curtida" : "Curtir recurso"}
    >
      <Heart className={cn("h-4 w-4 transition-all duration-200", userLiked ? "fill-current" : "")} />
      {showCount && <span className="text-sm font-medium">{likes > 0 ? likes : ""}</span>}
    </Button>
  )
}
