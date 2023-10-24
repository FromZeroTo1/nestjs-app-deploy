import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class StatisticsService {
	constructor(private prisma: PrismaService){}

	async getMainStatistics() {
		const usersCount = await this.prisma.user.count()
		const ordersCount = await this.prisma.order.count()

		const totalAmount = await this.prisma.order.aggregate({
			_sum: {
				total: true
			}
		})

		return [
			{
				name: 'Пользователи',
				value: usersCount
			},
			{
				name: 'Заказы',
				value: ordersCount
			},
			{
				name: 'Общая сумма заказов',
				value: totalAmount._sum.total || 0
			}
		]
	}
}
