"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, XCircle, Copy, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EnvCheckResult {
  name: string
  isSet: boolean
  isPublic: boolean
  description: string
  required: boolean
}

interface EnvCheckResponse {
  variables: EnvCheckResult[]
  missing: string[]
  status: "ok" | "missing_required_vars"
  timestamp: string
}

export default function ConfigPage() {
  const [envCheck, setEnvCheck] = useState<EnvCheckResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const fetchEnvCheck = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/env-check")

      if (!response.ok) {
        throw new Error(`Erro ao verificar variáveis: ${response.status}`)
      }

      const data = await response.json()
      setEnvCheck(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      console.error("Erro ao verificar variáveis:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEnvCheck()
  }, [])

  const copyToClipboard = (text: string, name: string) => {
    navigator.clipboard.writeText(text)
    setCopied(name)
    setTimeout(() => setCopied(null), 2000)
  }

  const getEnvFileContent = () => {
    if (!envCheck) return ""

    return envCheck.variables.map((v) => `${v.name}=${v.isSet ? "[CONFIGURADO]" : ""}`).join("\n")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Início
            </Link>
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Configuração do Ambiente</CardTitle>
                <CardDescription>Verificação das variáveis de ambiente necessárias</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={fetchEnvCheck} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : envCheck ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Status do Sistema</h3>
                    <p className="text-sm text-gray-500">
                      Verificado em {new Date(envCheck.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge
                    className={
                      envCheck.status === "ok"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }
                  >
                    {envCheck.status === "ok" ? "Tudo Configurado" : `${envCheck.missing.length} Variáveis Faltando`}
                  </Badge>
                </div>

                {envCheck.missing.length > 0 && (
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertDescription className="text-amber-800">
                      <strong>Atenção:</strong> As seguintes variáveis de ambiente são necessárias e não estão
                      configuradas: <strong>{envCheck.missing.join(", ")}</strong>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="border rounded-md">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Variáveis de Ambiente</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(getEnvFileContent(), ".env")}
                        className="h-8"
                      >
                        {copied === ".env" ? (
                          <span className="text-green-600 text-xs">Copiado!</span>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" /> .env
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="divide-y">
                    {envCheck.variables.map((variable) => (
                      <div key={variable.name} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{variable.name}</span>
                            {variable.required && (
                              <Badge variant="outline" className="text-xs">
                                Obrigatória
                              </Badge>
                            )}
                            {variable.isPublic && (
                              <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                                Cliente
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{variable.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {variable.isSet ? (
                            <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              <span>Configurada</span>
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600 flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              <span>Não configurada</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">Instruções de Configuração</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>
                      Crie um arquivo <code className="bg-gray-200 px-1 rounded">.env.local</code> na raiz do projeto
                    </li>
                    <li>Adicione as variáveis de ambiente necessárias ao arquivo</li>
                    <li>Reinicie o servidor de desenvolvimento</li>
                    <li>Verifique novamente esta página para confirmar que tudo está configurado</li>
                  </ol>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guia de Configuração</CardTitle>
            <CardDescription>Como obter e configurar as variáveis de ambiente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">1. Configuração do GitHub OAuth</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Acesse{" "}
                  <a
                    href="https://github.com/settings/developers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    GitHub Developer Settings
                  </a>
                </li>
                <li>Clique em "New OAuth App"</li>
                <li>
                  Preencha o formulário:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Application name: Dynamics CRM Resources</li>
                    <li>Homepage URL: URL do seu site (ex: http://localhost:3000)</li>
                    <li>
                      Authorization callback URL: URL do seu site + /api/auth/callback/github (ex:
                      http://localhost:3000/api/auth/callback/github)
                    </li>
                  </ul>
                </li>
                <li>Clique em "Register application"</li>
                <li>
                  Copie o "Client ID" para <code className="bg-gray-200 px-1 rounded">GITHUB_ID</code>
                </li>
                <li>
                  Clique em "Generate a new client secret" e copie para{" "}
                  <code className="bg-gray-200 px-1 rounded">GITHUB_SECRET</code>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium mb-2">2. Configuração do Token de Acesso</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Acesse{" "}
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    GitHub Personal Access Tokens
                  </a>
                </li>
                <li>Clique em "Generate new token" (classic)</li>
                <li>Dê um nome ao token (ex: Dynamics CRM Resources)</li>
                <li>
                  Selecione os escopos: <code className="bg-gray-200 px-1 rounded">repo</code>
                </li>
                <li>Clique em "Generate token"</li>
                <li>
                  Copie o token gerado para <code className="bg-gray-200 px-1 rounded">GITHUB_TOKEN</code>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium mb-2">3. Configuração do NextAuth</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Gere um segredo aleatório para <code className="bg-gray-200 px-1 rounded">NEXTAUTH_SECRET</code>:
                  <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs">openssl rand -base64 32</div>
                  <div className="text-xs text-gray-500 mt-1">Ou use um gerador online de strings aleatórias</div>
                </li>
                <li>
                  Configure <code className="bg-gray-200 px-1 rounded">NEXTAUTH_URL</code> com a URL base do seu site:
                  <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs">
                    # Desenvolvimento NEXTAUTH_URL=http://localhost:3000 # Produção
                    NEXTAUTH_URL=https://seu-site.vercel.app
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium mb-2">4. Configuração do Repositório</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Configure o proprietário do repositório:
                  <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs">
                    GITHUB_OWNER=Tiagox42 NEXT_PUBLIC_GITHUB_OWNER=Tiagox42
                  </div>
                </li>
                <li>
                  Configure o nome do repositório:
                  <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs">
                    GITHUB_REPO=DynamicsCrmTips NEXT_PUBLIC_GITHUB_REPO=DynamicsCrmTips
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Exemplo de arquivo .env.local completo</h4>
              <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
                {`# GitHub OAuth App
GITHUB_ID=seu_client_id
GITHUB_SECRET=seu_client_secret

# GitHub Repository
GITHUB_OWNER=Tiagox42
GITHUB_REPO=DynamicsCrmTips
NEXT_PUBLIC_GITHUB_OWNER=Tiagox42
NEXT_PUBLIC_GITHUB_REPO=DynamicsCrmTips

# GitHub Personal Access Token
GITHUB_TOKEN=seu_token_pessoal

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta_aleatoria`}
              </pre>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(
                    `# GitHub OAuth App
GITHUB_ID=seu_client_id
GITHUB_SECRET=seu_client_secret

# GitHub Repository
GITHUB_OWNER=Tiagox42
GITHUB_REPO=DynamicsCrmTips
NEXT_PUBLIC_GITHUB_OWNER=Tiagox42
NEXT_PUBLIC_GITHUB_REPO=DynamicsCrmTips

# GitHub Personal Access Token
GITHUB_TOKEN=seu_token_pessoal

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta_aleatoria`,
                    "env-example",
                  )
                }
                className="mt-2"
              >
                {copied === "env-example" ? (
                  <span className="text-green-600 text-xs">Copiado!</span>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" /> Copiar exemplo
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
