import { Injectable, NotFoundException } from '@nestjs/common'
import slugify from 'slugify'
import { PrismaService } from 'src/prisma.service'
import { CategoryDto } from './dto/category.dto'
import { returnCategoryObject } from './object/return-category.object'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				OR: [
					{
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				]
			}
		}

		return this.prisma.category.findMany({
			where: options,
			orderBy: {
				createdAt: 'desc'
			},
			select: returnCategoryObject
		})
	}

	async getPopular(limit: number) {
		const categories = await this.prisma.category.findMany({
			take: limit,
			orderBy: {
				createdAt: 'desc'
			},
			select: returnCategoryObject
		})

		const popularCategories = await Promise.all(
			categories.map(async category => {
				const products = await this.prisma.product.findMany({
					where: {
						categoryId: category.id
					},
					select: {
						id: true,
						name: true,
						views: true,
						images: true
					},
					orderBy: {
						views: 'desc'
					},
					take: 1
				})

				if (products.length > 0) {
					return {
						...category,
						mostPopularProduct: products[0]
					}
				}

				return category
			})
		)

		return popularCategories
	}

	async getChildrensByParentId(categoryId: number) {
		return this.prisma.category.findMany({
			where: { parentId: categoryId }
		})
	}

	async byId(id: number) {
		const category = await this.prisma.category.findUnique({
			where: {
				id
			},
			select: returnCategoryObject
		})

		if (!category) throw new NotFoundException('Category not found')

		return category
	}

	async bySlug(slug: string) {
		const category = await this.prisma.category.findUnique({
			where: {
				slug
			},
			select: returnCategoryObject
		})

		if (!category) throw new NotFoundException('Category not found')

		return category
	}

	async create() {
		return this.prisma.category.create({
			data: {
				name: '',
				slug: ''
			}
		})
	}

	async update(id: number, dto: CategoryDto) {
		return this.prisma.category.update({
			where: {
				id
			},
			data: {
				name: dto.name,
				slug: slugify(dto.name, {
					lower: true
				}),
				parentId: dto.parentId
			}
		})
	}

	async delete(id: number) {
		return this.prisma.category.delete({
			where: {
				id
			}
		})
	}
}
