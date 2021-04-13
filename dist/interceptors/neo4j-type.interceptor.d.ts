import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class Neo4jTypeInterceptor implements NestInterceptor {
    private showLabelsOrType;
    private showIdentity;
    constructor();
    setOptions(showLabelsOrType?: boolean, showIdentity?: boolean): this;
    static withOptions(showLabelsOrType?: boolean, showIdentity?: boolean): NestInterceptor;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
