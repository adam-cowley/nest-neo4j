import { Neo4jConfig } from './interfaces/neo4j-config.interface';
export declare const createDriver: (config: Neo4jConfig) => Promise<import("neo4j-driver/types/driver").Driver>;
