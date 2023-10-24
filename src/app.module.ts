import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AddressModule } from './address/address.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CardModule } from './card/card.module'
import { CategoryModule } from './category/category.module'
import { FileModule } from './file/file.module'
import { OrderModule } from './order/order.module'
import { PaginationModule } from './pagination/pagination.module'
import { PrismaService } from './prisma.service'
import { ProductModule } from './product/product.module'
import { StatisticsModule } from './statistics/statistics.module'
import { UserModule } from './user/user.module'
import { LookModule } from './look/look.module';
import { PostModule } from './post/post.module';
import { PostCategoryModule } from './post-category/post-category.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		ProductModule,
		CategoryModule,
		OrderModule,
		PaginationModule,
		StatisticsModule,
		CardModule,
		AddressModule,
		FileModule,
		LookModule,
		PostModule,
		PostCategoryModule
	],
	controllers: [AppController],
	providers: [AppService, PrismaService]
})
export class AppModule {}
