export const translations = {
  pt: {
    categories: {
      documentacao: "Documentação e Referências",
      blogs: "Blogs e Comunidades",
      desenvolvimento: "Desenvolvimento e Customização",
      consultas: "Consultas e Relatórios",
      automate: "Power Automate e Integrações",
      ferramentas: "Ferramentas e Utilitários",
      seguranca: "Segurança e Administração",
      dicas: "Dicas e Truques",
    },
    subcategories: {
      "Principais Blogs sobre Dynamics CRM": "Principais Blogs sobre Dynamics CRM",
      "Comunidades e Fóruns": "Comunidades e Fóruns",
      "Canais do YouTube e Podcasts": "Canais do YouTube e Podcasts",
      "Ferramentas para Debug e Logging": "Ferramentas para Debug e Logging",
      "Customizações de Formulários e Views": "Customizações de Formulários e Views",
      "Manipulação de Ribbon (Comandos de Botão)": "Manipulação de Ribbon (Comandos de Botão)",
      "Scripts JavaScript para Dynamics 365": "Scripts JavaScript para Dynamics 365",
      "Uso de Web Resources": "Uso de Web Resources",
      "Modelos de Plugins e Código em C#": "Modelos de Plugins e Código em C#",
      "Consultas FetchXML": "Consultas FetchXML",
      "Consultas LINQ e QueryExpression": "Consultas LINQ e QueryExpression",
      "Power BI e Dashboards no Dynamics": "Power BI e Dashboards no Dynamics",
      "Fluxos de Automação no Power Automate": "Fluxos de Automação no Power Automate",
      "Integração com APIs Externas": "Integração com APIs Externas",
      "Uso de Connectors Customizados": "Uso de Connectors Customizados",
      "XrmToolBox e Plugins Úteis": "XrmToolBox e Plugins Úteis",
      "Geradores de Código e Snippets": "Geradores de Código e Snippets",
      "Controle de Acessos e Perfis de Segurança": "Controle de Acessos e Perfis de Segurança",
      "Gerenciamento de Soluções": "Gerenciamento de Soluções",
      "Melhores Práticas para ALM (Application Lifecycle Management)": "Melhores Práticas para ALM",
      "Melhores Práticas para Performance": "Melhores Práticas para Performance",
      "Atalhos e Comandos Úteis": "Atalhos e Comandos Úteis",
      "Erros Comuns e Como Resolver": "Erros Comuns e Como Resolver",
    },
  },
  en: {
    categories: {
      documentacao: "Documentation and References",
      blogs: "Blogs and Communities",
      desenvolvimento: "Development and Customization",
      consultas: "Queries and Reports",
      automate: "Power Automate and Integrations",
      ferramentas: "Tools and Utilities",
      seguranca: "Security and Administration",
      dicas: "Tips and Tricks",
    },
    subcategories: {
      "Principais Blogs sobre Dynamics CRM": "Main Dynamics CRM Blogs",
      "Comunidades e Fóruns": "Communities and Forums",
      "Canais do YouTube e Podcasts": "YouTube Channels and Podcasts",
      "Ferramentas para Debug e Logging": "Debug and Logging Tools",
      "Customizações de Formulários e Views": "Form and View Customizations",
      "Manipulação de Ribbon (Comandos de Botão)": "Ribbon Manipulation (Button Commands)",
      "Scripts JavaScript para Dynamics 365": "JavaScript Scripts for Dynamics 365",
      "Uso de Web Resources": "Web Resources Usage",
      "Modelos de Plugins e Código em C#": "Plugin Templates and C# Code",
      "Consultas FetchXML": "FetchXML Queries",
      "Consultas LINQ e QueryExpression": "LINQ and QueryExpression Queries",
      "Power BI e Dashboards no Dynamics": "Power BI and Dynamics Dashboards",
      "Fluxos de Automação no Power Automate": "Power Automate Automation Flows",
      "Integração com APIs Externas": "External API Integration",
      "Uso de Connectors Customizados": "Custom Connectors Usage",
      "XrmToolBox e Plugins Úteis": "XrmToolBox and Useful Plugins",
      "Geradores de Código e Snippets": "Code Generators and Snippets",
      "Controle de Acessos e Perfis de Segurança": "Access Control and Security Profiles",
      "Gerenciamento de Soluções": "Solution Management",
      "Melhores Práticas para ALM (Application Lifecycle Management)": "ALM Best Practices",
      "Melhores Práticas para Performance": "Performance Best Practices",
      "Atalhos e Comandos Úteis": "Useful Shortcuts and Commands",
      "Erros Comuns e Como Resolver": "Common Errors and Solutions",
    },
  },
}

export function getTranslation(
  key: string,
  category: "categories" | "subcategories",
  language: "pt" | "en" = "pt",
): string {
  return translations[language][category][key as keyof (typeof translations)["pt"]["categories"]] || key
}
