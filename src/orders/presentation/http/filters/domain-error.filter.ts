import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  DomainError,
  OrderNotFoundError,
  PaymentFailedError,
} from '../../../domain/errors';

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;
    if (exception instanceof OrderNotFoundError) status = HttpStatus.NOT_FOUND;
    if (exception instanceof PaymentFailedError) status = HttpStatus.BAD_GATEWAY;

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
    });
  }
}
