import { prisma } from '~~/server/utils/prisma'
import { requireAdmin } from '~~/server/utils/requireAdmin'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  return prisma.topic.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug,
      categoryId: body.categoryId ? Number(body.categoryId) : undefined,
      summary: body.summary,
      content: body.content,
      sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
      published: body.published !== undefined ? Boolean(body.published) : undefined,
    },
  })
})
