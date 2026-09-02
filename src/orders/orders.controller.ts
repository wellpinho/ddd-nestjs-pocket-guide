import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { DomainErrorFilter } from './presentation/http/domain-error.filter';
import {
  CancelOrderUseCase,
  CreateOrderUseCase,
  FindOrderByIdUseCase,
  FindOrdersUseCase,
  PayOrderUseCase,
} from './application/use-cases';

@Controller('orders')
@UseFilters(DomainErrorFilter)
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
