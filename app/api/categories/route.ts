import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

// Lista de administradores autorizados
const ADMIN_USERS = ["Tiago Dantas", "tiagodantas"]

export async function GET() {
  try {
    // Retornar categorias atuais (pode ser expandido para ler de um arquivo)
    const { categories } = await import("@/data/categories")

    const categoriesData = Object.entries(categories).map(([key, category]) => ({
      key,
      label: category.label,
      labelEn: category.labelEn || "",
      icon: category.icon.name || "BookOpen",
      subcategories: category.subcategories,
    }))

    return NextResponse.json(categoriesData)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Verificar autenticação e permissões
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const isAdmin = ADMIN_USERS.some(
      (adminUser) =>
        session.user?.name?.toLowerCase() === adminUser.toLowerCase() ||
        session.user?.email?.toLowerCase().includes(adminUser.toLowerCase()),
    )

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const categoriesData = await request.json()

    // Aqui você pode implementar a lógica para salvar as categorias
    // Por exemplo, escrever em um arquivo JSON ou banco de dados
    console.log("Categories to save:", categoriesData)

    return NextResponse.json({
      success: true,
      message: "Categories saved successfully",
      data: categoriesData,
    })
  } catch (error) {
    console.error("Error saving categories:", error)
    return NextResponse.json({ error: "Failed to save categories" }, { status: 500 })
  }
}
