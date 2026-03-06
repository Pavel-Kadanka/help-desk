import { prisma } from '~~/server/utils/prisma'
import { requireAdmin } from '~~/server/utils/requireAdmin'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  const { question, answer, sortOrder, published } = body

  if (!question || !answer) {
    throw createError({ statusCode: 400, message: 'Chybí povinné pole' })
  }

  return prisma.faq.create({
    data: { question, answer, sortOrder: sortOrder ?? 0, published: published ?? true },
  })
})
