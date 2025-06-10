"use client"
import { useState, useEffect } from "react"
import { Search, Filter, Plus, Rss } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CategorySection } from "./category-section"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { TopLikedSection } from "./top-liked-section"
import { LanguageToggle } from "./language-toggle"
import { useCategoriesStore } from "@/lib/categories-store"

interface Resource {
  title: string
  url: string
  description: string
  submittedBy: string
  submittedAt: string
}

// Adicionar interface para recursos com tradução
interface TranslatedResource extends Resource {
  titleEn?: string
  descriptionEn?: string
}

export function ResourcesPage() {
  const { getCategoriesForSelect } = useCategoriesStore()
  const [categories, setCategories] = useState<ReturnType<typeof getCategoriesForSelect>>([])
  const [resources, setResources] = useState<Record<string, Record<string, Resource[]>>>({})
  const [filteredResources, setFilteredResources] = useState<Record<string, Record<string, Resource[]>>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [totalResources, setTotalResources] = useState(0)
  const [language, setLanguage] = useState<"pt" | "en">("pt")

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "pt" ? "en" : "pt"))
  }

  useEffect(() => {
    // Carregar categorias do store
    setCategories(getCategoriesForSelect())
    fetchResources()
  }, [getCategoriesForSelect])

  useEffect(() => {
    filterResources()
  }, [resources, searchTerm, selectedCategory, language])

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/resources")
      const data = await response.json()
      setResources(data)

      // Calcular total de recursos
      const total = Object.values(data).reduce((acc: number, category: any) => {
        return (
          acc +
          Object.values(category).reduce((catAcc: number, subcategory: any) => {
            return catAcc + (Array.isArray(subcategory) ? subcategory.length : 0)
          }, 0)
        )
      }, 0)
      setTotalResources(total)
    } catch (error) {
      console.error("Error fetching resources:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterResources = () => {
    let filtered = { ...resources }

    // Filtrar por categoria
    if (selectedCategory !== "all") {
      filtered = {
        [selectedCategory]: filtered[selectedCategory] || {},
      }
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const newFiltered: Record<string, Record<string, Resource[]>> = {}

      Object.entries(filtered).forEach(([categoryKey, subcategories]) => {
        const filteredSubcategories: Record<string, Resource[]> = {}

        Object.entries(subcategories).forEach(([subcategoryKey, resourceList]) => {
          const filteredResources = resourceList.filter(
            (resource) =>
              resource.title.toLowerCase().includes(searchLower) ||
              resource.description.toLowerCase().includes(searchLower) ||
              subcategoryKey.toLowerCase().includes(searchLower),
          )

          if (filteredResources.length > 0) {
            filteredSubcategories[subcategoryKey] = filteredResources
          }
        })

        if (Object.keys(filteredSubcategories).length > 0) {
          newFiltered[categoryKey] = filteredSubcategories
        }
      })

      filtered = newFiltered
    }

    setFilteredResources(filtered)
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-96 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>

        {/* Filters Skeleton */}
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Recursos da Comunidade Dynamics CRM</h1>
        <p className="text-lg text-gray-600 mb-2">
          Descubra ferramentas, tutoriais e documentações compartilhadas pela comunidade
        </p>
        <p className="text-sm text-gray-500">
          {totalResources} {totalResources === 1 ? "recurso disponível" : "recursos disponíveis"}
        </p>
      </div>

      {/* Top Liked Resources */}
      <TopLikedSection />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar recursos, títulos, descrições..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.key} value={category.key}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <LanguageToggle language={language} onToggle={toggleLanguage} />

        <Button asChild variant="outline" size="sm">
          <Link href="/rss" className="flex items-center gap-2">
            <Rss className="h-4 w-4" />
            RSS Feed
          </Link>
        </Button>

        <Button asChild>
          <Link href="/submit" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Recurso
          </Link>
        </Button>
      </div>

      {/* Resources */}
      {Object.keys(filteredResources).length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum recurso encontrado</h3>
          <p className="text-gray-500 mb-4">Tente ajustar os filtros ou termos de busca</p>
          <Button asChild variant="outline">
            <Link href="/submit">
              <Plus className="h-4 w-4 mr-2" />
              Seja o primeiro a contribuir
            </Link>
          </Button>
        </div>
      ) : (
        Object.entries(filteredResources).map(([categoryKey, subcategories]) => {
          const category = categories.find((cat) => cat.key === categoryKey)
          if (!category) return null

          return (
            <CategorySection
              key={categoryKey}
              categoryKey={categoryKey}
              categoryLabel={category.label}
              icon={category.icon}
              subcategories={subcategories}
              language={language}
            />
          )
        })
      )}
    </div>
  )
}
