"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockResult = exports.mockRelationship = exports.mockNode = exports.nodeId = void 0;
const neo4j_driver_1 = require("neo4j-driver");
const graph_types_1 = require("neo4j-driver/lib/graph-types");
let _nodeId = 0;
let _relationshipId = 0;
exports.nodeId = () => {
    _nodeId++;
    return neo4j_driver_1.int(_nodeId);
};
exports.mockNode = (labels, properties = {}) => {
    return new graph_types_1.Node(exports.nodeId(), Array.isArray(labels) ? labels : [labels], properties);
};
exports.mockRelationship = (type, properties, start, end) => {
    _relationshipId++;
    return new graph_types_1.Relationship(neo4j_driver_1.int(_relationshipId), start instanceof graph_types_1.Node ? start.identity : exports.nodeId(), end instanceof graph_types_1.Node ? end.identity :
        exports.nodeId(), type, properties);
};
exports.mockResult = (rows) => {
    return {
        records: rows.map(row => ({
            keys: Object.keys(row),
            get: (key) => row.hasOwnProperty(key) ? row[key] : null,
        }))
    };
};
