import { pgTable, serial, text, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Patch status enum: 'pending_approval' | 'approved' | 'rejected'
export const patchStatusEnum = pgEnum('patch_status', [
  'pending_approval',
  'approved',
  'rejected',
]);

// 1. ai_explanations table
export const aiExplanations = pgTable('ai_explanations', {
  id: serial('id').primaryKey(),
  findingId: varchar('finding_id', { length: 128 }).notNull(),
  provider: varchar('provider', { length: 128 }).notNull(),
  promptVersion: varchar('prompt_version', { length: 64 }).notNull(),
  clientExplanation: text('client_explanation').notNull(),
  developerGuidance: text('developer_guidance').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. ai_patches table
export const aiPatches = pgTable('ai_patches', {
  id: serial('id').primaryKey(),
  findingId: varchar('finding_id', { length: 128 }).notNull(),
  patchDiff: text('patch_diff').notNull(),
  status: patchStatusEnum('status').default('pending_approval').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. ai_messages table (contextual security chat history)
export const aiMessages = pgTable('ai_messages', {
  id: serial('id').primaryKey(),
  findingId: varchar('finding_id', { length: 128 }).notNull(),
  sender: varchar('sender', { length: 64 }).notNull(), // 'user' | 'ai'
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. retests table
export const retests = pgTable('retests', {
  id: serial('id').primaryKey(),
  findingId: varchar('finding_id', { length: 128 }).notNull(),
  scannerRunId: varchar('scanner_run_id', { length: 128 }).notNull(),
  result: varchar('result', { length: 128 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Explicit insert types to guarantee exact property recognition
export interface NewAiExplanation {
  findingId: string;
  provider: string;
  promptVersion: string;
  clientExplanation: string;
  developerGuidance: string;
}

export interface NewAiPatch {
  findingId: string;
  patchDiff: string;
  status?: 'pending_approval' | 'approved' | 'rejected';
}

export interface NewAiMessage {
  findingId: string;
  sender: string;
  message: string;
}

export interface NewRetest {
  findingId: string;
  scannerRunId: string;
  result: string;
}
