import { Injectable } from '@nestjs/common'
import { EnumOrderStatus, Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { productReturnObject } from 'src/product/object/return-product.object'
import * as YooKassa from 'yookassa'
import { OrderDto } from './dto/order.dto'
import { PaymentStatusDto } from './dto/payment-status.dto'

const yooKassa = new YooKassa({
	shopId: process.env['SHOP_ID'],
	secretKey: process.env['PAYMENT_TOKEN']
})

@Injectable()
export class OrderService {
	constructor(private prisma: PrismaService) {}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				OR: [
					{
						total: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					},
					{
						status: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					},
					{
						createdAt: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				]
			}
		}

		return this.prisma.order.findMany({
			where: options,
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				items: {
					include: {
						product: {
							select: productReturnObject
						}
					}
				}
			}
		})
	}

	async getByUserId(userId: number) {
		return this.prisma.order.findMany({
			where: {
				userId
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				items: {
					include: {
						product: {
							select: productReturnObject
						}
					}
				}
			}
		})
	}

	async getActive(userId: number) {
		return this.prisma.order.findMany({
			where: {
				userId,
				status: 'DELIVERED'
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				items: {
					include: {
						product: {
							select: productReturnObject
						}
					}
				}
			}
		})
	}

	async placeOrder(dto: OrderDto, userId: number) {
		const total = dto.items.reduce((acc, item) => {
			return acc + item.price * item.quantity
		}, 0)

		const order = await this.prisma.order.create({
			data: {
				status: dto.status,
				items: {
					create: dto.items.map(orderItem => ({
						quantity: orderItem.quantity,
						price: orderItem.price,
						color: orderItem.color || null,
						dimension: orderItem.dimension || null,
						estimatedDate: orderItem.estimatedDate,
						product: {
							connect: { id: orderItem.productId }
						}
					})) as Prisma.OrderItemCreateWithoutOrderInput[]
				},
				total,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})

		const payment = await yooKassa.createPayment({
			amount: {
				value: total.toFixed(2),
				currency: 'RUB'
			},
			payment_method_data: {
				type: 'bank_card'
			},
			confirmation: {
				type: 'redirect',
				return_url: 'http://localhost:3000/thanks'
			},
			description: `Order #${order.id}`
		})

		return payment
	}

	async updateStatus(dto: PaymentStatusDto) {
		if (dto.event === 'payment.waiting_for_capture') {
			const payment = await yooKassa.capturePayment(dto.object.id)
			return payment
		}

		if (dto.event === 'payment.succeeded') {
			const orderId = Number(dto.object.description.split('#'[1]))

			await this.prisma.order.update({
				where: {
					id: orderId
				},
				data: {
					status: EnumOrderStatus.PAYED
				}
			})

			return true
		}

		return true
	}

	async delete(id: number) {
		return this.prisma.order.delete({
			where: {
				id
			}
		})
	}
}
