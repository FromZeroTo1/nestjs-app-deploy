import { Prisma } from '@prisma/client'

export const returnAddressObject: Prisma.AddressSelect = {
	id: true,
	city: true,
	street: true,
	house: true,
	houseBody: true,
	apartment: true,
	information: true
}
