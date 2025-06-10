import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getGitHubAPI } from "@/lib/github-api"

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse do body da requisição
    const body = await request.json()
    const { category, subcategory, title, titleEn, url, description, descriptionEn } = body

    // Validação dos campos obrigatórios
    if (!category || !subcategory || !title || !url || !description) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Submeter recurso via GitHub API
    const githubAPI = getGitHubAPI()
    const result = await githubAPI.submitResource(
      {
        category,
        subcategory,
        title,
        titleEn,
        url,
        description,
        descriptionEn,
      },
      {
        name: session.user.name || "Usuário Anônimo",
        email: session.user.email || "",
      },
    )

    return NextResponse.json({
      success: true,
      message: "Recurso enviado com sucesso!",
      data: result,
    })
  } catch (error) {
    console.error("Error submitting resource:", error)

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
