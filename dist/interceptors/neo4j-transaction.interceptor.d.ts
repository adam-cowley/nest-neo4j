import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Neo4jService } from '../neo4j.service';
import { Observable } from 'rxjs';
export declare class Neo4jTransactionInterceptor implements NestInterceptor {
    private readonly neo4jService;
    constructor(neo4jService: Neo4jService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
