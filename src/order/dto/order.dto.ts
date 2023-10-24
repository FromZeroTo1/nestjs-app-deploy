import { EnumOrderStatus } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'

export class OrderDto {
  @IsOptional()
  @IsEnum(EnumOrderStatus)
  status: EnumOrderStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class OrderItemDto {
  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  dimension?: string;

  @IsString()
  estimatedDate: string;

  @IsNumber()
  productId: number;
}
