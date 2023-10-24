import { Prisma } from '@prisma/client'

export const returnCardObject:Prisma.CardSelect = {
	id: true,
  bankName: true,
	cardNumber: true,
  expirationDate: true,
  holderName: true,
  cvv: true,
  isDefault: true,
}