import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { neon } from "@neondatabase/serverless"
import { getGitHubAPI } from "@/lib/github-api"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { category, subcategory, title, titleEn, url, description, descriptionEn } = body

    if (!category || !subcategory || !title || !url || !description) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    // 1️⃣ SALVAR NO NEON (PRINCIPAL)
    const [newResource] = await sql`
      INSERT INTO resources (
        title, title_en, url, description, description_en,
        category, subcategory, submitted_by
      ) VALUES (
        ${title}, ${titleEn || null}, ${url}, ${description}, ${descriptionEn || null},
        ${category}, ${subcategory}, ${session.user.name || "Anônimo"}
      )
      RETURNING *
    `

    // 2️⃣ BACKUP NO GITHUB (SECUNDÁRIO)
    try {
      const githubAPI = getGitHubAPI()
      await githubAPI.submitResource(
        { category, subcategory, title, titleEn, url, description, descriptionEn },
        { name: session.user.name || "Anônimo", email: session.user.email || "" },
      )
    } catch (githubError) {
      console.warn("GitHub backup failed, but resource saved to database:", githubError)
      // Não falha a operação se GitHub der erro
    }

    return NextResponse.json({
      success: true,
      message: "Recurso salvo com sucesso!",
      data: newResource,
    })
  } catch (error) {
    console.error("Error submitting resource:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
