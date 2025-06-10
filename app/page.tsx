"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import { Github, BookOpen, LogOut, Star, Settings, Database, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ResourcesPage } from "@/components/resources-page"
import Link from "next/link"
import { Footer } from "@/components/footer"

// Lista de administradores
const ADMIN_USERS = ["Tiago Dantas", "tiagodantas"]

export default function HomePage() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"
  const isLoading = status === "loading"

  // Verificar se é admin
  const isAdmin =
    isAuthenticated &&
    ADMIN_USERS.some(
      (adminUser) =>
        session?.user?.name?.toLowerCase() === adminUser.toLowerCase() ||
        session?.user?.email?.toLowerCase().includes(adminUser.toLowerCase()),
    )

  const handleGitHubAuth = () => {
    signIn("github")
  }

  const handleSignOut = () => {
    signOut()
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dynamics CRM Resources</h1>
                <p className="text-sm text-gray-600">Recursos da comunidade</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
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

              <Button asChild variant="outline">
                <Link href="/submit">Contribuir</Link>
              </Button>

              {/* Botão Status do Sistema */}
              <Button asChild variant="outline" className="bg-green-50 border-green-200 hover:bg-green-100">
                <Link href="/status" className="flex items-center gap-2 text-green-700">
                  <Activity className="h-4 w-4" />
                  <span>Status</span>
                </Link>
              </Button>

              {isLoading ? (
                <Button disabled variant="outline">
                  <span className="animate-pulse">Carregando...</span>
                </Button>
              ) : !isAuthenticated ? (
                <Button onClick={handleGitHubAuth} className="flex items-center space-x-2">
                  <Github className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              ) : (
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
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <Settings className="h-4 w-4 mr-2" />
                            Admin
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/config" className="cursor-pointer">
                            <Settings className="h-4 w-4 mr-2" />
                            Configuração
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/status" className="cursor-pointer">
                        <Activity className="h-4 w-4 mr-2" />
                        Status do Sistema
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/setup-neon" className="cursor-pointer">
                        <Database className="h-4 w-4 mr-2" />
                        Setup Neon
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <ResourcesPage />
      </main>

      <Footer />
    </div>
  )
}
