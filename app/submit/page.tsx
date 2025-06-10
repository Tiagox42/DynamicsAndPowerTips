"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Github, ExternalLink, BookOpen, LogOut, ArrowLeft, CheckCircle, AlertCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { StarRepositoryModal } from "@/components/star-repository-modal"
import { useCategoriesStore } from "@/lib/categories-store"

export default function SubmitPage() {
  const { data: session, status } = useSession()
  const { getCategoriesForSelect } = useCategoriesStore()
  const [categories, setCategories] = useState<ReturnType<typeof getCategoriesForSelect>>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    titleEn: "",
    url: "",
    description: "",
    descriptionEn: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string | null
  }>({ type: null, message: null })
  const [showStarModal, setShowStarModal] = useState(false)

  const isAuthenticated = status === "authenticated"
  const isLoading = status === "loading"

  // Carregar categorias do store
  useEffect(() => {
    setCategories(getCategoriesForSelect())
  }, [getCategoriesForSelect])

  const handleGitHubAuth = () => {
    signIn("github")
  }

  const handleSignOut = () => {
    signOut()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      setSubmitStatus({
        type: "error",
        message: "Por favor, faça login com GitHub primeiro",
      })
      return
    }

    if (!selectedCategory || !selectedSubcategory || !formData.title || !formData.url || !formData.description) {
      setSubmitStatus({
        type: "error",
        message: "Por favor, preencha todos os campos obrigatórios",
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: null })

    try {
      const response = await fetch("/api/resources/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: selectedCategory,
          subcategory: selectedSubcategory,
          title: formData.title,
          titleEn: formData.titleEn,
          url: formData.url,
          description: formData.description,
          descriptionEn: formData.descriptionEn,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Recurso enviado com sucesso! Obrigado pela contribuição.",
        })

        // Reset form
        setFormData({
          title: "",
          titleEn: "",
          url: "",
          description: "",
          descriptionEn: "",
        })
        setSelectedCategory("")
        setSelectedSubcategory("")

        // Mostrar modal para dar star
        setTimeout(() => {
          setShowStarModal(true)
        }, 1500)
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Erro ao enviar o recurso. Por favor, tente novamente.",
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Erro de conexão. Por favor, tente novamente.",
      })
      console.error("Erro ao enviar:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Limpar status de submissão após alguns segundos
  useEffect(() => {
    if (submitStatus.type) {
      const timer = setTimeout(() => {
        setSubmitStatus({ type: null, message: null })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [submitStatus])

  // Obter subcategorias da categoria selecionada
  const selectedCategoryData = categories.find((cat) => cat.key === selectedCategory)
  const availableSubcategories = selectedCategoryData?.subcategories || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
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

              <Button
                asChild
                variant="outline"
                size="sm"
                className="bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
              >
                <a
                  href="https://github.com/Tiagox42/DynamicsCrmTips"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-yellow-700"
                >
                  <Star className="h-4 w-4" />
                  <span>Star</span>
                </a>
              </Button>

              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dynamics CRM Resources</h1>
                <p className="text-sm text-gray-600">Contribua com a comunidade</p>
              </div>
            </div>

            {isLoading ? (
              <Button disabled variant="outline">
                <span className="animate-pulse">Carregando...</span>
              </Button>
            ) : !isAuthenticated ? (
              <Button onClick={handleGitHubAuth} className="flex items-center space-x-2">
                <Github className="h-4 w-4" />
                <span>Login com GitHub</span>
              </Button>
            ) : (
              <div className="flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                          <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-700">{session.user?.name}</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Conectado
                        </Badge>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Compartilhe Recursos Úteis para Dynamics CRM</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ajude a comunidade crescer compartilhando links úteis, tutoriais, ferramentas e documentações que podem
            ajudar outros desenvolvedores e consultores Dynamics CRM.
          </p>
        </div>

        {/* Categories Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <div key={category.key} className="bg-white p-4 rounded-lg shadow-sm border text-center">
                <IconComponent className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-xs font-medium text-gray-700">{category.label}</p>
              </div>
            )
          })}
        </div>

        {/* Status Messages */}
        {submitStatus.type && (
          <Alert
            className={`mb-6 ${submitStatus.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            {submitStatus.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={submitStatus.type === "success" ? "text-green-800" : "text-red-800"}>
              {submitStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Submission Form */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ExternalLink className="h-5 w-5 text-blue-600" />
              <span>Adicionar Novo Recurso</span>
            </CardTitle>
            <CardDescription>
              Preencha as informações abaixo para adicionar um novo recurso à nossa base de conhecimento.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria Principal *</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                      setSelectedCategory(value)
                      setSelectedSubcategory("")
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.key} value={category.key}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategoria *</Label>
                  <Select
                    value={selectedSubcategory}
                    onValueChange={setSelectedSubcategory}
                    disabled={!selectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma subcategoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubcategories.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Resource Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Recurso *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: How to Debug Dynamics 365 Plugins | Plugin Profiler & Plugin Trace Viewer Tutorial"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">URL do Recurso *</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://exemplo.com/artigo-ou-ferramenta"
                    value={formData.url}
                    onChange={(e) => handleInputChange("url", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição / Resumo *</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva brevemente o que é este recurso, para que serve e como pode ajudar outros desenvolvedores..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">🇺🇸</span>
                  <h4 className="font-medium text-gray-700">English Translation (Optional)</h4>
                  <Badge variant="secondary" className="text-xs">
                    Recommended
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="titleEn">English Title</Label>
                  <Input
                    id="titleEn"
                    placeholder="Ex: How to Debug Dynamics 365 Plugins | Plugin Profiler & Plugin Trace Viewer Tutorial"
                    value={formData.titleEn}
                    onChange={(e) => handleInputChange("titleEn", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptionEn">English Description</Label>
                  <Textarea
                    id="descriptionEn"
                    placeholder="Briefly describe what this resource is, what it's for, and how it can help other developers..."
                    value={formData.descriptionEn}
                    onChange={(e) => handleInputChange("descriptionEn", e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-500">
                  {isAuthenticated ? (
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Conectado como {session.user?.name}</span>
                    </span>
                  ) : (
                    <span className="text-amber-600">⚠️ Faça login com GitHub para enviar</span>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={!isAuthenticated || isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Recurso"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Todos os recursos enviados serão adicionados diretamente ao repositório GitHub. Obrigado por contribuir com
            a comunidade Dynamics CRM!
          </p>
        </div>
      </main>

      <Footer />

      {/* Star Repository Modal */}
      <StarRepositoryModal isOpen={showStarModal} onClose={() => setShowStarModal(false)} />
    </div>
  )
}
