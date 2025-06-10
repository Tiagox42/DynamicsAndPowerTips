// Utilitário para verificar variáveis de ambiente

export interface EnvCheckResult {
  name: string
  isSet: boolean
  isPublic: boolean
  description: string
  required: boolean
}

export function checkEnvironmentVariables(): EnvCheckResult[] {
  return [
    {
      name: "GITHUB_TOKEN",
      isSet: !!process.env.GITHUB_TOKEN,
      isPublic: false,
      description: "Token de acesso à API do GitHub para operações de leitura/escrita no repositório",
      required: true,
    },
    {
      name: "GITHUB_OWNER",
      isSet: !!process.env.GITHUB_OWNER,
      isPublic: false,
      description: "Nome do proprietário do repositório GitHub (username ou organização)",
      required: true,
    },
    {
      name: "GITHUB_REPO",
      isSet: !!process.env.GITHUB_REPO,
      isPublic: false,
      description: "Nome do repositório GitHub onde os recursos são armazenados",
      required: true,
    },
    {
      name: "NEXT_PUBLIC_GITHUB_OWNER",
      isSet: !!process.env.NEXT_PUBLIC_GITHUB_OWNER,
      isPublic: true,
      description: "Nome do proprietário do repositório (acessível no cliente)",
      required: true,
    },
    {
      name: "NEXT_PUBLIC_GITHUB_REPO",
      isSet: !!process.env.NEXT_PUBLIC_GITHUB_REPO,
      isPublic: true,
      description: "Nome do repositório (acessível no cliente)",
      required: true,
    },
    {
      name: "GITHUB_ID",
      isSet: !!process.env.GITHUB_ID,
      isPublic: false,
      description: "ID do OAuth App do GitHub para autenticação",
      required: true,
    },
    {
      name: "GITHUB_SECRET",
      isSet: !!process.env.GITHUB_SECRET,
      isPublic: false,
      description: "Secret do OAuth App do GitHub para autenticação",
      required: true,
    },
    {
      name: "NEXTAUTH_URL",
      isSet: !!process.env.NEXTAUTH_URL,
      isPublic: false,
      description: "URL base para NextAuth (autenticação)",
      required: true,
    },
    {
      name: "NEXTAUTH_SECRET",
      isSet: !!process.env.NEXTAUTH_SECRET,
      isPublic: false,
      description: "Chave secreta para criptografia de sessões NextAuth",
      required: true,
    },
  ]
}

export function getMissingRequiredVariables(): string[] {
  return checkEnvironmentVariables()
    .filter((v) => v.required && !v.isSet)
    .map((v) => v.name)
}

export function getPublicVariables(): Record<string, string | undefined> {
  return {
    NEXT_PUBLIC_GITHUB_OWNER: process.env.NEXT_PUBLIC_GITHUB_OWNER,
    NEXT_PUBLIC_GITHUB_REPO: process.env.NEXT_PUBLIC_GITHUB_REPO,
  }
}
