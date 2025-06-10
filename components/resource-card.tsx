import { ExternalLink, Calendar, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LikeButton } from "./like-button"
import { LikesManager } from "@/lib/likes"

interface ResourceCardProps {
  title: string
  titleEn?: string
  url: string
  description: string
  descriptionEn?: string
  submittedBy: string
  submittedAt: string
  subcategory: string
  language?: "pt" | "en"
}

export function ResourceCard({
  title,
  titleEn,
  url,
  description,
  descriptionEn,
  submittedBy,
  submittedAt,
  subcategory,
  language = "pt",
}: ResourceCardProps) {
  const displayTitle = language === "en" && titleEn ? titleEn : title
  const displayDescription = language === "en" && descriptionEn ? descriptionEn : description

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Gerar ID único para o recurso
  const resourceId = LikesManager.generateResourceId(title, url)

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Badge variant="secondary" className="mb-2 text-xs">
              {subcategory}
            </Badge>
            <CardTitle className="text-lg leading-tight line-clamp-2">{displayTitle}</CardTitle>
          </div>
          <LikeButton resourceId={resourceId} title={title} url={url} className="shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-3">{displayDescription}</CardDescription>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{submittedBy}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(submittedAt)}</span>
          </div>
        </div>

        <Button asChild className="w-full" size="sm">
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Acessar Recurso
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
