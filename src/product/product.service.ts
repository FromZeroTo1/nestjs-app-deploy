import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import slugify from 'slugify'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { convertToNumber } from 'src/utils/convert-to-number'
import { EnumProductSort, GetAllProductDto } from './dto/get-all.product.dto'
import { ProductDto } from './dto/product.dto'
import {
	productReturnObject,
	productReturnObjectFullest
} from './object/return-product.object'

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: GetAllProductDto = {}) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.createFilter(dto)

		const products = await this.prisma.product.findMany({
			where: filters,
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: productReturnObject
		})

		return {
			products,
			length: await this.prisma.product.count({
				where: filters
			})
		}
	}

	async byId(id: number) {
		const product = await this.prisma.product.findUnique({
			where: {
				id
			},
			select: productReturnObjectFullest
		})

		if (!product) throw new NotFoundException('Product not found')

		return product
	}

	async bySlug(slug: string) {
		const product = await this.prisma.product.findUnique({
			where: {
				slug
			},
			select: productReturnObjectFullest
		})

		if (!product) throw new NotFoundException('Product not found')

		return product
	}

	async byCategory(categorySlug: string) {
		const products = await this.prisma.product.findMany({
			where: {
				category: {
					slug: categorySlug
				}
			},
			select: productReturnObjectFullest
		})

		if (!products) throw new NotFoundException('Products not found')

		return products
	}

	async getSimilar(id: number) {
		const currentProduct = await this.byId(id)

		if (!currentProduct)
			throw new NotFoundException('Current product not found')

		const products = await this.prisma.product.findMany({
			where: {
				NOT: {
					id: currentProduct.id
				}
			},
			orderBy: {
				createdAt: 'desc'
			},
			select: productReturnObject
		})

		return products
	}

	async create() {
		const product = await this.prisma.product.create({
			data: {
				name: '',
				slug: '',
				description: '',
				salePrice: null,
				price: 0,
				sku: '',
				quantity: 0
			}
		})

		return product.id
	}

	async update(id: number, dto: ProductDto) {
		const {
			name,
			description,
			salePrice,
			price,
			sku,
			quantity,
			tags,
			images,
			categoryId,
			lookId
		} = dto
		return this.prisma.product.update({
			where: {
				id
			},
			data: {
				name,
				slug: slugify(dto.name, {
					lower: true
				}),
				description,
				salePrice,
				price,
				sku,
				quantity,
				colors: {
					connect: dto.colors.map(color => ({ id: color.productId }))
				},
				dimensions: {
					connect: dto.dimensions.map(dimension => ({
						id: dimension.productId
					}))
				},
				characteristics: {
					connect: {
						id: dto.characteristics.productId
					}
				},
				tags,
				images,
				category: {
					connect: {
						id: categoryId
					}
				},
				look: {
					connect: {
						id: lookId
					}
				}
			}
		})
	}

	async delete(id: number) {
		return this.prisma.$transaction(async prisma => {
			await prisma.productCharacteristic.deleteMany({
				where: {
					productId: id
				}
			})

			await prisma.product.delete({
				where: {
					id
				}
			})
		})
	}

	async updateCountOpened({ slug }) {
		return this.prisma.product.update({
			where: {
				slug
			},
			data: {
				views: {
					increment: 1
				}
			}
		})
	}

	private createFilter(dto: GetAllProductDto): Prisma.ProductWhereInput {
		const filters: Prisma.ProductWhereInput[] = []

		if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))

		if (dto.dimension)
			filters.push(this.getDimensionFilter(dto.dimension.split('|')))

		if (dto.color) filters.push(this.getColorFilter(dto.color.split('|')))

		if (dto.material)
			filters.push(this.getMaterialFilter(dto.material.split('|')))

		if (dto.season) filters.push(this.getSeasonFilter(dto.season.split('|')))

		if (dto.category)
			filters.push(this.getCategoryFilter(dto.category.split('|')))

		if (dto.minPrice || dto.maxPrice)
			filters.push(
				this.getPriceFilter(
					convertToNumber(dto.minPrice),
					convertToNumber(dto.maxPrice)
				)
			)

		return filters.length ? { AND: filters } : {}
	}

	private getSortOption(
		sort: EnumProductSort
	): Prisma.ProductOrderByWithRelationInput[] {
		switch (sort) {
			case EnumProductSort.POPULAR:
				return [{ views: 'desc' }]
			case EnumProductSort.LOW_PRICE:
				return [{ price: 'asc' }]
			case EnumProductSort.HIGH_PRICE:
				return [{ price: 'desc' }]
			case EnumProductSort.BY_DISCOUNT:
				return [{ salePrice: 'desc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.ProductWhereInput {
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

	private getPriceFilter(
		minPrice?: number,
		maxPrice?: number
	): Prisma.ProductWhereInput {
		let priceFilter: Prisma.IntFilter | undefined = undefined

		if (minPrice) {
			priceFilter = {
				...priceFilter,
				gte: minPrice
			}
		}

		if (maxPrice) {
			priceFilter = {
				...priceFilter,
				lte: maxPrice
			}
		}

		return {
			price: priceFilter
		}
	}

	private getMaterialFilter(material: string[]): Prisma.ProductWhereInput {
		return {
			characteristics: {
				material: {
					in: material
				}
			}
		}
	}

	private getDimensionFilter(dimension: string[]): Prisma.ProductWhereInput {
		return {
			dimensions: {
				some: {
					dimension: {
						in: dimension
					}
				}
			}
		}
	}

	private getColorFilter(name: string[]): Prisma.ProductWhereInput {
		return {
			colors: {
				some: {
					name: {
						in: name
					}
				}
			}
		}
	}

	private getSeasonFilter(season: string[]): Prisma.ProductWhereInput {
		return {
			characteristics: {
				season: {
					in: season
				}
			}
		}
	}

	private getCategoryFilter(category: string[]): Prisma.ProductWhereInput {
		return {
			category: {
				slug: {
					in: category
				}
			}
		}
	}
}
