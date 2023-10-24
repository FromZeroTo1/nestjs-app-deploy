import { faker } from '@faker-js/faker'
import { PrismaClient, Product } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

const createProducts = async (quantity: number) => {
	const products: Product[] = []
	const existingCategories = await prisma.category.findMany()

	for (let i = 0; i < quantity; i++) {
		const productName = faker.commerce.productName()
		const categoryName = faker.commerce.department()

		const product = await prisma.product.create({
			data: {
				name: productName,
				slug: faker.helpers.slugify(productName).toLowerCase(),
				description: faker.commerce.productDescription(),
				salePrice: +faker.commerce.price({ min: 600, max: 1000, dec: 0 }),
				price: +faker.commerce.price({ min: 1200, max: 1800, dec: 0 }),
				sku: 'AA-BB-VF-HG',
				quantity: faker.number.int({ min: 0, max: 99 }),
				boughtTimes: 7,
				colors: {
					create: Array.from({
						length: faker.number.int({ min: 0, max: 5 })
					}).map(() => ({
						name: faker.color.human(),
						hex: faker.color.rgb(),
						images: Array.from({
							length: faker.number.int({ min: 1, max: 4 })
						}).map(
							() =>
								`http://localhost:4200/uploads/images/${faker.number.int({
									min: 1,
									max: 8
								})}.png`
						),
						left: faker.number.int({ min: 0, max: 10 })
					}))
				},
				dimensions: {
					create: Array.from({
						length: faker.number.int({ min: 0, max: 5 })
					}).map(() => ({
						dimension: `${faker.helpers.arrayElements(
							['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
							1
						)}`,
						images: Array.from({
							length: faker.number.int({ min: 1, max: 4 })
						}).map(
							() =>
								`http://localhost:4200/uploads/images/${faker.number.int({
									min: 1,
									max: 8
								})}.png`
						),
						left: faker.number.int({ min: 0, max: 10 })
					}))
				},
				characteristics: {
					create: {
						material: `${faker.helpers.arrayElements(
							['Хлопок', 'Полиэстер', 'Лён', 'Вельвет'],
							1
						)}`,
						season: `${faker.helpers.arrayElements(
							['Весна', 'Лето', 'Весна', 'Зима', 'Длинный', 'Китай'],
							1
						)}`,
						color: faker.color.rgb(),
						style: `${faker.helpers.arrayElements(
							['Спортивный', 'Классический'],
							1
						)}`,
						sleeve: `${faker.helpers.arrayElements(
							['Короткий', 'Длинный'],
							1
						)}`,
						country: `${faker.helpers.arrayElements(
							['Италия', 'США', 'Турция', 'Китай'],
							1
						)}`
					}
				},
				images: Array.from({
					length: faker.number.int({ min: 1, max: 4 })
				}).map(
					() =>
						`http://localhost:4200/uploads/images/${faker.number.int({
							min: 1,
							max: 8
						})}.png`
				),
				tags: Array.from({ length: faker.number.int({ min: 8, max: 15 }) }).map(
					() => faker.commerce.productAdjective()
				),
				category: {
					create: {
						name: categoryName,
						slug: faker.helpers.slugify(categoryName).toLowerCase(),
						parentId:
							existingCategories[
								faker.number.int({ min: 0, max: existingCategories.length - 1 })
							].id
					}
				}
			}
		})

		products.push(product)
	}

	console.log(`Created ${products.length} products`)
}

async function main() {
	console.log('Start seeding ...')
	await createProducts(10)
}

main()
	.catch(e => console.error(e))
	.finally(async () => {
		await prisma.$disconnect()
	})
