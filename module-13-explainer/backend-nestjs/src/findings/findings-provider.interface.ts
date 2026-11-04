export interface FindingRecord {
  id: string;
  rule_id: string;
  title: string;
  severity: string;
  layer: string;
  technology?: string;
  asset?: string;
  file?: string;
  line?: number;
  description: string;
  code_snippet: string;
  evidence_reference: string;
  status: string;
  cwe?: string;
}

export interface FindingsProvider {
  getFindingById(id: string): Promise<FindingRecord | null>;
  getAllFindings?(): Promise<FindingRecord[]>;
}

export const FINDINGS_PROVIDER = 'FINDINGS_PROVIDER';

