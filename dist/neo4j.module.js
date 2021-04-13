"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Neo4jModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neo4jModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const neo4j_service_1 = require("./neo4j.service");
const neo4j_constants_1 = require("./neo4j.constants");
const neo4j_utils_1 = require("./neo4j.utils");
let Neo4jModule = Neo4jModule_1 = class Neo4jModule {
    static forRoot(config) {
        return {
            module: Neo4jModule_1,
            global: true,
            providers: [
                {
                    provide: neo4j_constants_1.NEO4J_OPTIONS,
                    useValue: config,
                },
                {
                    provide: neo4j_constants_1.NEO4J_DRIVER,
                    inject: [neo4j_constants_1.NEO4J_OPTIONS],
                    useFactory: (config) => __awaiter(this, void 0, void 0, function* () { return neo4j_utils_1.createDriver(config); }),
                },
                neo4j_service_1.Neo4jService,
            ],
            exports: [neo4j_service_1.Neo4jService],
        };
    }
    static forRootAsync(configProvider) {
        return {
            module: Neo4jModule_1,
            global: true,
            imports: [config_1.ConfigModule],
            providers: [
                Object.assign({ provide: neo4j_constants_1.NEO4J_OPTIONS }, configProvider),
                {
                    provide: neo4j_constants_1.NEO4J_DRIVER,
                    inject: [neo4j_constants_1.NEO4J_OPTIONS],
                    useFactory: (config) => __awaiter(this, void 0, void 0, function* () { return neo4j_utils_1.createDriver(config); }),
                },
                neo4j_service_1.Neo4jService,
            ],
            exports: [neo4j_service_1.Neo4jService],
        };
    }
    static fromEnv() {
        return {
            module: Neo4jModule_1,
            global: true,
            imports: [config_1.ConfigModule],
            providers: [
                {
                    provide: neo4j_constants_1.NEO4J_OPTIONS,
                    inject: [config_1.ConfigService],
                    useFactory: (configService) => ({
                        scheme: configService.get('NEO4J_SCHEME'),
                        host: configService.get('NEO4J_HOST'),
                        port: configService.get('NEO4J_PORT'),
                        username: configService.get('NEO4J_USERNAME'),
                        password: configService.get('NEO4J_PASSWORD'),
                        database: configService.get('NEO4J_DATABASE'),
                    }),
                },
                {
                    provide: neo4j_constants_1.NEO4J_DRIVER,
                    inject: [neo4j_constants_1.NEO4J_OPTIONS],
                    useFactory: (config) => __awaiter(this, void 0, void 0, function* () { return neo4j_utils_1.createDriver(config); }),
                },
                neo4j_service_1.Neo4jService,
            ],
            exports: [neo4j_service_1.Neo4jService],
        };
    }
};
Neo4jModule = Neo4jModule_1 = __decorate([
    common_1.Module({})
], Neo4jModule);
exports.Neo4jModule = Neo4jModule;
