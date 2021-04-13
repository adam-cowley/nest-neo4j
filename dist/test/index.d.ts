export declare const nodeId: () => import("neo4j-driver/types/integer").default;
export declare const mockNode: (labels: string | string[], properties?: object) => any;
export declare const mockRelationship: (type: string, properties: object, start?: any, end?: any) => any;
export declare const mockResult: (rows: object[]) => any;
