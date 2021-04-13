import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { Neo4jError } from 'neo4j-driver';

@Catch(Neo4jError)
export class Neo4jErrorFilter implements ExceptionFilter {
  catch(exception: Neo4jError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = 500;
    let error = 'Internal Server Error';
    let message: string[] = [];

    // Neo.ClientError.Schema.ConstraintValidationFailed
    // Node(54776) already exists with label `User` and property `email` = 'duplicate@email.com'
    if (exception.message.includes('already exists with')) {
      statusCode = 400;
      error = 'Bad Request';

      const [_, property] = exception.message.match(/`([a-z0-9]+)`/gi);
      message = [`${property.replace(/`/g, '')} already taken`];
    }
    // Neo.ClientError.Schema.ConstraintValidationFailed
    // Node(54778) with label `Test` must have the property `mustExist`
    else if (exception.message.includes('must have the property')) {
      statusCode = 400;
      error = 'Bad Request';

      const [_, property] = exception.message.match(/`([a-z0-9]+)`/gi);
      message = [`${property.replace(/`/g, '')} should not be empty`];
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error,
    });
  }
}
