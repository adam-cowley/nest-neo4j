import { OnApplicationShutdown } from '@nestjs/common';
import { Driver, Result, Transaction } from 'neo4j-driver';
import { Neo4jConfig } from './interfaces/neo4j-config.interface';
export declare class Neo4jService implements OnApplicationShutdown {
    private readonly driver;
    private readonly config;
    constructor(config: Neo4jConfig, driver: Driver);
    getDriver(): Driver;
    getConfig(): Neo4jConfig;
    int(value: number): import("neo4j-driver/types/integer").default;
    beginTransaction(database?: string): Transaction;
    getReadSession(database?: string): import("neo4j-driver/types/session").default;
    getWriteSession(database?: string): import("neo4j-driver/types/session").default;
    read(cypher: string, params?: Record<string, any>, databaseOrTransaction?: string | Transaction): Promise<Result>;
    write(cypher: string, params?: Record<string, any>, databaseOrTransaction?: string | Transaction): Promise<Result>;
    onApplicationShutdown(): Promise<void>;
}
