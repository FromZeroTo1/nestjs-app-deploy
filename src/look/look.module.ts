import { Module } from '@nestjs/common'
import { LookController } from './look.controller'
import { LookService } from './look.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'

@Module({
	controllers: [LookController],
	providers: [LookService, PrismaService, PaginationService]
})
export class LookModule {}
