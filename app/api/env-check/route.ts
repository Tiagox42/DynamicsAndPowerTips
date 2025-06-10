import { NextResponse } from "next/server"
import { checkEnvironmentVariables, getMissingRequiredVariables } from "@/lib/env-check"

export async function GET() {
  // Verificar se estamos em ambiente de desenvolvimento
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Esta rota só está disponível em ambiente de desenvolvimento" }, { status: 403 })
  }

  const envVars = checkEnvironmentVariables()
  const missingVars = getMissingRequiredVariables()

  return NextResponse.json({
    variables: envVars,
    missing: missingVars,
    status: missingVars.length === 0 ? "ok" : "missing_required_vars",
    timestamp: new Date().toISOString(),
  })
}
