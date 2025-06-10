import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Rss, Calendar, User, ExternalLink } from "lucide-react"
import Link from "next/link"

// Mock data para os últimos recursos adicionados
const recentResources = [
  {
    title: "Advanced Plugin Development in Dynamics 365",
    url: "https://example.com/advanced-plugin-dev",
    description: "Guia completo para desenvolvimento avançado de plugins no Dynamics 365 com exemplos práticos.",
    category: "Desenvolvimento",
    subcategory: "Modelos de Plugins e Código em C#",
    submittedBy: "João Silva",
    submittedAt: "2024-01-20",
  },
  {
    title: "Power BI Integration Best Practices",
    url: "https://example.com/powerbi-integration",
    description: "Melhores práticas para integrar Power BI com Dynamics 365 CRM.",
    category: "Consultas e Relatórios",
    subcategory: "Power BI e Dashboards no Dynamics",
    submittedBy: "Maria Santos",
    submittedAt: "2024-01-19",
  },
  {
    title: "XrmToolBox Essential Plugins Guide",
    url: "https://example.com/xrmtoolbox-guide",
    description: "Lista dos plugins essenciais do XrmToolBox para administradores e desenvolvedores.",
    category: "Ferramentas",
    subcategory: "XrmToolBox e Plugins Úteis",
    submittedBy: "Pedro Costa",
    submittedAt: "2024-01-18",
  },
  {
    title: "Security Roles Configuration Tutorial",
    url: "https://example.com/security-roles",
    description: "Tutorial completo sobre configuração de perfis de segurança no Dynamics 365.",
    category: "Segurança",
    subcategory: "Controle de Acessos e Perfis de Segurança",
    submittedBy: "Ana Lima",
    submittedAt: "2024-01-17",
  },
  {
    title: "JavaScript Performance Tips for Dynamics 365",
    url: "https://example.com/js-performance",
    description: "Dicas de performance para scripts JavaScript em formulários do Dynamics 365.",
    category: "Desenvolvimento",
    subcategory: "Scripts JavaScript para Dynamics 365",
    submittedBy: "Carlos Oliveira",
    submittedAt: "2024-01-16",
  },
]

export default function RSSPage() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Link>
              </Button>
              <div className="bg-orange-600 p-2 rounded-lg">
                <Rss className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Feed de Recursos</h1>
                <p className="text-sm text-gray-600">Últimos recursos adicionados à comunidade</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <a href="/api/rss" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Rss className="h-4 w-4" />
                  RSS Feed
                </a>
              </Button>
              <Button asChild>
                <Link href="/submit">Contribuir</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Últimos Recursos Adicionados</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Acompanhe os recursos mais recentes compartilhados pela comunidade Dynamics CRM. Mantenha-se atualizado com
            as últimas ferramentas, tutoriais e documentações.
          </p>
        </div>

        {/* RSS Info */}
        <Card className="mb-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Rss className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Feed RSS Disponível</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Assine nosso feed RSS para receber automaticamente os novos recursos em seu leitor favorito.
                </p>
                <div className="flex items-center gap-2">
                  <code className="bg-white px-2 py-1 rounded text-xs border">
                    https://dynamics-crm-resources.vercel.app/api/rss
                  </code>
                  <Button asChild variant="outline" size="sm">
                    <a href="/api/rss" target="_blank" rel="noopener noreferrer">
                      Abrir RSS
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Resources */}
        <div className="space-y-6">
          {recentResources.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {resource.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {resource.subcategory}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight mb-2">{resource.title}</CardTitle>
                    <CardDescription className="text-sm">{resource.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{resource.submittedBy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(resource.submittedAt)}</span>
                    </div>
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

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" disabled>
            Carregar Mais Recursos
          </Button>
          <p className="text-sm text-gray-500 mt-2">Mostrando os 5 recursos mais recentes</p>
        </div>

        {/* Subscribe Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rss className="h-5 w-5 text-blue-600" />
              Mantenha-se Atualizado
            </CardTitle>
            <CardDescription>
              Não perca nenhum recurso novo! Assine nosso feed RSS ou contribua com a comunidade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="outline" className="flex-1">
                <a href="/api/rss" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Rss className="h-4 w-4" />
                  Assinar RSS Feed
                </a>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/submit" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Contribuir com Recurso
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
