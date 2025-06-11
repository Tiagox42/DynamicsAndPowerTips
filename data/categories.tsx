import { BookOpen, Users, Code, BarChart3, Zap, Settings, Lightbulb, Shield, Chrome } from "lucide-react"

export const categories = {
  documentacao: {
    label: "Documentação e Referências",
    labelEn: "Documentation and References",
    icon: BookOpen,
    subcategories: [
      "Documentação Oficial do Dynamics 365",
      "Documentação Oficial da Power Platform",
      "Documentação da API Web do Dataverse",
      "Referências sobre Model-Driven Apps",
      "Referências sobre Canvas Apps",
    ],
  },
  blogs: {
    label: "Blogs e Comunidades",
    labelEn: "Blogs and Communities",
    icon: Users,
    subcategories: ["Principais Blogs sobre Dynamics CRM", "Comunidades e Fóruns", "Canais do YouTube e Podcasts"],
  },
  desenvolvimento: {
    label: "Desenvolvimento e Customização",
    labelEn: "Development and Customization",
    icon: Code,
    subcategories: [
      "Modelos de Plugins e Código em C#",
      "Ferramentas para Debug e Logging",
      "Customizações de Formulários e Views",
      "Manipulação de Ribbon (Comandos de Botão)",
      "Scripts JavaScript para Dynamics 365",
      "Uso de Web Resources",
    ],
  },
  consultas: {
    label: "Consultas e Relatórios",
    labelEn: "Queries and Reports",
    icon: BarChart3,
    subcategories: ["Consultas FetchXML", "Consultas LINQ e QueryExpression", "Power BI e Dashboards no Dynamics"],
  },
  automate: {
    label: "Power Automate e Integrações",
    labelEn: "Power Automate and Integrations",
    icon: Zap,
    subcategories: [
      "Fluxos de Automação no Power Automate",
      "Integração com APIs Externas",
      "Uso de Connectors Customizados",
    ],
  },
  powerpages: {
    label: "Power Pages e Portais",
    labelEn: "Power Pages and Portals",
    icon: Chrome,
    subcategories: ["Melhores Práticas para Performance", "Atalhos e Comandos Úteis", "Erros Comuns e Como Resolver"],
  },
  ferramentas: {
    label: "Ferramentas e Utilitários",
    labelEn: "Tools and Utilities",
    icon: Settings,
    subcategories: ["XrmToolBox e Plugins Úteis", "Geradores de Código e Snippets"],
  },
  seguranca: {
    label: "Segurança e Administração",
    labelEn: "Security and Administration",
    icon: Shield,
    subcategories: [
      "Controle de Acessos e Perfis de Segurança",
      "Gerenciamento de Soluções",
      "Melhores Práticas para ALM (Application Lifecycle Management)",
    ],
  },
  dicas: {
    label: "Dicas e Truques",
    labelEn: "Tips and Tricks",
    icon: Lightbulb,
    subcategories: ["Melhores Práticas para Performance", "Atalhos e Comandos Úteis", "Erros Comuns e Como Resolver"],
  },
}

export type CategoryKey = keyof typeof categories
export type Category = (typeof categories)[CategoryKey]
