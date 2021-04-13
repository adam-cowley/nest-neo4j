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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neo4jTransactionInterceptor = void 0;
const common_1 = require("@nestjs/common");
const neo4j_service_1 = require("../neo4j.service");
const operators_1 = require("rxjs/operators");
let Neo4jTransactionInterceptor = class Neo4jTransactionInterceptor {
    constructor(neo4jService) {
        this.neo4jService = neo4jService;
    }
    intercept(context, next) {
        const transaction = this.neo4jService.beginTransaction();
        context.switchToHttp().getRequest().transaction = transaction;
        return next.handle().pipe(operators_1.tap(() => {
            transaction.commit();
        }), operators_1.catchError(e => {
            transaction.rollback();
            throw e;
        }));
    }
};
Neo4jTransactionInterceptor = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [neo4j_service_1.Neo4jService])
], Neo4jTransactionInterceptor);
exports.Neo4jTransactionInterceptor = Neo4jTransactionInterceptor;
