import { FindingsProvider, FindingRecord } from './findings-provider.interface';
export declare class MockFindingsProvider implements FindingsProvider {
    private readonly logger;
    private filePath;
    constructor();
    private loadData;
    private flatten;
    getFindingById(id: string): Promise<FindingRecord | null>;
    getAllFindings(): Promise<FindingRecord[]>;
}
