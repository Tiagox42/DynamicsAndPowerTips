import { NextResponse } from "next/server"

export async function GET() {
  // Mock data para o RSS - em produção, isso viria do banco de dados
  const recentResources = [
    {
      title: "Advanced Plugin Development in Dynamics 365",
      url: "https://example.com/advanced-plugin-dev",
      description: "Guia completo para desenvolvimento avançado de plugins no Dynamics 365 com exemplos práticos.",
      category: "Desenvolvimento",
      subcategory: "Modelos de Plugins e Código em C#",
      submittedBy: "João Silva",
      submittedAt: "2024-01-20T10:00:00Z",
    },
    {
      title: "Power BI Integration Best Practices",
      url: "https://example.com/powerbi-integration",
      description: "Melhores práticas para integrar Power BI com Dynamics 365 CRM.",
      category: "Consultas e Relatórios",
      subcategory: "Power BI e Dashboards no Dynamics",
      submittedBy: "Maria Santos",
      submittedAt: "2024-01-19T15:30:00Z",
    },
    {
      title: "XrmToolBox Essential Plugins Guide",
      url: "https://example.com/xrmtoolbox-guide",
      description: "Lista dos plugins essenciais do XrmToolBox para administradores e desenvolvedores.",
      category: "Ferramentas",
      subcategory: "XrmToolBox e Plugins Úteis",
      submittedBy: "Pedro Costa",
      submittedAt: "2024-01-18T09:15:00Z",
    },
    {
      title: "Security Roles Configuration Tutorial",
      url: "https://example.com/security-roles",
      description: "Tutorial completo sobre configuração de perfis de segurança no Dynamics 365.",
      category: "Segurança",
      subcategory: "Controle de Acessos e Perfis de Segurança",
      submittedBy: "Ana Lima",
      submittedAt: "2024-01-17T14:20:00Z",
    },
    {
      title: "JavaScript Performance Tips for Dynamics 365",
      url: "https://example.com/js-performance",
      description: "Dicas de performance para scripts JavaScript em formulários do Dynamics 365.",
      category: "Desenvolvimento",
      subcategory: "Scripts JavaScript para Dynamics 365",
      submittedBy: "Carlos Oliveira",
      submittedAt: "2024-01-16T11:45:00Z",
    },
  ]

  const baseUrl = process.env.NEXTAUTH_URL || "https://dynamics-crm-resources.vercel.app"
  const buildDate = new Date().toISOString()

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dynamics CRM Resources - Recursos da Comunidade</title>
    <description>Últimos recursos, ferramentas e tutoriais compartilhados pela comunidade Dynamics CRM</description>
    <link>${baseUrl}</link>
    <language>pt-BR</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml"/>
    <managingEditor>contato@dynamics-crm-resources.com (Dynamics CRM Resources)</managingEditor>
    <webMaster>contato@dynamics-crm-resources.com (Dynamics CRM Resources)</webMaster>
    <category>Technology</category>
    <category>Microsoft Dynamics</category>
    <category>CRM</category>
    <ttl>60</ttl>
    
    ${recentResources
      .map(
        (resource) => `
    <item>
      <title><![CDATA[${resource.title}]]></title>
      <description><![CDATA[${resource.description}]]></description>
      <link>${resource.url}</link>
      <guid isPermaLink="false">${resource.url}-${resource.submittedAt}</guid>
      <pubDate>${new Date(resource.submittedAt).toUTCString()}</pubDate>
      <category><![CDATA[${resource.category}]]></category>
      <category><![CDATA[${resource.subcategory}]]></category>
      <author><![CDATA[${resource.submittedBy}]]></author>
      <source url="${baseUrl}">Dynamics CRM Resources</source>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600", // Cache por 1 hora
    },
  })
}
