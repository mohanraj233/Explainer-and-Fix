import { FindingsProvider, FindingRecord } from './findings-provider.interface';
import { DatabaseService } from '../database/database.service';
export interface SafeFixResult {
    findingId: string;
    ruleId: string;
    clientExplanation: string;
    developerGuidance: string;
    aiPatch: string;
    explanationId?: number;
    patchId?: number;
    provider: string;
    status: string;
    sanitized: boolean;
    mappingHandle?: string;
}
export declare class FindingsService {
    private readonly findingsProvider;
    private readonly databaseService;
    private readonly logger;
    private zeroleakBaseUrl;
    private aiWorkerUrl;
    constructor(findingsProvider: FindingsProvider, databaseService: DatabaseService);
    getFindingById(id: string): Promise<FindingRecord>;
    getAllFindings(): Promise<FindingRecord[]>;
    generateSafeFix(findingId: string): Promise<SafeFixResult>;
    retestFinding(findingId: string): Promise<{
        findingId: string;
        ruleId: string;
        scannerRunId: string;
        result: string;
        retestId: any;
        verifiedAt: string;
        scanner: string;
        message: string;
    }>;
}
