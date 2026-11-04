"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retests = exports.aiMessages = exports.aiPatches = exports.aiExplanations = exports.patchStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
// Patch status enum: 'pending_approval' | 'approved' | 'rejected'
exports.patchStatusEnum = (0, pg_core_1.pgEnum)('patch_status', [
    'pending_approval',
    'approved',
    'rejected',
]);
// 1. ai_explanations table
exports.aiExplanations = (0, pg_core_1.pgTable)('ai_explanations', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    findingId: (0, pg_core_1.varchar)('finding_id', { length: 128 }).notNull(),
    provider: (0, pg_core_1.varchar)('provider', { length: 128 }).notNull(),
    promptVersion: (0, pg_core_1.varchar)('prompt_version', { length: 64 }).notNull(),
    clientExplanation: (0, pg_core_1.text)('client_explanation').notNull(),
    developerGuidance: (0, pg_core_1.text)('developer_guidance').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// 2. ai_patches table
exports.aiPatches = (0, pg_core_1.pgTable)('ai_patches', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    findingId: (0, pg_core_1.varchar)('finding_id', { length: 128 }).notNull(),
    patchDiff: (0, pg_core_1.text)('patch_diff').notNull(),
    status: (0, exports.patchStatusEnum)('status').default('pending_approval').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// 3. ai_messages table (contextual security chat history)
exports.aiMessages = (0, pg_core_1.pgTable)('ai_messages', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    findingId: (0, pg_core_1.varchar)('finding_id', { length: 128 }).notNull(),
    sender: (0, pg_core_1.varchar)('sender', { length: 64 }).notNull(), // 'user' | 'ai'
    message: (0, pg_core_1.text)('message').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// 4. retests table
exports.retests = (0, pg_core_1.pgTable)('retests', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    findingId: (0, pg_core_1.varchar)('finding_id', { length: 128 }).notNull(),
    scannerRunId: (0, pg_core_1.varchar)('scanner_run_id', { length: 128 }).notNull(),
    result: (0, pg_core_1.varchar)('result', { length: 128 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
