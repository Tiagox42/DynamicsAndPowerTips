"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Github } from "lucide-react"
import Link from "next/link"

const errorMessages: Record<string, string> = {
  Configuration: "Erro de configuração do servidor. Verifique as variáveis de ambiente.",
  AccessDenied: "Acesso negado. Você cancelou a autenticação ou não tem permissão.",
  Verification: "Erro de verificação. O token pode ter expirado.",
  Default: "Erro desconhecido durante a autenticação.",
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "Default"

  const errorMessage = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <CardTitle className="text-red-700">Erro de Autenticação</CardTitle>
          <CardDescription>Ocorreu um problema durante o login</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Início
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/api/auth/signin" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                Tentar Novamente
              </Link>
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
              <strong>Debug Info:</strong>
              <br />
              Error: {error}
              <br />
              GITHUB_ID: {process.env.GITHUB_ID ? "✓ Configurado" : "✗ Não configurado"}
              <br />
              GITHUB_SECRET: {process.env.GITHUB_SECRET ? "✓ Configurado" : "✗ Não configurado"}
              <br />
              NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? "✓ Configurado" : "✗ Não configurado"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
