import { Injectable, Inject, OnApplicationShutdown } from '@nestjs/common';
import neo4j, { Driver, session, Result } from 'neo4j-driver'
import { Neo4jConfig } from './interfaces/neo4j-config.interface';
import { NEO4J_OPTIONS, NEO4J_DRIVER } from './neo4j.constants';

@Injectable()
export class Neo4jService implements OnApplicationShutdown  {

    private readonly driver: Driver;
    private readonly config: Neo4jConfig;

    constructor(
        @Inject(NEO4J_OPTIONS) config: Neo4jConfig,
        @Inject(NEO4J_DRIVER) driver: Driver
    ) {
        this.driver = driver
        this.config = config
    }

    async onApplicationShutdown(): Promise<void> {
        await this.driver.close()
    }

    getConfig(): Neo4jConfig {
        return this.config
    }

    getReadSession(database?: string) {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: session.READ,
        })
    }

    getWriteSession(database?: string) {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: session.WRITE,
        })
    }

    read(query: string, params?: object, database?: string): Result {
        const session = this.getReadSession(database)

        return session.run(query, params)
    }

    write(query: string, params?: object, database?: string): Result {
        const session = this.getWriteSession(database)

        return session.run(query, params)
    }


}