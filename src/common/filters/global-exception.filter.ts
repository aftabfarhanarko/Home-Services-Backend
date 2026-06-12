import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Format the message professionally
    let formattedMessage = 'An unexpected error occurred';
    
    if (typeof message === 'string') {
      formattedMessage = message;
    } else if (typeof message === 'object' && message !== null) {
      // If it's a validation error array or similar
      formattedMessage = (message as any).message || formattedMessage;
    }

    response.status(status).json({
      statusCode: status,
      message: formattedMessage,
      error: exception instanceof HttpException ? exception.name : 'InternalServerError',
    });
  }
}
