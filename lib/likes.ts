// Sistema de likes usando localStorage
export interface LikeData {
  resourceId: string
  count: number
  userLiked: boolean
}

export class LikesManager {
  private static STORAGE_KEY = "dynamics-crm-likes"
  private static USER_LIKES_KEY = "dynamics-crm-user-likes"

  // Gerar ID único para um recurso
  static generateResourceId(title: string, url: string): string {
    return btoa(`${title}-${url}`)
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 16)
  }

  // Obter contagem de likes para um recurso
  static getLikes(resourceId: string): number {
    if (typeof window === "undefined") return 0

    try {
      const likes = localStorage.getItem(this.STORAGE_KEY)
      const likesData = likes ? JSON.parse(likes) : {}
      return likesData[resourceId] || 0
    } catch {
      return 0
    }
  }

  // Verificar se usuário já curtiu
  static hasUserLiked(resourceId: string): boolean {
    if (typeof window === "undefined") return false

    try {
      const userLikes = localStorage.getItem(this.USER_LIKES_KEY)
      const userLikesData = userLikes ? JSON.parse(userLikes) : {}
      return userLikesData[resourceId] || false
    } catch {
      return false
    }
  }

  // Toggle like
  static toggleLike(resourceId: string): { count: number; userLiked: boolean } {
    if (typeof window === "undefined") return { count: 0, userLiked: false }

    try {
      // Obter dados atuais
      const likes = localStorage.getItem(this.STORAGE_KEY)
      const userLikes = localStorage.getItem(this.USER_LIKES_KEY)

      const likesData = likes ? JSON.parse(likes) : {}
      const userLikesData = userLikes ? JSON.parse(userLikes) : {}

      const currentCount = likesData[resourceId] || 0
      const userLiked = userLikesData[resourceId] || false

      // Toggle
      if (userLiked) {
        // Remove like
        likesData[resourceId] = Math.max(0, currentCount - 1)
        userLikesData[resourceId] = false
      } else {
        // Add like
        likesData[resourceId] = currentCount + 1
        userLikesData[resourceId] = true
      }

      // Salvar
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(likesData))
      localStorage.setItem(this.USER_LIKES_KEY, JSON.stringify(userLikesData))

      return {
        count: likesData[resourceId],
        userLiked: userLikesData[resourceId],
      }
    } catch {
      return { count: 0, userLiked: false }
    }
  }

  // Obter top recursos mais curtidos
  static getTopLikedResources(): Array<{ resourceId: string; count: number }> {
    if (typeof window === "undefined") return []

    try {
      const likes = localStorage.getItem(this.STORAGE_KEY)
      const likesData = likes ? JSON.parse(likes) : {}

      return Object.entries(likesData)
        .map(([resourceId, count]) => ({ resourceId, count: count as number }))
        .filter((item) => item.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
    } catch {
      return []
    }
  }

  // Obter todos os likes
  static getAllLikes(): Record<string, number> {
    if (typeof window === "undefined") return {}

    try {
      const likes = localStorage.getItem(this.STORAGE_KEY)
      return likes ? JSON.parse(likes) : {}
    } catch {
      return {}
    }
  }
}
