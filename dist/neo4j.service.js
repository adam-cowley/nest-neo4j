"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neo4jService = void 0;
const common_1 = require("@nestjs/common");
const neo4j_driver_1 = __importStar(require("neo4j-driver"));
const neo4j_constants_1 = require("./neo4j.constants");
const transaction_1 = __importDefault(require("neo4j-driver/lib/transaction"));
let Neo4jService = class Neo4jService {
    constructor(config, driver) {
        this.driver = driver;
        this.config = config;
    }
    getDriver() {
        return this.driver;
    }
    getConfig() {
        return this.config;
    }
    int(value) {
        return neo4j_driver_1.int(value);
    }
    beginTransaction(database) {
        const session = this.getWriteSession(database);
        return session.beginTransaction();
    }
    getReadSession(database) {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: neo4j_driver_1.default.session.READ,
        });
    }
    getWriteSession(database) {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: neo4j_driver_1.default.session.WRITE,
        });
    }
    read(cypher, params, databaseOrTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (databaseOrTransaction instanceof transaction_1.default) {
                return databaseOrTransaction.run(cypher, params);
            }
            const session = this.getReadSession(databaseOrTransaction);
            const result = yield session.run(cypher, params);
            session.close();
            return result;
        });
    }
    write(cypher, params, databaseOrTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (databaseOrTransaction instanceof transaction_1.default) {
                return databaseOrTransaction.run(cypher, params);
            }
            const session = this.getWriteSession(databaseOrTransaction);
            const result = yield session.run(cypher, params);
            session.close();
            return result;
        });
    }
    onApplicationShutdown() {
        return this.driver.close();
    }
};
Neo4jService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(neo4j_constants_1.NEO4J_OPTIONS)),
    __param(1, common_1.Inject(neo4j_constants_1.NEO4J_DRIVER)),
    __metadata("design:paramtypes", [Object, Object])
], Neo4jService);
exports.Neo4jService = Neo4jService;
