import { Global, Module, OnApplicationShutdown, DynamicModule } from '@nestjs/common'

import { Neo4jConfig } from './interfaces/neo4j-config.interface';
import { Neo4jService } from './neo4j.service';
import { NEO4J_OPTIONS, NEO4J_DRIVER } from './neo4j.constants'
import { createDriver } from './neo4j.utils';


const createConnection = () => {
    NEO4J_DRIVER
}

@Global()
@Module({})
export class Neo4jModule {

    static forRoot(config: object): DynamicModule {
        return {
            module: Neo4jModule,
            providers: [
                {
                    provide: NEO4J_OPTIONS,
                    useValue: config,
                },
                {
                    provide: NEO4J_DRIVER,
                    inject: ['NEO4J_OPTIONS'],
                    useFactory: async (config: Neo4jConfig) => createDriver(config),
                },
                Neo4jService,
            ],
            exports: [
                Neo4jService,
            ]
        }
    }

}