import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

// Verificar se as variáveis de ambiente estão disponíveis
const githubId = process.env.GITHUB_ID
const githubSecret = process.env.GITHUB_SECRET
const nextAuthSecret = process.env.NEXTAUTH_SECRET

// Log para debug (apenas em desenvolvimento)
if (process.env.NODE_ENV === "development") {
  console.log("NextAuth Environment Variables:")
  console.log("GITHUB_ID:", githubId ? "✓ Set" : "✗ Missing")
  console.log("GITHUB_SECRET:", githubSecret ? "✓ Set" : "✗ Missing")
  console.log("NEXTAUTH_SECRET:", nextAuthSecret ? "✓ Set" : "✗ Missing")
  console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "Not set")
}

// Durante o build, usar valores padrão se as variáveis não estiverem disponíveis
const config = {
  providers:
    githubId && githubSecret
      ? [
          GithubProvider({
            clientId: githubId,
            clientSecret: githubSecret,
            authorization: {
              params: {
                scope: "read:user user:email repo",
              },
            },
          }),
        ]
      : [],
  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken as string
      return session
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  secret: nextAuthSecret || "fallback-secret-for-build",
  logger: {
    error(code: any, metadata: any) {
      console.error(`[NextAuth][Error] ${code}:`, metadata)
    },
    warn(code: any) {
      console.warn(`[NextAuth][Warning] ${code}`)
    },
    debug(code: any, metadata: any) {
      if (process.env.NODE_ENV === "development") {
        console.debug(`[NextAuth][Debug] ${code}:`, metadata)
      }
    },
  },
}

const handler = NextAuth(config)

export { handler as GET, handler as POST }
