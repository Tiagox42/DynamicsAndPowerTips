import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { connectionString } = await request.json()

    if (!connectionString) {
      return NextResponse.json({ success: false, message: "String de conexão é obrigatória" }, { status: 400 })
    }

    // Validar formato básico da string de conexão
    if (!connectionString.startsWith("postgresql://")) {
      return NextResponse.json(
        {
          success: false,
          message: "String de conexão deve começar com 'postgresql://'",
        },
        { status: 400 },
      )
    }

    // Tentar importar e usar o Neon
    try {
      const { neon } = await import("@neondatabase/serverless")
      const sql = neon(connectionString)

      // Teste simples de conexão
      const result = await sql`SELECT 1 as test`

      if (result && result[0]?.test === 1) {
        return NextResponse.json({
          success: true,
          message: "✅ Conexão com Neon estabelecida com sucesso!",
          details: {
            connected: true,
            timestamp: new Date().toISOString(),
          },
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "❌ Conexão estabelecida mas teste de query falhou",
          },
          { status: 500 },
        )
      }
    } catch (dbError) {
      console.error("Database connection error:", dbError)

      let errorMessage = "❌ Erro ao conectar com o banco de dados"

      if (dbError instanceof Error) {
        if (dbError.message.includes("ENOTFOUND")) {
          errorMessage = "❌ Servidor não encontrado. Verifique o hostname na string de conexão."
        } else if (dbError.message.includes("authentication failed")) {
          errorMessage = "❌ Falha na autenticação. Verifique usuário e senha."
        } else if (dbError.message.includes("database") && dbError.message.includes("does not exist")) {
          errorMessage = "❌ Banco de dados não encontrado. Verifique o nome do banco."
        } else if (dbError.message.includes("SSL")) {
          errorMessage = "❌ Erro SSL. Certifique-se de que a string termina com '?sslmode=require'"
        } else {
          errorMessage = `❌ Erro de conexão: ${dbError.message}`
        }
      }

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
          details: {
            error: dbError instanceof Error ? dbError.message : "Erro desconhecido",
          },
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "❌ Erro interno do servidor",
        details: {
          error: error instanceof Error ? error.message : "Erro desconhecido",
        },
      },
      { status: 500 },
    )
  }
}
