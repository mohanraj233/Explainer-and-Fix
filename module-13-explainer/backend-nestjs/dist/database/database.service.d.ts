import { OnModuleInit } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
export declare class DatabaseService implements OnModuleInit {
    private readonly logger;
    db?: NodePgDatabase<typeof schema>;
    private isConnected;
    private memoryExplanations;
    private memoryPatches;
    private memoryRetests;
    onModuleInit(): Promise<void>;
    get isDbConnected(): boolean;
    saveExplanation(data: schema.NewAiExplanation): Promise<any>;
    savePatch(data: schema.NewAiPatch): Promise<any>;
    saveRetest(data: schema.NewRetest): Promise<any>;
    getExplanationsByFindingId(findingId: string): Promise<any[]>;
}
