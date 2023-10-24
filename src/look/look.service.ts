import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import slugify from 'slugify'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { EnumLookSort, GetAllLookDto } from './dto/get-all.look.dto'
import { LookDto } from './dto/look.dto'
import { lookReturnObject } from './object/return-look.object'

@Injectable()
export class LookService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: GetAllLookDto = {}) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.createFilter(dto)

		const looks = await this.prisma.look.findMany({
			where: filters,
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: lookReturnObject
		})

		return {
			looks,
			length: await this.prisma.look.count({
				where: filters
			})
		}
	}

	async byId(id: number) {
		const look = await this.prisma.look.findUnique({
			where: {
				id
			},
			select: lookReturnObject
		})

		if (!look) throw new NotFoundException('Look not found')

		return look
	}

	async create() {
		const look = await this.prisma.look.create({
			data: {
				name: '',
				slug: '',
				images: [],
				categoryId: null
			}
		})

		return look.id
	}

	async update(id: number, dto: LookDto) {
		const { name, images, categoryId } = dto
		return this.prisma.look.update({
			where: {
				id
			},
			data: {
				name,
				slug: slugify(dto.name, {
					lower: true
				}),
				images,
				category: {
					connect: {
						id: categoryId
					}
				}
			}
		})
	}

	async delete(id: number) {
		return this.prisma.look.delete({
			where: {
				id
			}
		})
	}

	private getSortOption(
		sort: EnumLookSort
	): Prisma.LookOrderByWithRelationInput[] {
		switch (sort) {
			case EnumLookSort.POPULAR:
				return [{ views: 'desc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}

	private createFilter(dto: GetAllLookDto): Prisma.LookWhereInput {
		const filters: Prisma.LookWhereInput[] = []

		if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))

		if (dto.category)
			filters.push(this.getCategoryFilter(dto.category.split('|')))

		return filters.length ? { AND: filters } : {}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.LookWhereInput {
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

	private getCategoryFilter(category: string[]): Prisma.LookWhereInput {
		return {
			category: {
				slug: {
					in: category
				}
			}
		}
	}
}
