import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export class NeonLikesManager {
  // ❤️ SISTEMA DE LIKES NO NEON
  static async toggleLike(resourceId: number, userId: string): Promise<{ count: number; userLiked: boolean }> {
    try {
      // Verificar se usuário já curtiu
      const [existingLike] = await sql`
        SELECT id FROM user_likes 
        WHERE resource_id = ${resourceId} AND user_id = ${userId}
      `

      if (existingLike) {
        // Remover like
        await sql`DELETE FROM user_likes WHERE resource_id = ${resourceId} AND user_id = ${userId}`
        await sql`UPDATE resources SET likes_count = likes_count - 1 WHERE id = ${resourceId}`

        const [updated] = await sql`SELECT likes_count FROM resources WHERE id = ${resourceId}`
        return { count: updated.likes_count, userLiked: false }
      } else {
        // Adicionar like
        await sql`INSERT INTO user_likes (resource_id, user_id) VALUES (${resourceId}, ${userId})`
        await sql`UPDATE resources SET likes_count = likes_count + 1 WHERE id = ${resourceId}`

        const [updated] = await sql`SELECT likes_count FROM resources WHERE id = ${resourceId}`
        return { count: updated.likes_count, userLiked: true }
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      throw error
    }
  }

  // 🏆 TOP RECURSOS MAIS CURTIDOS
  static async getTopLiked(limit = 5) {
    return await sql`
      SELECT id, title, url, description, category, subcategory, likes_count
      FROM resources 
      WHERE likes_count > 0
      ORDER BY likes_count DESC, submitted_at DESC
      LIMIT ${limit}
    `
  }
}
