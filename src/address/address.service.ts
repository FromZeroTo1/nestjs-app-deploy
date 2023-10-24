import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { AddressDto } from './dto/address.dto'
import { returnAddressObject } from './object/return-address.object'

@Injectable()
export class AddressService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.address.findMany({
			select: returnAddressObject
		})
	}

	async byId(id: number) {
		const address = await this.prisma.address.findUnique({
			where: {
				id
			},
			select: returnAddressObject
		})

		if (!address) throw new NotFoundException('Address not found')

		return address
	}

	async create(userId: number, dto: AddressDto) {
		return this.prisma.address.create({
			data: {
				city: dto.city,
				street: dto.street,
				house: dto.house,
				houseBody: dto.houseBody,
				apartment: dto.apartment,
				information: dto.information
			}
		})
	}

	async update(id: number, dto: AddressDto) {
		return this.prisma.address.update({
			where: {
				id
			},
			data: {
				city: dto.city,
				street: dto.street,
				house: dto.house,
				houseBody: dto.houseBody,
				apartment: dto.apartment,
				information: dto.information
			}
		})
	}

	async delete(id: number) {
		return this.prisma.address.delete({
			where: {
				id
			}
		})
	}
}
