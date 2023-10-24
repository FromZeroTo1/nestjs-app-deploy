import { Prisma } from '@prisma/client'

export const postReturnObject: Prisma.PostSelect = {
	id: true,
	name: true,
	slug: true,
	poster: true,
	views: true,
	author: true,
	createdAt: true
}
