"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink, Trophy, Star, Medal } from "lucide-react"
import { LikesManager } from "@/lib/likes"

interface TopResource {
  resourceId: string
  count: number
  title: string
  url: string
  description: string
  category: string
  subcategory: string
}

export function TopLikedSection() {
  const [topResources, setTopResources] = useState<TopResource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTopResources()
  }, [])

  const loadTopResources = async () => {
    try {
      // Obter top recursos curtidos
      const topLiked = LikesManager.getTopLikedResources()

      if (topLiked.length === 0) {
        setTopResources([])
        setIsLoading(false)
        return
      }

      // Buscar dados dos recursos
      const response = await fetch("/api/resources")
      const allResources = await response.json()

      const topResourcesData: TopResource[] = []

      // Mapear IDs para recursos reais
      topLiked.forEach(({ resourceId, count }) => {
        // Procurar o recurso em todas as categorias
        Object.entries(allResources).forEach(([categoryKey, subcategories]: [string, any]) => {
          Object.entries(subcategories).forEach(([subcategoryKey, resources]: [string, any]) => {
            resources.forEach((resource: any) => {
              const generatedId = LikesManager.generateResourceId(resource.title, resource.url)
              if (generatedId === resourceId) {
                topResourcesData.push({
                  resourceId,
                  count,
                  title: resource.title,
                  url: resource.url,
                  description: resource.description,
                  category: categoryKey,
                  subcategory: subcategoryKey,
                })
              }
            })
          })
        })
      })

      setTopResources(topResourcesData.slice(0, 3))
    } catch (error) {
      console.error("Error loading top resources:", error)
      setTopResources([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-16 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (topResources.length === 0) {
    return (
      <section className="mb-12">
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-8 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum recurso curtido ainda</h3>
            <p className="text-gray-600 mb-4">Seja o primeiro a curtir os recursos que mais gosta! ❤️</p>
            <p className="text-sm text-gray-500">
              Curta os recursos úteis para ajudar outros desenvolvedores a descobri-los.
            </p>
          </CardContent>
        </Card>
      </section>
    )
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-600" />
      case 1:
        return <Medal className="h-5 w-5 text-gray-500" />
      case 2:
        return <Star className="h-5 w-5 text-orange-600" />
      default:
        return null
    }
  }

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case 1:
        return "bg-gray-100 text-gray-800 border-gray-200"
      case 2:
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  return (
    <section className="mb-12">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topResources.map((resource, index) => (
          <Card
            key={resource.resourceId}
            className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
              index === 0
                ? "ring-2 ring-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50"
                : index === 1
                  ? "ring-2 ring-gray-200 bg-gradient-to-br from-gray-50 to-slate-50"
                  : "ring-2 ring-orange-200 bg-gradient-to-br from-orange-50 to-red-50"
            }`}
          >
            {/* Rank Badge */}
            <div className="absolute top-4 right-4">
              <Badge className={`flex items-center gap-1 ${getRankBadge(index)}`}>
                {getRankIcon(index)}
                <span className="font-bold">#{index + 1}</span>
              </Badge>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start gap-2 pr-16">
                <div className="flex-1">
                  <Badge variant="outline" className="mb-2 text-xs">
                    {resource.subcategory}
                  </Badge>
                  <CardTitle className="text-lg leading-tight line-clamp-2">{resource.title}</CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{resource.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                  <span className="text-sm font-semibold text-red-600">
                    {resource.count} {resource.count === 1 ? "curtida" : "curtidas"}
                  </span>
                </div>
              </div>

              <Button asChild className="w-full" size="sm">
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Acessar Recurso
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
