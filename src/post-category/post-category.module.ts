import { Module } from '@nestjs/common'
import { PostCategoryController } from './post-category.controller'
import { PostCategoryService } from './post-category.service'
import { PrismaService } from 'src/prisma.service'

@Module({
	controllers: [PostCategoryController],
	providers: [PostCategoryService, PrismaService]
})
export class PostCategoryModule {}
