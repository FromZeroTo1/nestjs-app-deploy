import { Prisma } from '@prisma/client'

export const returnPostCategoryObject: Prisma.PostCategorySelect = {
	id: true,
	name: true,
	slug: true,
	createdAt: true
}
