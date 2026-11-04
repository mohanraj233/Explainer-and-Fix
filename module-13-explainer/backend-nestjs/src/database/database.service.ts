import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  public db?: NodePgDatabase<typeof schema>;
  private isConnected = false;

  // Local fallback storage for offline/testing when Neon credentials are placeholders
  private memoryExplanations: Array<schema.NewAiExplanation & { id: number; createdAt: Date }> = [];
  private memoryPatches: Array<schema.NewAiPatch & { id: number; createdAt: Date }> = [];
  private memoryRetests: Array<schema.NewRetest & { id: number; createdAt: Date }> = [];

  async onModuleInit() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl || databaseUrl.includes('npg_sample') || databaseUrl.includes('<neon-host>')) {
      this.logger.warn('DATABASE_URL is using a demo/sample Neon connection string. Initializing local in-memory persistence layer.');
      this.isConnected = false;
      return;
    }

    try {
      this.logger.log('Connecting to Neon PostgreSQL via Drizzle ORM...');
      const pool = new Pool({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false },
      });

      this.db = drizzle(pool, { schema });
      // Test basic connection
      await pool.query('SELECT 1');
      this.isConnected = true;
      this.logger.log('Successfully connected to Neon PostgreSQL database.');
    } catch (error) {
      this.logger.warn(`Could not connect to remote Neon PostgreSQL (${error.message}). Using resilient in-memory persistence for demo/tests.`);
      this.isConnected = false;
    }
  }

  get isDbConnected(): boolean {
    return this.isConnected;
  }

  // 1. Save AI Explanation
  async saveExplanation(data: schema.NewAiExplanation): Promise<any> {
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

  // 2. Save AI Patch
  async savePatch(data: schema.NewAiPatch): Promise<any> {
    if (this.isConnected && this.db) {
      const [result] = await this.db.insert(schema.aiPatches).values(data as any).returning();
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

  // 3. Save Retest Result
  async saveRetest(data: schema.NewRetest): Promise<any> {
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

  // 4. Retrieve saved explanations for a finding
  async getExplanationsByFindingId(findingId: string): Promise<any[]> {
    if (this.isConnected && this.db) {
      return this.db
        .select()
        .from(schema.aiExplanations)
        .where(eq(schema.aiExplanations.findingId, findingId));
    }

    return this.memoryExplanations.filter((e) => e.findingId === findingId);
  }
}
