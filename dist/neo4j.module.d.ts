import { DynamicModule } from '@nestjs/common';
import { Neo4jConfig } from './interfaces/neo4j-config.interface';
export declare class Neo4jModule {
    static forRoot(config: Neo4jConfig): DynamicModule;
    static forRootAsync(configProvider: any): DynamicModule;
    static fromEnv(): DynamicModule;
}
