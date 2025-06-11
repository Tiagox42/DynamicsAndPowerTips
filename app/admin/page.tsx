"use client"

import { useState } from "react"
import { ArrowLeft, Shield, Plus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { CategoryEditorModal } from "@/components/category-editor-modal"
import { useSession } from "next-auth/react"
import { useCategoriesStore } from "@/lib/categories-store"

// Lista de administradores autorizados
const ADMIN_USERS = [
  "Tiago Dantas", // Seu nome no GitHub
  "tiagodantas", // Seu username no GitHub (case insensitive)
]

interface CategoryData {
  key: string
  label: string
  labelEn: string
  icon: string
  subcategories: string[]
}

export default function AdminPage() {
  //const { data: session, status } = useSession()
  const session = { user: { name: "Tiago Dantas", email: "tiagodantas@email.com" } }
  const status = "authenticated"

  const { categories, addCategory, updateCategory, deleteCategory } = useCategoriesStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null)
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error" | null
    message: string | null
  }>({ type: null, message: null })

  // Verificar se é administrador
  const isAdmin =
    status === "authenticated" &&
    ADMIN_USERS.some(
      (adminUser) =>
        session?.user?.name?.toLowerCase() === adminUser.toLowerCase() ||
        session?.user?.email?.toLowerCase().includes(adminUser.toLowerCase()),
    )

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <CardTitle className="text-red-700">Acesso Negado</CardTitle>
            <CardDescription>Você precisa fazer login para acessar esta página</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/api/auth/signin">Fazer Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <CardTitle className="text-red-700">Acesso Negado</CardTitle>
            <CardDescription>Você não tem permissão para acessar esta página</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Apenas o proprietário do repositório pode acessar o painel administrativo.
            </p>
            <Button asChild>
              <Link href="/">Voltar ao Início</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleCreateCategory = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const handleEditCategory = (category: CategoryData) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleSaveCategory = (categoryData: CategoryData) => {
    try {
      if (editingCategory) {
        // Editar categoria existente
        updateCategory(editingCategory.key, categoryData)
        setSaveStatus({
          type: "success",
          message: `Categoria "${categoryData.label}" atualizada com sucesso!`,
        })
      } else {
        // Criar nova categoria
        addCategory(categoryData)
        setSaveStatus({
          type: "success",
          message: `Categoria "${categoryData.label}" criada com sucesso!`,
        })
      }

      // Limpar status após 3 segundos
      setTimeout(() => {
        setSaveStatus({ type: null, message: null })
      }, 3000)
    } catch (error) {
      setSaveStatus({
        type: "error",
        message: "Erro ao salvar categoria. Tente novamente.",
      })
    }
  }

  const handleDeleteCategory = (categoryKey: string) => {
    try {
      const category = categories.find((cat) => cat.key === categoryKey)
      deleteCategory(categoryKey)
      setSaveStatus({
        type: "success",
        message: `Categoria "${category?.label}" excluída com sucesso!`,
      })

      // Limpar status após 3 segundos
      setTimeout(() => {
        setSaveStatus({ type: null, message: null })
      }, 3000)
    } catch (error) {
      setSaveStatus({
        type: "error",
        message: "Erro ao excluir categoria. Tente novamente.",
      })
    }
  }

  const exportCategories = () => {
    const dataStr = JSON.stringify(categories, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "categories.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
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
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-600">Gerenciamento de categorias e configurações</p>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">
                Logado como <strong>{session?.user?.name || "Administrador"}</strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Status Messages */}
          {saveStatus.type && (
            <Alert
              className={saveStatus.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
            >
              <AlertDescription className={saveStatus.type === "success" ? "text-green-800" : "text-red-800"}>
                {saveStatus.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Welcome Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Bem-vindo ao Painel Administrativo
              </CardTitle>
              <CardDescription>Gerencie categorias, subcategorias e configurações do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Categorias</h4>
                  <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
                  <p className="text-sm text-blue-700">Categorias ativas</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900">Subcategorias</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {categories.reduce((acc, cat) => acc + cat.subcategories.length, 0)}
                  </p>
                  <p className="text-sm text-green-700">Subcategorias totais</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900">Usuário</h4>
                  <p className="text-sm font-medium text-purple-600">{session?.user?.name}</p>
                  <p className="text-sm text-purple-700">Administrador</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gerenciamento de Categorias</CardTitle>
                  <CardDescription>Visualize e edite as categorias e subcategorias do sistema</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={exportCategories}>
                    Exportar JSON
                  </Button>
                  <Button disabled onClick={handleCreateCategory} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Categoria
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {categories.map((category) => {
                  return (
                    <div key={category.key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-600 p-2 rounded-lg">
                            <Shield className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{category.label}</h3>
                            <p className="text-sm text-gray-600">{category.labelEn && `EN: ${category.labelEn}`}</p>
                            <p className="text-xs text-gray-500">Chave: {category.key}</p>
                          </div>
                          <Badge variant="outline">{category.subcategories.length} subcategorias</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button disabled variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {category.subcategories.map((subcategory, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded border flex items-center justify-between">
                            <span className="text-sm text-gray-700">{subcategory}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>Configurações gerais e integrações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Repositório GitHub</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Owner:</span>
                      <span className="text-sm font-medium">Tiagox42</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Repository:</span>
                      <span className="text-sm font-medium">DynamicsCrmTips</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Branch:</span>
                      <span className="text-sm font-medium">main</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Estatísticas</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total de categorias:</span>
                      <span className="text-sm font-medium">{categories.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total de subcategorias:</span>
                      <span className="text-sm font-medium">
                        {categories.reduce((acc, cat) => acc + cat.subcategories.length, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Último update:</span>
                      <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Category Editor Modal */}
      <CategoryEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        onSave={handleSaveCategory}
        onDelete={handleDeleteCategory}
      />
    </div>
  )
}
