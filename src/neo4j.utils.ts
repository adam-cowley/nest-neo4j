import neo4j from 'neo4j-driver'
import { Neo4jConnection } from './interfaces/neo4j-connection.interface'

export const createDriver = async (connection: Neo4jConnection) => {
    const driver = neo4j.driver(
        `${connection.scheme}://${connection.host}:${connection.port}`,
        neo4j.auth.basic(connection.username, connection.password),
        connection.config
    )

    await driver.verifyConnectivity()

    return driver
}

export const isTruthy = (value: unknown): value is true => {
    if ( typeof value === 'boolean' ) {
        return value
    }

    if ( typeof value === 'string' && value === 'true') {
        return true
    }

    return false
}

export const coerceNumber = (value: string | undefined): number | undefined => {
    if ( value !== undefined ) {
        const coerced = parseInt(value)

        return Number.isNaN(coerced) ? undefined : coerced
    }

    return undefined
}
