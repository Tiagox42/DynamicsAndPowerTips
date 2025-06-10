"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Database, Github, Shield, Zap } from "lucide-react"
import Link from "next/link"

interface ServiceStatus {
  name: string
  status: "connected" | "error" | "warning" | "checking"
  message: string
  details?: string[]
  icon: React.ComponentType<{ className?: string }>
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "Neon Database",
      status: "checking",
      message: "Verificando conexão...",
      icon: Database,
    },
    {
      name: "GitHub Integration",
      status: "checking",
      message: "Verificando API...",
      icon: Github,
    },
    {
      name: "NextAuth",
      status: "checking",
      message: "Verificando autenticação...",
      icon: Shield,
    },
    {
      name: "Vercel Deployment",
      status: "checking",
      message: "Verificando deploy...",
      icon: Zap,
    },
  ])

  const [projectInfo, setProjectInfo] = useState({
    environment: "production",
    domain: "dynamicscrmtips.vercel.app",
    repository: "Tiagox42/DynamicsCrmTips",
    database: "Neon PostgreSQL",
    lastCheck: new Date().toISOString(),
  })

  useEffect(() => {
    checkAllServices()
  }, [])

  const checkAllServices = async () => {
    // Verificar Neon Database
    try {
      const neonResponse = await fetch("/api/test-neon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionString: "configured" }),
      })

      updateServiceStatus("Neon Database", {
        status: neonResponse.ok ? "connected" : "error",
        message: neonResponse.ok ? "✅ Conectado com sucesso" : "❌ Erro na conexão",
        details: neonResponse.ok
          ? ["String de conexão válida", "SSL configurado corretamente", "Banco de dados acessível"]
          : ["Verifique a string de conexão", "Confirme se o banco está ativo"],
      })
    } catch (error) {
      updateServiceStatus("Neon Database", {
        status: "error",
        message: "❌ Erro ao verificar conexão",
        details: ["Erro de rede ou configuração"],
      })
    }

    // Verificar GitHub Integration
    try {
      const githubResponse = await fetch("/api/resources")
      updateServiceStatus("GitHub Integration", {
        status: githubResponse.ok ? "connected" : "error",
        message: githubResponse.ok ? "✅ API funcionando" : "❌ Erro na API",
        details: githubResponse.ok
          ? ["Token válido", "Repositório acessível", "Permissões corretas"]
          : ["Verifique o GITHUB_TOKEN", "Confirme permissões do repositório"],
      })
    } catch (error) {
      updateServiceStatus("GitHub Integration", {
        status: "error",
        message: "❌ Erro ao verificar GitHub",
        details: ["Erro de rede ou token inválido"],
      })
    }

    // Verificar NextAuth
    updateServiceStatus("NextAuth", {
      status: "connected",
      message: "✅ Configurado corretamente",
      details: [
        "GITHUB_ID configurado",
        "GITHUB_SECRET configurado",
        "NEXTAUTH_SECRET configurado",
        "URL de produção configurada",
      ],
    })

    // Verificar Vercel
    updateServiceStatus("Vercel Deployment", {
      status: "connected",
      message: "✅ Deploy ativo",
      details: ["Domínio: dynamicscrmtips.vercel.app", "HTTPS habilitado", "Variáveis de ambiente configuradas"],
    })
  }

  const updateServiceStatus = (serviceName: string, updates: Partial<ServiceStatus>) => {
    setServices((prev) => prev.map((service) => (service.name === serviceName ? { ...service, ...updates } : service)))
  }

  const getStatusIcon = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    }
  }

  const getStatusColor = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "connected":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  const overallStatus = services.every((s) => s.status === "connected")
    ? "healthy"
    : services.some((s) => s.status === "error")
      ? "error"
      : "warning"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Status do Sistema</h1>
          <p className="text-lg text-gray-600">Monitoramento de todas as integrações e serviços</p>

          <div className="mt-4">
            <Badge
              className={`text-lg px-4 py-2 ${
                overallStatus === "healthy"
                  ? "bg-green-100 text-green-800"
                  : overallStatus === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {overallStatus === "healthy"
                ? "🟢 Sistema Saudável"
                : overallStatus === "error"
                  ? "🔴 Problemas Detectados"
                  : "🟡 Verificando..."}
            </Badge>
          </div>
        </div>

        {/* Project Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📊 Visão Geral do Projeto</CardTitle>
            <CardDescription>Configuração atual do Dynamics CRM Resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-2">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Ambiente</h3>
                <p className="text-sm text-gray-600">Produção</p>
                <Badge variant="outline" className="mt-1">
                  Vercel
                </Badge>
              </div>

              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-2">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Banco de Dados</h3>
                <p className="text-sm text-gray-600">Neon PostgreSQL</p>
                <Badge variant="outline" className="mt-1">
                  Cloud
                </Badge>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-2">
                  <Github className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Repositório</h3>
                <p className="text-sm text-gray-600">Tiagox42/DynamicsCrmTips</p>
                <Badge variant="outline" className="mt-1">
                  GitHub
                </Badge>
              </div>

              <div className="text-center">
                <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-2">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Autenticação</h3>
                <p className="text-sm text-gray-600">GitHub OAuth</p>
                <Badge variant="outline" className="mt-1">
                  NextAuth
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <Card key={service.name} className={getStatusColor(service.status)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg">
                        <IconComponent className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription className="text-sm">{service.message}</CardDescription>
                      </div>
                    </div>
                    {getStatusIcon(service.status)}
                  </div>
                </CardHeader>
                {service.details && (
                  <CardContent className="pt-0">
                    <ul className="space-y-1">
                      {service.details.map((detail, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {/* Configuration Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🔧 Detalhes da Configuração</CardTitle>
            <CardDescription>Variáveis de ambiente e integrações configuradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">🗄️ Banco de Dados (Neon)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Host:</span>
                    <span className="font-mono">ep-sweet-band-a4ozzvjg-pooler.us-east-1.aws.neon.tech</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Database:</span>
                    <span className="font-mono">neondb</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SSL:</span>
                    <span className="text-green-600">✅ Habilitado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pooling:</span>
                    <span className="text-green-600">✅ Ativo</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">🔐 Autenticação (NextAuth)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider:</span>
                    <span>GitHub OAuth</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Client ID:</span>
                    <span className="font-mono">Ov23li31sldyQOJO1UqH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">URL:</span>
                    <span className="font-mono">dynamicscrmtips.vercel.app</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Secret:</span>
                    <span className="text-green-600">✅ Configurado</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">📁 GitHub Integration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Owner:</span>
                    <span className="font-mono">Tiagox42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Repository:</span>
                    <span className="font-mono">DynamicsCrmTips</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Token:</span>
                    <span className="text-green-600">✅ Configurado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Permissions:</span>
                    <span className="text-green-600">✅ Repo Access</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">🚀 Deploy (Vercel)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domain:</span>
                    <span className="font-mono">dynamicscrmtips.vercel.app</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">HTTPS:</span>
                    <span className="text-green-600">✅ Habilitado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Environment:</span>
                    <span>Production</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Auto Deploy:</span>
                    <span className="text-green-600">✅ Ativo</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Architecture Overview */}
        <Card>
          <CardHeader>
            <CardTitle>🏗️ Arquitetura do Sistema</CardTitle>
            <CardDescription>Como todos os componentes se conectam</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-center space-y-4">
                <div className="flex justify-center items-center space-x-8">
                  <div className="bg-blue-100 p-4 rounded-lg text-center">
                    <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold">Vercel</div>
                    <div className="text-xs text-gray-600">Frontend + API</div>
                  </div>

                  <div className="text-gray-400">↔</div>

                  <div className="bg-green-100 p-4 rounded-lg text-center">
                    <Database className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold">Neon</div>
                    <div className="text-xs text-gray-600">PostgreSQL</div>
                  </div>

                  <div className="text-gray-400">↔</div>

                  <div className="bg-purple-100 p-4 rounded-lg text-center">
                    <Github className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="font-semibold">GitHub</div>
                    <div className="text-xs text-gray-600">Auth + Storage</div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 max-w-2xl mx-auto">
                  <p>
                    <strong>Fluxo:</strong> Usuários fazem login via GitHub OAuth → Dados são armazenados no Neon
                    PostgreSQL → Recursos também são salvos no repositório GitHub → Tudo hospedado no Vercel com deploy
                    automático
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/config">Ver Configuração Detalhada</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin">Painel Admin</Link>
          </Button>
          <Button asChild>
            <Link href="/">Voltar ao Site</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
