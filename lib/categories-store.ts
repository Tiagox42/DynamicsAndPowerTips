"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { LucideIcon } from "lucide-react"
import * as Icons from "lucide-react"

export interface CategoryData {
  key: string
  label: string
  labelEn: string
  icon: string
  subcategories: string[]
}

interface CategoriesStore {
  categories: CategoryData[]
  initializeCategories: (initialCategories: CategoryData[]) => void
  addCategory: (category: CategoryData) => void
  updateCategory: (key: string, category: CategoryData) => void
  deleteCategory: (key: string) => void
  getCategory: (key: string) => CategoryData | undefined
  getCategoriesForSelect: () => Array<{ key: string; label: string; icon: LucideIcon; subcategories: string[] }>
}

// Categorias padrão do sistema
const defaultCategories: CategoryData[] = [
  {
    key: "documentacao",
    label: "Documentação e Referências",
    labelEn: "Documentation and References",
    icon: "BookOpen",
    subcategories: [
      "Documentação Oficial do Dynamics 365",
      "Documentação Oficial da Power Platform",
      "Documentação da API Web do Dataverse",
      "Referências sobre Model-Driven Apps",
      "Referências sobre Canvas Apps",
    ],
  },
  {
    key: "blogs",
    label: "Blogs e Comunidades",
    labelEn: "Blogs and Communities",
    icon: "Users",
    subcategories: ["Principais Blogs sobre Dynamics CRM", "Comunidades e Fóruns", "Canais do YouTube e Podcasts"],
  },
  {
    key: "desenvolvimento",
    label: "Desenvolvimento e Customização",
    labelEn: "Development and Customization",
    icon: "Code",
    subcategories: [
      "Modelos de Plugins e Código em C#",
      "Ferramentas para Debug e Logging",
      "Customizações de Formulários e Views",
      "Manipulação de Ribbon (Comandos de Botão)",
      "Scripts JavaScript para Dynamics 365",
      "Uso de Web Resources",
    ],
  },
  {
    key: "consultas",
    label: "Consultas e Relatórios",
    labelEn: "Queries and Reports",
    icon: "BarChart3",
    subcategories: ["Consultas FetchXML", "Consultas LINQ e QueryExpression", "Power BI e Dashboards no Dynamics"],
  },
  {
    key: "automate",
    label: "Power Automate e Integrações",
    labelEn: "Power Automate and Integrations",
    icon: "Zap",
    subcategories: [
      "Fluxos de Automação no Power Automate",
      "Integração com APIs Externas",
      "Uso de Connectors Customizados",
    ],
  },
  {
    key: "ferramentas",
    label: "Ferramentas e Utilitários",
    labelEn: "Tools and Utilities",
    icon: "Settings",
    subcategories: ["XrmToolBox e Plugins Úteis", "Geradores de Código e Snippets"],
  },
  {
    key: "seguranca",
    label: "Segurança e Administração",
    labelEn: "Security and Administration",
    icon: "Shield",
    subcategories: [
      "Controle de Acessos e Perfis de Segurança",
      "Gerenciamento de Soluções",
      "Melhores Práticas para ALM (Application Lifecycle Management)",
    ],
  },
  {
    key: "dicas",
    label: "Dicas e Truques",
    labelEn: "Tips and Tricks",
    icon: "Lightbulb",
    subcategories: ["Melhores Práticas para Performance", "Atalhos e Comandos Úteis", "Erros Comuns e Como Resolver"],
  },
]

export const useCategoriesStore = create<CategoriesStore>()(
  persist(
    (set, get) => ({
      categories: defaultCategories,

      initializeCategories: (initialCategories) => {
        set({ categories: initialCategories.length > 0 ? initialCategories : defaultCategories })
      },

      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category],
        }))
      },

      updateCategory: (key, updatedCategory) => {
        set((state) => ({
          categories: state.categories.map((cat) => (cat.key === key ? updatedCategory : cat)),
        }))
      },

      deleteCategory: (key) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.key !== key),
        }))
      },

      getCategory: (key) => {
        return get().categories.find((cat) => cat.key === key)
      },

      getCategoriesForSelect: () => {
        return get().categories.map((cat) => ({
          key: cat.key,
          label: cat.label,
          icon: (Icons[cat.icon as keyof typeof Icons] as LucideIcon) || Icons.BookOpen,
          subcategories: cat.subcategories,
        }))
      },
    }),
    {
      name: "dynamics-crm-categories",
      version: 1,
    },
  ),
)
