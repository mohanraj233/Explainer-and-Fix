"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const drizzle_orm_1 = require("drizzle-orm");
const pg_1 = require("pg");
const schema = require("./schema");
let DatabaseService = DatabaseService_1 = class DatabaseService {
    constructor() {
        this.logger = new common_1.Logger(DatabaseService_1.name);
        this.isConnected = false;
        this.memoryExplanations = [];
        this.memoryPatches = [];
        this.memoryRetests = [];
    }
    async onModuleInit() {
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl || databaseUrl.includes('npg_sample') || databaseUrl.includes('<neon-host>')) {
            this.logger.warn('DATABASE_URL is using a demo/sample Neon connection string. Initializing local in-memory persistence layer.');
            this.isConnected = false;
            return;
        }
        try {
            this.logger.log('Connecting to Neon PostgreSQL via Drizzle ORM...');
            const pool = new pg_1.Pool({
                connectionString: databaseUrl,
                ssl: { rejectUnauthorized: false },
            });
            this.db = (0, node_postgres_1.drizzle)(pool, { schema });
            await pool.query('SELECT 1');
            this.isConnected = true;
            this.logger.log('Successfully connected to Neon PostgreSQL database.');
        }
        catch (error) {
            this.logger.warn(`Could not connect to remote Neon PostgreSQL (${error.message}). Using resilient in-memory persistence for demo/tests.`);
            this.isConnected = false;
        }
    }
    get isDbConnected() {
        return this.isConnected;
    }
    async saveExplanation(data) {
        if (this.isConnected && this.db) {
            const [result] = await this.db.insert(schema.aiExplanations).values(data).returning();
            return result;
        }
        const item = {
            id: this.memoryExplanations.length + 1,
            createdAt: new Date(),
            ...data,
        };
        this.memoryExplanations.push(item);
        return item;
    }
    async savePatch(data) {
        if (this.isConnected && this.db) {
            const [result] = await this.db.insert(schema.aiPatches).values(data).returning();
            return result;
        }
        const item = {
            id: this.memoryPatches.length + 1,
            createdAt: new Date(),
            ...data,
        };
        this.memoryPatches.push(item);
        return item;
    }
    async saveRetest(data) {
        if (this.isConnected && this.db) {
            const [result] = await this.db.insert(schema.retests).values(data).returning();
            return result;
        }
        const item = {
            id: this.memoryRetests.length + 1,
            createdAt: new Date(),
            ...data,
        };
        this.memoryRetests.push(item);
        return item;
    }
    async getExplanationsByFindingId(findingId) {
        if (this.isConnected && this.db) {
            return this.db
                .select()
                .from(schema.aiExplanations)
                .where((0, drizzle_orm_1.eq)(schema.aiExplanations.findingId, findingId));
        }
        return this.memoryExplanations.filter((e) => e.findingId === findingId);
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = DatabaseService_1 = __decorate([
    (0, common_1.Injectable)()
], DatabaseService);
//# sourceMappingURL=database.service.js.map