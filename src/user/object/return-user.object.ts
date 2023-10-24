import { Prisma } from '@prisma/client'

export const returnUserObject:Prisma.UserSelect = {
	id: true,
	email: true,
	password: false,
	name: true,
	avatarPath: true,
	bornAt: true,
	phone: true,
	cards: true,
	addresses: true,
	promocodes: true,
	smsNotification: true,
	emailNotification: true,
	createdAt: true,
}