// Sistema de likes usando GitHub Issues/Comments
export interface LikeData {
  resourceId: string
  count: number
  userLiked: boolean
}

export class GitHubLikesManager {
  // Gerar ID único para um recurso
  static generateResourceId(title: string, url: string): string {
    return btoa(`${title}-${url}`)
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 16)
  }

  // Adicionar like diretamente no arquivo do recurso
  static async toggleLike(
    resourcePath: string,
    title: string,
    url: string,
    accessToken: string,
  ): Promise<{ count: number; userLiked: boolean }> {
    try {
      const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || "Tiagox42"
      const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || "DynamicsCrmTips"

      // Buscar conteúdo atual do arquivo
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${resourcePath}`, {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch resource file")
      }

      const fileData = await response.json()
      const content = Buffer.from(fileData.content, "base64").toString("utf-8")

      // Extrair likes atuais do frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
      if (!frontmatterMatch) {
        throw new Error("Invalid markdown format")
      }

      const [, frontmatter, body] = frontmatterMatch
      const metadata: Record<string, any> = {}

      // Parse do frontmatter
      frontmatter.split("\n").forEach((line) => {
        const [key, ...valueParts] = line.split(":")
        if (key && valueParts.length > 0) {
          metadata[key.trim()] = valueParts.join(":").trim()
        }
      })

      // Atualizar likes
      const currentLikes = Number.parseInt(metadata.likes || "0")
      const newLikes = currentLikes + 1

      metadata.likes = newLikes.toString()
      metadata.lastLiked = new Date().toISOString()

      // Reconstruir frontmatter
      const newFrontmatter = Object.entries(metadata)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")

      const newContent = `---\n${newFrontmatter}\n---\n${body}`

      // Atualizar arquivo
      const updateResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${resourcePath}`, {
        method: "PUT",
        headers: {
          Authorization: `token ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Add like to: ${title}`,
          content: Buffer.from(newContent).toString("base64"),
          sha: fileData.sha,
        }),
      })

      if (!updateResponse.ok) {
        throw new Error("Failed to update resource file")
      }

      return {
        count: newLikes,
        userLiked: true,
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      throw error
    }
  }
}
