// Utilitários para trabalhar com a API do GitHub
export interface GitHubFile {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: string
  content?: string
  encoding?: string
}

export interface Resource {
  title: string
  titleEn?: string
  url: string
  description: string
  descriptionEn?: string
  category: string
  subcategory: string
  submittedBy: string
  submittedAt: string
  fileName: string
}

export class GitHubAPI {
  private token: string
  private owner: string
  private repo: string

  constructor(token: string, owner: string, repo: string) {
    this.token = token
    this.owner = owner
    this.repo = repo
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`https://api.github.com${endpoint}`, {
      ...options,
      headers: {
        Authorization: `token ${this.token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`GitHub API error: ${response.status} ${response.statusText}`, errorBody)
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getDirectoryContents(path: string): Promise<GitHubFile[]> {
    try {
      return await this.makeRequest(`/repos/${this.owner}/${this.repo}/contents/${path}`)
    } catch (error) {
      console.error(`Error fetching directory ${path}:`, error)
      return []
    }
  }

  async getFileContent(path: string): Promise<string | null> {
    try {
      const file: GitHubFile = await this.makeRequest(`/repos/${this.owner}/${this.repo}/contents/${path}`)

      if (file.content && file.encoding === "base64") {
        return Buffer.from(file.content, "base64").toString("utf-8")
      }

      return null
    } catch (error) {
      console.error(`Error fetching file ${path}:`, error)
      return null
    }
  }

  async createOrUpdateFile(path: string, content: string, message: string, sha?: string): Promise<any> {
    const contentEncoded = Buffer.from(content).toString("base64")

    return this.makeRequest(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
      method: "PUT",
      body: JSON.stringify({
        message,
        content: contentEncoded,
        sha,
      }),
    })
  }

  async getAllResources(): Promise<Record<string, Record<string, Resource[]>>> {
    const resources: Record<string, Record<string, Resource[]>> = {}

    try {
      console.log(`Fetching resources from ${this.owner}/${this.repo}`)

      // Verificar se a pasta resources existe
      const categoryFolders = await this.getDirectoryContents("resources")

      if (categoryFolders.length === 0) {
        console.log("No resources folder found or it's empty")
        return {}
      }

      console.log(`Found ${categoryFolders.length} category folders`)

      for (const categoryFolder of categoryFolders) {
        if (categoryFolder.type === "dir") {
          const categoryKey = categoryFolder.name
          resources[categoryKey] = {}
          console.log(`Processing category: ${categoryKey}`)

          const subcategoryFolders = await this.getDirectoryContents(`resources/${categoryKey}`)

          for (const subcategoryFolder of subcategoryFolders) {
            if (subcategoryFolder.type === "dir") {
              const subcategoryKey = subcategoryFolder.name.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
              resources[categoryKey][subcategoryKey] = []
              console.log(`Processing subcategory: ${subcategoryKey}`)

              const files = await this.getDirectoryContents(`resources/${categoryKey}/${subcategoryFolder.name}`)
              const markdownFiles = files.filter((file) => file.type === "file" && file.name.endsWith(".md"))

              console.log(`Found ${markdownFiles.length} markdown files in ${subcategoryKey}`)

              for (const file of markdownFiles) {
                const content = await this.getFileContent(file.path)

                if (content) {
                  const resource = this.parseMarkdownResource(content, file.name)
                  if (resource) {
                    resources[categoryKey][subcategoryKey].push({
                      ...resource,
                      category: categoryKey,
                      subcategory: subcategoryKey,
                      fileName: file.name,
                    })
                  }
                }
              }
            }
          }
        }
      }

      const totalResources = Object.values(resources).reduce((acc, category) => {
        return acc + Object.values(category).reduce((catAcc, subcategory) => catAcc + subcategory.length, 0)
      }, 0)

      console.log(`Successfully loaded ${totalResources} resources`)
      return resources
    } catch (error) {
      console.error("Error fetching all resources:", error)
      return {}
    }
  }

  private parseMarkdownResource(
    content: string,
    fileName: string,
  ): Omit<Resource, "category" | "subcategory" | "fileName"> | null {
    try {
      // Extrair frontmatter YAML
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)

      if (!frontmatterMatch) {
        return null
      }

      const [, frontmatter, description] = frontmatterMatch
      const metadata: Record<string, string> = {}

      // Parse simples do YAML frontmatter
      frontmatter.split("\n").forEach((line) => {
        const [key, ...valueParts] = line.split(":")
        if (key && valueParts.length > 0) {
          metadata[key.trim()] = valueParts.join(":").trim()
        }
      })

      return {
        title: metadata.title || fileName.replace(".md", ""),
        titleEn: metadata.titleEn || "",
        url: metadata.url || "",
        description: description.trim() || metadata.description || "",
        descriptionEn: metadata.descriptionEn || "",
        submittedBy: metadata.submittedBy || metadata.author || "Anônimo",
        submittedAt: metadata.submittedAt || metadata.date || new Date().toISOString().split("T")[0],
      }
    } catch (error) {
      console.error(`Error parsing markdown file ${fileName}:`, error)
      return null
    }
  }

  async submitResource(
    resource: Omit<Resource, "fileName" | "submittedAt">,
    userInfo: { name: string; email: string },
  ): Promise<any> {
    // Criar nome do arquivo baseado no título
    const fileName = `${resource.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50)}.md`

    // Criar caminho do arquivo
    const filePath = `resources/${resource.category}/${resource.subcategory}/${fileName}`

    // Criar conteúdo markdown com frontmatter
    const content = `---
title: ${resource.title}
titleEn: ${resource.titleEn || ""}
url: ${resource.url}
description: ${resource.description}
descriptionEn: ${resource.descriptionEn || ""}
submittedBy: ${userInfo.name}
submittedAt: ${new Date().toISOString().split("T")[0]}
category: ${resource.category}
subcategory: ${resource.subcategory}
---

${resource.description}

${resource.descriptionEn ? `\n## English Description\n\n${resource.descriptionEn}` : ""}
`

    // Verificar se o arquivo já existe
    let sha: string | undefined
    try {
      const existingFile: GitHubFile = await this.makeRequest(`/repos/${this.owner}/${this.repo}/contents/${filePath}`)
      sha = existingFile.sha
    } catch (error) {
      // Arquivo não existe, continuamos sem SHA
    }

    // Criar ou atualizar arquivo
    return this.createOrUpdateFile(filePath, content, `Add resource: ${resource.title}`, sha)
  }
}

// Instância singleton da API
let githubAPI: GitHubAPI | null = null

export function getGitHubAPI(): GitHubAPI {
  if (!githubAPI) {
    const token = process.env.GITHUB_TOKEN
    const owner = process.env.GITHUB_OWNER || process.env.NEXT_PUBLIC_GITHUB_OWNER || "Tiagox42"
    const repo = process.env.GITHUB_REPO || process.env.NEXT_PUBLIC_GITHUB_REPO || "DynamicsCrmTips"

    if (!token) {
      throw new Error("GITHUB_TOKEN environment variable is required")
    }

    githubAPI = new GitHubAPI(token, owner, repo)
  }

  return githubAPI
}
