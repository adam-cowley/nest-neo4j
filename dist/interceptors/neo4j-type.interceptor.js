"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Neo4jTypeInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neo4jTypeInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const neo4j_driver_1 = require("neo4j-driver");
const graph_types_1 = require("neo4j-driver/lib/graph-types");
const result_1 = __importDefault(require("neo4j-driver/lib/result"));
const toNative = (value, showLabelsOrType, showIdentity) => {
    if (value === null || value === undefined)
        return undefined;
    else if (value instanceof result_1.default || value.records) {
        return value.records.map(row => Object.fromEntries(row.keys.map(key => [key, toNative(row.get(key))])));
    }
    else if (Array.isArray(value))
        return value.map(value => toNative(value));
    else if (graph_types_1.isNode(value))
        return toNative(Object.assign({ _id: showIdentity ? toNative(value.identity) : null, _labels: showLabelsOrType ? toNative(value.labels) : null }, toNative(value.properties)));
    else if (graph_types_1.isRelationship(value))
        return toNative(Object.assign({ _id: toNative(value.identity), _type: showLabelsOrType ? toNative(value.type) : null }, toNative(value.properties)));
    else if (neo4j_driver_1.isInt(value))
        return value.toNumber();
    else if (neo4j_driver_1.isDuration(value) ||
        neo4j_driver_1.isLocalTime(value) ||
        neo4j_driver_1.isTime(value) ||
        neo4j_driver_1.isDate(value) ||
        neo4j_driver_1.isDateTime(value) ||
        neo4j_driver_1.isLocalDateTime(value)) {
        return value.toString();
    }
    if (neo4j_driver_1.isPoint(value)) {
        switch (value.srid.toNumber()) {
            case 4326:
                return { longitude: value.y, latitude: value.x };
            case 4979:
                return { longitude: value.y, latitude: value.x, height: value.z };
            default:
                return toNative({ x: value.x, y: value.y, z: value.z });
        }
    }
    else if (typeof value === 'object') {
        return Object.fromEntries(Object.keys(value).map(key => [
            key,
            toNative(value[key], showLabelsOrType, showIdentity),
        ]));
    }
    return value;
};
let Neo4jTypeInterceptor = Neo4jTypeInterceptor_1 = class Neo4jTypeInterceptor {
    constructor() {
        this.showLabelsOrType = false;
        this.showIdentity = false;
    }
    setOptions(showLabelsOrType = false, showIdentity = false) {
        this.showLabelsOrType = showLabelsOrType;
        this.showIdentity = showIdentity;
        return this;
    }
    static withOptions(showLabelsOrType = false, showIdentity = false) {
        return new Neo4jTypeInterceptor_1().setOptions(showLabelsOrType, showIdentity);
    }
    intercept(context, next) {
        return next
            .handle()
            .pipe(operators_1.map(data => toNative(data, this.showLabelsOrType, this.showIdentity)));
    }
};
Neo4jTypeInterceptor = Neo4jTypeInterceptor_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], Neo4jTypeInterceptor);
exports.Neo4jTypeInterceptor = Neo4jTypeInterceptor;
