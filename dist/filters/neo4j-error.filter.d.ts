import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Neo4jError } from 'neo4j-driver';
export declare class Neo4jErrorFilter implements ExceptionFilter {
    catch(exception: Neo4jError, host: ArgumentsHost): void;
}
