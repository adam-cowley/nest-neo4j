import { Module, DynamicModule, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Neo4jService } from './neo4j.service';
import { Neo4jConfig } from './interfaces/neo4j-config.interface';
import { NEO4J_OPTIONS, NEO4J_DRIVER } from './neo4j.constants';
import { createDriver } from './neo4j.utils';
import { Neo4jTransactionInterceptor } from './interceptors/neo4j-transaction.interceptor';
import { Neo4jTypeInterceptor } from './interceptors/neo4j-type.interceptor';

@Module({})
export class Neo4jModule {

    static forRoot(config: Neo4jConfig): DynamicModule {
        return {
            module: Neo4jModule,
            global: true,
            providers: [
                {
                    provide: NEO4J_OPTIONS,
                    useValue: config,
                },
                {
                    provide: NEO4J_DRIVER,
                    inject: [ NEO4J_OPTIONS ],
                    useFactory: async (config: Neo4jConfig) => createDriver(config),
                },
                Neo4jService,
            ],
            exports: [
                Neo4jService,
                Neo4jTransactionInterceptor,
                Neo4jTypeInterceptor,
            ]
        }
    }

    static forRootAsync(configProvider: any): DynamicModule {
        return {
            module: Neo4jModule,
            global: true,
            imports: [ ConfigModule ],

            providers: [
                {
                    provide: NEO4J_OPTIONS,
                    ...configProvider
                } as Provider<any>,
                {
                    provide: NEO4J_DRIVER,
                    inject: [ NEO4J_OPTIONS ],
                    useFactory: async (config: Neo4jConfig) => createDriver(config),
                },
                Neo4jService,
            ],
            exports: [
                Neo4jService,
                Neo4jTransactionInterceptor,
                Neo4jTypeInterceptor,
            ]
        }
    }

}
