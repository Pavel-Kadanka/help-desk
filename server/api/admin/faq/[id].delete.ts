import { prisma } from '~~/server/utils/prisma'
import { requireAdmin } from '~~/server/utils/requireAdmin'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  await prisma.faq.delete({ where: { id } })
  return { success: true }
})
