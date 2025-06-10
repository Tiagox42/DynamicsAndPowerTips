"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Star, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface StarButtonProps {
  owner: string
  repo: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  showCount?: boolean
  className?: string
}

export function StarButton({
  owner,
  repo,
  variant = "outline",
  size = "sm",
  showCount = true,
  className = "",
}: StarButtonProps) {
  const [starCount, setStarCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (showCount) {
      fetchStarCount()
    }
  }, [owner, repo, showCount])

  const fetchStarCount = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
      if (response.ok) {
        const data = await response.json()
        setStarCount(data.stargazers_count)
      }
    } catch (error) {
      console.error("Error fetching star count:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const repoUrl = `https://github.com/${owner}/${repo}`

  return (
    <div className="flex items-center gap-2">
      <Button
        asChild
        variant={variant}
        size={size}
        className={`bg-yellow-50 border-yellow-200 hover:bg-yellow-100 ${className}`}
      >
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-yellow-700 hover:text-yellow-800"
          title="Dar uma estrela no GitHub"
        >
          <Star className="h-4 w-4" />
          <span>Star</span>
          <ExternalLink className="h-3 w-3 opacity-60" />
        </a>
      </Button>

      {showCount && starCount !== null && (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          {starCount.toLocaleString()}
        </Badge>
      )}

      {showCount && isLoading && (
        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
          <span className="animate-pulse">...</span>
        </Badge>
      )}
    </div>
  )
}
