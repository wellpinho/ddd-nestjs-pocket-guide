import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { CreateOrderUseCase } from './application/use-cases/create-order';
import { FindOrdersUseCase } from './application/use-cases/find-orders';
import { FindOrderByIdUseCase } from './application/use-cases/find-order-by-id';
import { PayOrderUseCase } from './application/use-cases/pay-order';
import { CancelOrderUseCase } from './application/use-cases/cancel-order';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly findOrdersUseCase: FindOrdersUseCase,
    private readonly findOrderByIdUseCase: FindOrderByIdUseCase,
    private readonly payOrderUseCase: PayOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.createOrderUseCase.execute(body);
  }

  @Get()
  findAll() {
    return this.findOrdersUseCase.execute();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.findOrderByIdUseCase.execute(id);
  }

  @Patch(':id/pay')
  pay(@Param('id') id: string) {
    return this.payOrderUseCase.execute(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.cancelOrderUseCase.execute(id);
  }
}
