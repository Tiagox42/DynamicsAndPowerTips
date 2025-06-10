"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Database, CheckCircle, XCircle, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function SetupNeonPage() {
  const [connectionString, setConnectionString] = useState("")
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  const testConnection = async () => {
    if (!connectionString) {
      setConnectionResult({
        success: false,
        message: "Por favor, insira a string de conexão",
      })
      return
    }

    setIsTestingConnection(true)
    setConnectionResult(null)

    try {
      const response = await fetch("/api/test-neon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ connectionString }),
      })

      const result = await response.json()

      setConnectionResult({
        success: response.ok,
        message: result.message || (response.ok ? "Conexão bem-sucedida!" : "Erro na conexão"),
      })
    } catch (error) {
      setConnectionResult({
        success: false,
        message: "Erro ao testar conexão: " + (error instanceof Error ? error.message : "Erro desconhecido"),
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exampleEnvContent = `# Neon Database Configuration
DATABASE_URL="${connectionString || "postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"}"

# Outras variáveis necessárias
GITHUB_TOKEN=seu_github_token
GITHUB_OWNER=Tiagox42
GITHUB_REPO=DynamicsCrmTips
NEXT_PUBLIC_GITHUB_OWNER=Tiagox42
NEXT_PUBLIC_GITHUB_REPO=DynamicsCrmTips
GITHUB_ID=seu_github_client_id
GITHUB_SECRET=seu_github_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Início
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-green-600 p-3 rounded-full w-16 h-16 mx-auto mb-4">
            <Database className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuração do Neon Database</h1>
          <p className="text-lg text-gray-600">Guia passo a passo para conectar seu banco de dados Neon</p>
        </div>

        {/* Passo 1: Criar conta no Neon */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                1
              </span>
              Criar Conta no Neon
            </CardTitle>
            <CardDescription>Primeiro, você precisa criar uma conta gratuita no Neon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">🚀 Passos para criar conta:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>
                  Acesse{" "}
                  <a
                    href="https://neon.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-600"
                  >
                    neon.tech
                  </a>
                </li>
                <li>Clique em "Sign Up" no canto superior direito</li>
                <li>Faça login com GitHub, Google ou email</li>
                <li>Confirme sua conta se necessário</li>
              </ol>
            </div>
            <Button asChild className="w-full">
              <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Abrir Neon.tech
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Passo 2: Criar projeto */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                2
              </span>
              Criar Novo Projeto
            </CardTitle>
            <CardDescription>Configure seu primeiro projeto no Neon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">📝 Configurações recomendadas:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                <li>
                  <strong>Project name:</strong> dynamics-crm-resources
                </li>
                <li>
                  <strong>Database name:</strong> main (padrão)
                </li>
                <li>
                  <strong>Region:</strong> Escolha a mais próxima (ex: US East para Brasil)
                </li>
                <li>
                  <strong>PostgreSQL version:</strong> 15 ou mais recente
                </li>
              </ul>
            </div>
            <Alert>
              <AlertDescription>
                💡 <strong>Dica:</strong> O plano gratuito do Neon inclui 512MB de armazenamento e é suficiente para
                este projeto.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Passo 3: Obter string de conexão */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                3
              </span>
              Obter String de Conexão
            </CardTitle>
            <CardDescription>Copie a string de conexão do seu banco de dados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2">🔍 Como encontrar a string de conexão:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
                <li>No dashboard do Neon, clique no seu projeto</li>
                <li>Vá para a aba "Dashboard" ou "Connection Details"</li>
                <li>Procure por "Connection string" ou "Database URL"</li>
                <li>Clique em "Copy" ao lado da string que começa com "postgresql://"</li>
                <li>Cole a string no campo abaixo para testar</li>
              </ol>
            </div>

            <div className="space-y-2">
              <Label htmlFor="connectionString">String de Conexão do Neon</Label>
              <Input
                id="connectionString"
                type="password"
                placeholder="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                A string deve começar com "postgresql://" e conter suas credenciais
              </p>
            </div>

            <Button onClick={testConnection} disabled={isTestingConnection || !connectionString} className="w-full">
              {isTestingConnection ? "Testando..." : "Testar Conexão"}
            </Button>

            {connectionResult && (
              <Alert className={connectionResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {connectionResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={connectionResult.success ? "text-green-800" : "text-red-800"}>
                  {connectionResult.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Passo 4: Configurar variáveis de ambiente */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                4
              </span>
              Configurar Variáveis de Ambiente
            </CardTitle>
            <CardDescription>Adicione a string de conexão ao seu arquivo .env.local</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Arquivo .env.local</h4>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(exampleEnvContent)} className="h-8">
                  {copied ? (
                    <span className="text-green-600 text-xs">Copiado!</span>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
              <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                <code>{exampleEnvContent}</code>
              </pre>
            </div>

            <Alert>
              <AlertDescription>
                📁 <strong>Localização:</strong> Crie ou edite o arquivo <code>.env.local</code> na raiz do seu projeto
                (mesmo nível do package.json)
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Passo 5: Verificar configuração */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                5
              </span>
              Verificar Configuração
            </CardTitle>
            <CardDescription>Confirme se tudo está funcionando</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">✅ Checklist:</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>□ Conta criada no Neon</li>
                  <li>□ Projeto criado</li>
                  <li>□ String de conexão copiada</li>
                  <li>□ Arquivo .env.local criado</li>
                  <li>□ Servidor reiniciado</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">🔧 Próximos passos:</h4>
                <ul className="space-y-1 text-sm text-green-800">
                  <li>1. Reiniciar o servidor (npm run dev)</li>
                  <li>2. Verificar página de configuração</li>
                  <li>3. Testar funcionalidades</li>
                  <li>4. Criar tabelas se necessário</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/config">Verificar Configuração</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/">Voltar ao Início</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-700">🚨 Problemas Comuns</CardTitle>
            <CardDescription>Soluções para erros frequentes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-red-700">Erro: "Connection refused"</h4>
                <p className="text-sm text-gray-600">
                  Verifique se a string de conexão está correta e se o banco está ativo no Neon.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-semibold text-yellow-700">Erro: "SSL required"</h4>
                <p className="text-sm text-gray-600">
                  Certifique-se de que sua string de conexão termina com <code>?sslmode=require</code>
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-700">Erro: "Environment variable not found"</h4>
                <p className="text-sm text-gray-600">
                  Reinicie o servidor após criar o arquivo .env.local: <code>npm run dev</code>
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-700">Banco "suspenso" no Neon</h4>
                <p className="text-sm text-gray-600">
                  No plano gratuito, o banco hiberna após inatividade. A primeira conexão pode demorar alguns segundos.
                </p>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                💬 <strong>Precisa de ajuda?</strong> Se ainda tiver problemas, verifique a{" "}
                <a
                  href="https://neon.tech/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  documentação oficial do Neon
                </a>{" "}
                ou entre em contato.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
