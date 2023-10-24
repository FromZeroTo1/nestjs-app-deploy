import { Prisma } from '@prisma/client'

const returnCategory: Prisma.CategorySelect = {
	id: true,
	name: true,
	slug: true,
	createdAt: true,
}

export const returnCategoryObject: Prisma.CategorySelect = {
	...returnCategory,
	childrens: {
		select: {
			...returnCategory,
			childrens: {
				select: {
					...returnCategory,
					childrens: {
						select: {
							...returnCategory
						}
					}
				}
			}
		}
	}
}
