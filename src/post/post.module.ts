import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import { PostService } from './post.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'

@Module({
	controllers: [PostController],
	providers: [PostService, PrismaService, PaginationService]
})
export class PostModule {}
