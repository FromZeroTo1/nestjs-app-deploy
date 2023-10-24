import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { NotificationDto, UserDto } from './dto/user.dto'
import { returnUserObject } from './object/return-user.object'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				OR: [
					{
						email: {
							contains: searchTerm,
							mode: "insensitive"
						}
					},
					{
						name: {
							contains: searchTerm,
							mode: "insensitive"
						}
					}
				]
			}
		}

		const users = await this.prisma.user.findMany({
			where: options,
			orderBy: {
				createdAt: 'desc'
			},
			select: returnUserObject,
		})

		return users
	}

	async byId(id: number, selectObject: Prisma.UserSelect = {}) {
		const user = await this.prisma.user.findUnique({
			where: {
				id
			},
			select: {
				...returnUserObject,
				favorites: {
					select: {
						id: true,
						name: true,
						slug: true,
						description: true,
						salePrice: true,
						price: true,
						boughtTimes: true,
						views: true,
						images: true,
						colors: true,
						dimensions: true,
						category: {
							select: {
								slug: true,
								childrens: true
							}
						}
					}
				},
				...selectObject
			}
		})

		if (!user) throw new NotFoundException('User not found')

		return user
	}

	async updateProfile(id: number, dto: UserDto) {
		const isSameUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})

		if (isSameUser && id !== isSameUser.id)
			throw new BadRequestException('Email already in use')

		const user = await this.byId(id)

		return this.prisma.user.update({
			where: {
				id
			},
			data: {
				email: dto.email,
				password: dto.password ? await hash(dto.password) : user.password,
				name: dto.name,
				avatarPath: dto.avatarPath,
				bornAt: dto.bornAt,
				phone: dto.phone,
				addresses: {
					updateMany: dto.addresses?.map(address => ({
						where: { id: address.id },
						data: {
							city: address.city,
							street: address.street,
							house: address.house,
							houseBody: address.houseBody,
							apartment: address.apartment,
							information: address.information
						}
					}))
				},
				cards: {
					updateMany: dto.cards?.map(card => ({
						where: { id: card.id },
						data: {
							bankName: card.bankName,
							cardNumber: card.cardNumber,
							expirationDate: card.expirationDate,
							holderName: card.holderName,
							cvv: card.cvv
						}
					}))
				},
				smsNotification: dto.smsNotification,
				emailNotification: dto.emailNotification
			}
		})
	}

	async toggleFavorite(userId: number, productId: number) {
		const user = await this.byId(userId)

		if (!user) throw new NotFoundException('User not found')

		const isExists = user.favorites.some(product => product.id === productId)

		await this.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				favorites: {
					[isExists ? 'disconnect' : 'connect']: {
						id: productId
					}
				}
			}
		})

		return { message: 'Success' }
	}

	async toggleNotification(userId: number, dto: NotificationDto) {
		const user = await this.byId(userId)

		if (!user) throw new NotFoundException('User not found')

		await this.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				smsNotification: dto.smsNotification,
				emailNotification: dto.emailNotification
			}
		})

		return { message: 'Success' }
	}

	async delete(id: number) {
		return this.prisma.user.delete({
			where: {
				id
			}
		})
	}
}
