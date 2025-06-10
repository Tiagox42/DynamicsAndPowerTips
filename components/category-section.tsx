import type React from "react"
import { ResourceCard } from "./resource-card"
import { Badge } from "@/components/ui/badge"
import { getTranslation } from "@/data/translations"

interface Resource {
  title: string
  titleEn?: string
  url: string
  description: string
  descriptionEn?: string
  submittedBy: string
  submittedAt: string
}

interface CategorySectionProps {
  categoryKey: string
  categoryLabel: string
  icon: React.ComponentType<{ className?: string }>
  subcategories: Record<string, Resource[]>
  language?: "pt" | "en"
}

export function CategorySection({
  categoryKey,
  categoryLabel,
  icon: Icon,
  subcategories,
  language = "pt",
}: CategorySectionProps) {
  const totalResources = Object.values(subcategories).reduce((total, resources) => total + resources.length, 0)

  if (totalResources === 0) {
    return null
  }

  // Usar tradução se disponível
  const displayLabel = getTranslation(categoryKey, "categories", language)

  const resourceText =
    language === "en"
      ? totalResources === 1
        ? "resource"
        : "resources"
      : totalResources === 1
        ? "recurso"
        : "recursos"

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{displayLabel}</h2>
          <Badge variant="outline" className="mt-1">
            {totalResources} {resourceText}
          </Badge>
        </div>
      </div>

      {Object.entries(subcategories).map(([subcategory, resources]) => {
        const translatedSubcategory = getTranslation(subcategory, "subcategories", language)

        return (
          <div key={subcategory} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-l-4 border-blue-200 pl-4">
              {translatedSubcategory}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <ResourceCard
                  key={`${subcategory}-${index}`}
                  title={resource.title}
                  titleEn={resource.titleEn}
                  url={resource.url}
                  description={resource.description}
                  descriptionEn={resource.descriptionEn}
                  submittedBy={resource.submittedBy}
                  submittedAt={resource.submittedAt}
                  subcategory={translatedSubcategory}
                  language={language}
                />
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}
