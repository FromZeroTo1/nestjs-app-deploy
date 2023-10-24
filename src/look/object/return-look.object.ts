import { Prisma } from '@prisma/client'
import { productReturnObject } from 'src/product/object/return-product.object'

export const lookReturnObject: Prisma.LookSelect = {
	id: true,
	name: true,
	slug: true,
	views: true,
	images: true,
	products: {
		select: productReturnObject
	},
	createdAt: true
}
