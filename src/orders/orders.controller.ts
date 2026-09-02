import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() body: any) {
    return this.ordersService.create(body);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Patch(':id/pay')
  pay(@Param('id') id: string) {
    return this.ordersService.pay(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.ordersService.cancel(id);
  }
}
