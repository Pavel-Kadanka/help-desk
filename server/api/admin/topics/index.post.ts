import { prisma } from '~~/server/utils/prisma'
import { requireAdmin } from '~~/server/utils/requireAdmin'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  const { title, slug, categoryId, summary, content, sortOrder, published } = body

  if (!title || !slug || !categoryId || !content) {
    throw createError({ statusCode: 400, message: 'Chybí povinné pole' })
  }

  return prisma.topic.create({
    data: {
      title,
      slug,
      categoryId: Number(categoryId),
      summary: summary ?? null,
      content,
      sortOrder: sortOrder ?? 0,
      published: published ?? true,
    },
  })
})
