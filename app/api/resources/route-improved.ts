import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // 🚀 QUERY OTIMIZADA NO NEON
    let query = `
      SELECT 
        id, title, title_en, url, description, description_en,
        category, subcategory, submitted_by, submitted_at, likes_count
      FROM resources 
      WHERE 1=1
    `
    const params: any[] = []

    if (category) {
      query += ` AND category = $${params.length + 1}`
      params.push(category)
    }

    if (search) {
      query += ` AND (title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    query += ` ORDER BY likes_count DESC, submitted_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const resources = await sql(query, params)

    // 📊 ORGANIZAR POR CATEGORIA/SUBCATEGORIA
    const organized: Record<string, Record<string, any[]>> = {}

    resources.forEach((resource: any) => {
      if (!organized[resource.category]) {
        organized[resource.category] = {}
      }
      if (!organized[resource.category][resource.subcategory]) {
        organized[resource.category][resource.subcategory] = []
      }
      organized[resource.category][resource.subcategory].push(resource)
    })

    return NextResponse.json(organized)
  } catch (error) {
    console.error("Error fetching resources:", error)

    // 🔄 FALLBACK PARA GITHUB SE NEON FALHAR
    try {
      const { getGitHubAPI } = await import("@/lib/github-api")
      const githubAPI = getGitHubAPI()
      const fallbackResources = await githubAPI.getAllResources()
      return NextResponse.json(fallbackResources)
    } catch (fallbackError) {
      return NextResponse.json({ error: "Erro ao buscar recursos" }, { status: 500 })
    }
  }
}
