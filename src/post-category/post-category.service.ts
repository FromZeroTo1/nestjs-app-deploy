import { Injectable, NotFoundException } from '@nestjs/common'
import slugify from 'slugify'
import { PrismaService } from 'src/prisma.service'
import { PostCategoryDto } from './dto/post-category.dto'
import { returnPostCategoryObject } from './object/return-post-category.object'

@Injectable()
export class PostCategoryService {
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

		return this.prisma.postCategory.findMany({
			where: options,
			orderBy: {
				createdAt: 'desc'
			},
			select: returnPostCategoryObject
		})
	}

	async byId(id: number) {
		const postCategory = await this.prisma.postCategory.findUnique({
			where: {
				id
			},
			select: returnPostCategoryObject
		})

		if (!postCategory) throw new NotFoundException('Post Category not found')

		return postCategory
	}

	async create() {
		return this.prisma.postCategory.create({
			data: {
				name: '',
				slug: ''
			}
		})
	}

	async update(id: number, dto: PostCategoryDto) {
		return this.prisma.postCategory.update({
			where: {
				id
			},
			data: {
				name: dto.name,
				slug: slugify(dto.name, {
					lower: true
				})
			}
		})
	}

	async delete(id: number) {
		return this.prisma.postCategory.delete({
			where: {
				id
			}
		})
	}
}
