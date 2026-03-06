import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!

  const topic = await prisma.topic.findUnique({
    where: { slug, published: true },
    include: { category: true },
  })

  if (!topic) throw createError({ statusCode: 404, message: 'Okruh nenalezen' })

  return topic
})
