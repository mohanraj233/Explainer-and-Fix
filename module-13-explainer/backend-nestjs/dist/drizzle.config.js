"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
const dotenv = require("dotenv");
dotenv.config();
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: './src/database/schema.ts',
    out: './src/database/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL || 'postgresql://neondb_owner:password@ep-dummy.neon.tech/vibeprooflens?sslmode=require',
    },
});
//# sourceMappingURL=drizzle.config.js.map