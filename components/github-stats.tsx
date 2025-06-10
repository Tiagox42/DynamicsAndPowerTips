"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, GitFork, Eye, Users, ExternalLink } from "lucide-react"

interface GitHubStats {
  stargazers_count: number
  forks_count: number
  watchers_count: number
  subscribers_count: number
  open_issues_count: number
  html_url: string
  name: string
  description: string
}

interface GitHubStatsProps {
  owner: string
  repo: string
}

export function GitHubStats({ owner, repo }: GitHubStatsProps) {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [owner, repo])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch repository stats: ${response.status}`)
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats")
      console.error("Error fetching GitHub stats:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Repository Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-500">Unable to load repository stats</p>
        </CardContent>
      </Card>
    )
  }

  if (!stats) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-600" />
          Repository Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-gray-600">Stars</span>
            <Badge variant="secondary">{stats.stargazers_count.toLocaleString()}</Badge>
          </div>

          <div className="flex items-center gap-2">
            <GitFork className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-600">Forks</span>
            <Badge variant="secondary">{stats.forks_count.toLocaleString()}</Badge>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-600">Watchers</span>
            <Badge variant="secondary">{stats.watchers_count.toLocaleString()}</Badge>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-gray-600">Issues</span>
            <Badge variant="secondary">{stats.open_issues_count.toLocaleString()}</Badge>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button asChild className="w-full bg-yellow-600 hover:bg-yellow-700">
            <a href={stats.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>Give it a Star on GitHub</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
