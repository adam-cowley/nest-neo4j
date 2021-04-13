"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neo4jErrorFilter = void 0;
const common_1 = require("@nestjs/common");
const neo4j_driver_1 = require("neo4j-driver");
let Neo4jErrorFilter = class Neo4jErrorFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let statusCode = 500;
        let error = 'Internal Server Error';
        let message = [];
        if (exception.message.includes('already exists with')) {
            statusCode = 400;
            error = 'Bad Request';
            const [_, property] = exception.message.match(/`([a-z0-9]+)`/gi);
            message = [`${property.replace(/`/g, '')} already taken`];
        }
        else if (exception.message.includes('must have the property')) {
            statusCode = 400;
            error = 'Bad Request';
            const [_, property] = exception.message.match(/`([a-z0-9]+)`/gi);
            message = [`${property.replace(/`/g, '')} should not be empty`];
        }
        response.status(statusCode).json({
            statusCode,
            message,
            error,
        });
    }
};
Neo4jErrorFilter = __decorate([
    common_1.Catch(neo4j_driver_1.Neo4jError)
], Neo4jErrorFilter);
exports.Neo4jErrorFilter = Neo4jErrorFilter;
