import { Module, DynamicModule, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jService } from './neo4j.service';
import { Neo4jConnection } from './interfaces/neo4j-connection.interface';
import { NEO4J_OPTIONS, NEO4J_DRIVER } from './neo4j.constants';
import { coerceNumber, createDriver, isTruthy } from './neo4j.utils';

@Module({})
export class Neo4jModule {

    static forRoot(connection: Neo4jConnection): DynamicModule {
        return {
            module: Neo4jModule,
            global: true,
            providers: [
                {
                    provide: NEO4J_OPTIONS,
                    useValue: connection,
                },
                {
                    provide: NEO4J_DRIVER,
                    inject: [ NEO4J_OPTIONS ],
                    useFactory: async (connection: Neo4jConnection) => createDriver(connection),
                },
                Neo4jService,
            ],
            exports: [
                Neo4jService,
            ]
        }
    }

    static forRootAsync(configProvider: any): DynamicModule {
        return {
            module: Neo4jModule,
            global: true,
            imports: [
                ConfigModule,
            ],

            providers: [
                {
                    provide: NEO4J_OPTIONS,
                    ...configProvider
                } as Provider<any>,
                {
                    provide: NEO4J_DRIVER,
                    inject: [ NEO4J_OPTIONS ],
                    useFactory: async (connection: Neo4jConnection) => createDriver(connection),
                },
                Neo4jService,
            ],
            exports: [
                Neo4jService,
            ]
        }
    }

    static fromEnv(): DynamicModule {
        return {
            module: Neo4jModule,
            global: true,
            imports: [
                ConfigModule,
            ],
            providers: [
                {
                    provide: NEO4J_OPTIONS,
                    inject: [ ConfigService ],
                    useFactory: (configService: ConfigService) : Neo4jConnection => ({
                        scheme: configService.get('NEO4J_SCHEME'),
                        host: configService.get('NEO4J_HOST'),
                        port: configService.get('NEO4J_PORT'),
                        username: configService.get('NEO4J_USERNAME'),
                        password: configService.get('NEO4J_PASSWORD'),
                        database: configService.get('NEO4J_DATABASE'),
                        config: {
                            encrypted: configService.get('NEO4J_ENCRYPTION_LEVEL'),
                            trust: configService.get('NEO4J_TRUST_STRATEGY'),
                            trustedCertificates: configService.get('NEO4J_TRUSTED_CERTIFICATES')?.split(',').map(cert => cert.trim()),
                            knownHosts: configService.get('NEO4J_KNOWN_HOSTS'),
                            fetchSize: coerceNumber(configService.get('NEO4J_FETCH_SIZE')),
                            maxConnectionPoolSize: coerceNumber(configService.get('NEO4J_MAXIMUM_POOL_SIZE')),
                            maxTransactionRetryTime: coerceNumber(configService.get('NEO4J_TRANSACTION_RETRY_TIME')),
                            maxConnectionLifetime: coerceNumber(configService.get('NEO4J_MAX_CONNECTION_LIFETIME')),
                            connectionAcquisitionTimeout: coerceNumber(configService.get('NEO4J_CONNECTION_ACQUISITION_TIMEOUT')),
                            connectionTimeout: coerceNumber(configService.get('NEO4J_CONNECTION_TIMEOUT')),
                            disableLosslessIntegers: isTruthy(configService.get('NEO4J_DISABLE_LOSSLESS_INTEGERS')),
                            useBigInt: isTruthy(configService.get('NEO4J_USE_BIG_INT')),
                            userAgent: configService.get('NEO4J_USER_AGENT'),
                        }
                    })
                } as Provider<any>,
                {
                    provide: NEO4J_DRIVER,
                    inject: [ NEO4J_OPTIONS ],
                    useFactory: async (connection: Neo4jConnection) => createDriver(connection),
                },
                Neo4jService,
            ],
            exports: [
                Neo4jService,
            ]
        }
    }
}
