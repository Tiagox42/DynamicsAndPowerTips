import { NextResponse } from "next/server"
import { getGitHubAPI } from "@/lib/github-api"

export async function GET() {
  try {
    const githubAPI = getGitHubAPI()
    const resources = await githubAPI.getAllResources()

    return NextResponse.json(resources)
  } catch (error) {
    console.error("Error fetching resources:", error)

    // Fallback para dados mockados em caso de erro
    const mockResources = {
      blogs: {
        "Principais Blogs sobre Dynamics CRM": [
          {
            title: "100 Best CRM Blogs and Websites in 2025",
            url: "https://blog.feedspot.com/crm_blogs/",
            description:
              "Os melhores blogs de CRM de milhares de blogs na web e classificados por relevância, autoridade, seguidores nas redes sociais e novidades.",
            submittedBy: "João Silva",
            submittedAt: "2024-01-15",
            category: "blogs",
            subcategory: "Principais Blogs sobre Dynamics CRM",
            fileName: "100-best-crm-blogs.md",
          },
        ],
      },
      desenvolvimento: {
        "Ferramentas para Debug e Logging": [
          {
            title: "How to Debug Dynamics 365 Plugins | Plugin Profiler & Plugin Trace Viewer Tutorial",
            url: "https://www.youtube.com/watch?v=example",
            description: "Como debugar plugin do Dynamics no visual studio.",
            submittedBy: "Maria Santos",
            submittedAt: "2024-01-14",
            category: "desenvolvimento",
            subcategory: "Ferramentas para Debug e Logging",
            fileName: "debug-plugins-tutorial.md",
          },
        ],
        "Customizações de Formulários e Views": [
          {
            title: "How to disable all fields in a Dynamics 365 CRM Form?",
            url: "https://stackoverflow.com/questions/example",
            description: "Como desabilitar todos campos de um formulário com JavaScript.",
            submittedBy: "Pedro Costa",
            submittedAt: "2024-01-13",
            category: "desenvolvimento",
            subcategory: "Customizações de Formulários e Views",
            fileName: "disable-form-fields.md",
          },
          {
            title: "Filter By Keyword: How Do You Change the Search Columns?",
            url: "https://community.dynamics.com/example",
            description: "Alterar campos que são pesquisados na home view de uma entidade.",
            submittedBy: "Ana Lima",
            submittedAt: "2024-01-12",
            category: "desenvolvimento",
            subcategory: "Customizações de Formulários e Views",
            fileName: "change-search-columns.md",
          },
        ],
        "Manipulação de Ribbon (Comandos de Botão)": [
          {
            title: "Run JavaScript from Ribbon WorkBench in Dynamics CRM",
            url: "https://ribbonworkbench.uservoice.com/example",
            description: "Como usar javascript no Ribbon Workbench.",
            submittedBy: "Carlos Oliveira",
            submittedAt: "2024-01-11",
            category: "desenvolvimento",
            subcategory: "Manipulação de Ribbon (Comandos de Botão)",
            fileName: "ribbon-javascript.md",
          },
        ],
      },
    }

    return NextResponse.json(mockResources)
  }
}
