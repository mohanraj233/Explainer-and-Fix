import { FindingsService, SafeFixResult } from './findings.service';
export declare class FindingsController {
    private readonly findingsService;
    constructor(findingsService: FindingsService);
    getAllFindings(): Promise<import("./findings-provider.interface").FindingRecord[]>;
    getFindingById(id: string): Promise<import("./findings-provider.interface").FindingRecord>;
    generateSafeFix(id: string): Promise<SafeFixResult>;
    retestFinding(id: string): Promise<{
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
