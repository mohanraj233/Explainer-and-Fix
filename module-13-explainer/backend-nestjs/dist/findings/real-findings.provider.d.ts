import { FindingsProvider, FindingRecord } from './findings-provider.interface';
export declare class RealFindingsProvider implements FindingsProvider {
    private readonly logger;
    private scannerApiUrl;
    getFindingById(id: string): Promise<FindingRecord | null>;
    getAllFindings(): Promise<FindingRecord[]>;
}
