import { Prisma } from '@prisma/client'
import { returnCategoryObject } from 'src/category/object/return-category.object'
import { lookReturnObject } from 'src/look/object/return-look.object'

export const productReturnObject: Prisma.ProductSelect = {
	id: true,
	name: true,
	slug: true,
	description: true,
	salePrice: true,
	price: true,
	views: true,
	quantity: true,
	images: true,
	colors: true,
	dimensions: true,
	characteristics: true,
	createdAt: true,
	category: {
		select: returnCategoryObject
	},
	look: {
		select: lookReturnObject
	},
	boughtTimes: true,
	sku: true,
	tags: true
}

export const productReturnObjectFullest: Prisma.ProductSelect = {
	...productReturnObject
}
