import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import slugify from 'slugify'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { EnumPostSort, GetAllPostDto } from './dto/get-all.post.dto'
import { PostDto } from './dto/post.dto'
import { postReturnObject } from './object/return-post.object'

@Injectable()
export class PostService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: GetAllPostDto = {}) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.createFilter(dto)

		const posts = await this.prisma.post.findMany({
			where: filters,
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: postReturnObject
		})

		return {
			posts,
			length: await this.prisma.post.count({
				where: filters
			})
		}
	}

	async getPopular(limit: number) {
		const posts = await this.prisma.post.findMany({
			select: {
				id: true,
				name: true,
				slug: true,
				poster: true,
				author: true,
				views: true,
				createdAt: true,
				categoryId: true
			},
			orderBy: {
				views: 'desc'
			},
			take: limit
		})

		return posts
	}

	async byId(id: number) {
		const post = await this.prisma.post.findUnique({
			where: {
				id
			},
			select: postReturnObject
		})

		if (!post) throw new NotFoundException('Post not found')

		return post
	}

	async bySlug(slug: string) {
		const post = await this.prisma.post.findUnique({
			where: {
				slug
			},
			select: postReturnObject
		})

		if (!post) throw new NotFoundException('Post not found')

		return post
	}

	async create() {
		const post = await this.prisma.post.create({
			data: {
				name: '',
				slug: '',
				poster: '',
				author: '',
				categoryId: null
			}
		})

		return post.id
	}

	async update(id: number, dto: PostDto) {
		const { name, author, poster, categoryId } = dto
		return this.prisma.post.update({
			where: {
				id
			},
			data: {
				name,
				slug: slugify(dto.name, {
					lower: true
				}),
				author,
				poster,
				category: {
					connect: {
						id: categoryId
					}
				}
			}
		})
	}

	async delete(id: number) {
		return this.prisma.post.delete({
			where: {
				id
			}
		})
	}

	private getSortOption(
		sort: EnumPostSort
	): Prisma.PostOrderByWithRelationInput[] {
		switch (sort) {
			case EnumPostSort.POPULAR:
				return [{ views: 'desc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}

	private createFilter(dto: GetAllPostDto): Prisma.PostWhereInput {
		const filters: Prisma.PostWhereInput[] = []

		if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))

		if (dto.category)
			filters.push(this.getCategoryFilter(dto.category.split('|')))

		return filters.length ? { AND: filters } : {}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.PostWhereInput {
		return {
			OR: [
				{
					category: {
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				},
				{
					name: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				}
			]
		}
	}

	private getCategoryFilter(category: string[]): Prisma.PostWhereInput {
		return {
			category: {
				slug: {
					in: category
				}
			}
		}
	}
}
