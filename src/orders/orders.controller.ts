import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import {
  CancelOrderUseCase,
  CreateOrderUseCase,
  FindOrderByIdUseCase,
  FindOrdersUseCase,
  PayOrderUseCase,
  ProcessOutboxUseCase,
} from './application/use-cases';
import { CreateOrderDto } from './presentation/http/dto/create-order.dto';
import { DomainErrorFilter } from './presentation/http/filters/domain-error.filter';
import { OrderPresenter } from './presentation/http/presenters/order.presenter';

@Controller('orders')
@UseFilters(DomainErrorFilter)
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly findOrdersUseCase: FindOrdersUseCase,
    private readonly findOrderByIdUseCase: FindOrderByIdUseCase,
    private readonly payOrderUseCase: PayOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly processOutboxUseCase: ProcessOutboxUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateOrderDto) {
    return OrderPresenter.toHTTP(await this.createOrderUseCase.execute(body));
  }

  @Get()
  async findAll() {
    return (await this.findOrdersUseCase.execute()).map(OrderPresenter.toHTTP);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return OrderPresenter.toHTTP(await this.findOrderByIdUseCase.execute(id));
  }

  @Patch(':id/pay')
  async pay(@Param('id') id: string) {
    return OrderPresenter.toHTTP(await this.payOrderUseCase.execute(id));
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    return OrderPresenter.toHTTP(await this.cancelOrderUseCase.execute(id));
  }

  @Post('outbox/process')
  async processOutbox() {
    return { processed: await this.processOutboxUseCase.execute() };
  }
}
