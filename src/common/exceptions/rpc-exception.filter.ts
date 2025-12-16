import { Catch, ArgumentsHost, ExceptionFilter, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcCustomExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const rpcError = exception.getError();

    // Log the error in a detailed format
    if (typeof rpcError === 'object' && rpcError !== null) {
      this.logger.error(
        'Error RPC capturado:',
        JSON.stringify(rpcError, null, 2),
      );
    } else {
      this.logger.error('Error RPC capturado:', rpcError);
    }

    if (
      typeof rpcError === 'object' &&
      rpcError !== null &&
      'statusCode' in rpcError &&
      'message' in rpcError
    ) {
      const errorObj = rpcError as { statusCode: number; message: string };
      const status = isNaN(+errorObj.statusCode) ? 400 : +errorObj.statusCode;
      return response.status(status).json({
        status: errorObj.statusCode,
        message: errorObj.message,
      });
    }

    response.status(400).json({
      status: 400,
      message: rpcError,
    });
  }
}
