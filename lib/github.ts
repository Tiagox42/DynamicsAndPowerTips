// Função para enviar dados para o GitHub
export async function submitToGitHub(
  data: {
    category: string
    subcategory: string
    title: string
    url: string
    description: string
  },
  accessToken: string,
) {
  // Nome do repositório e proprietário
  const owner = "seu-usuario-github"
  const repo = "dynamics-crm-resources"

  // Formatar o conteúdo para o arquivo markdown
  const content = `---
category: ${data.category}
subcategory: ${data.subcategory}
title: ${data.title}
url: ${data.url}
---

${data.description}
`

  // Criar um nome de arquivo baseado no título
  const fileName = `resources/${data.category}/${data.title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")}.md`

  // Codificar o conteúdo em base64 (requisito da API do GitHub)
  const contentEncoded = Buffer.from(content).toString("base64")

  try {
    // Verificar se o arquivo já existe
    let sha
    try {
      const checkResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`, {
        headers: {
          Authorization: `token ${accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (checkResponse.ok) {
        const fileData = await checkResponse.json()
        sha = fileData.sha
      }
    } catch (error) {
      // Arquivo não existe, continuamos sem o SHA
    }

    // Criar ou atualizar o arquivo
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add resource: ${data.title}`,
        content: contentEncoded,
        sha: sha, // Incluir SHA se estiver atualizando um arquivo existente
      }),
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error submitting to GitHub:", error)
    throw error
  }
}
