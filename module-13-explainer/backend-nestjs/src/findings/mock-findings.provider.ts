import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FindingsProvider, FindingRecord } from './findings-provider.interface';

@Injectable()
export class MockFindingsProvider implements FindingsProvider {
  private readonly logger = new Logger(MockFindingsProvider.name);
  private filePath: string;

  constructor() {
    this.logger.log(`Initialized MockFindingsProvider`);
  }

  private loadData(): FindingRecord[] {
    const candidates = [
      process.env.FINDINGS_DATA_PATH,
      path.resolve(process.cwd(), '../test-data/findings.json'),
      path.resolve(process.cwd(), 'module-13-explainer/test-data/findings.json'),
      path.resolve(process.cwd(), 'test-data/findings.json'),
      path.resolve(__dirname, '../../../test-data/findings.json'),
      path.resolve(__dirname, '../../test-data/findings.json'),
      path.resolve(__dirname, '../../../../module-13-explainer/test-data/findings.json'),
    ].filter(Boolean) as string[];

    for (const candidate of candidates) {
      try {
        if (fs.existsSync(candidate)) {
          const raw = fs.readFileSync(candidate, 'utf-8');
          const parsed = JSON.parse(raw);
          return this.flatten(Array.isArray(parsed) ? parsed : []);
        }
      } catch (err) {
        this.logger.error(`Error reading findings JSON from ${candidate}: ${err.message}`);
      }
    }

    this.logger.warn(`Findings file not found in any known locations. Returning default mock items.`);

    // Built-in resilient fallback
    return [
      {
        id: 'DBA-003',
        rule_id: 'DBA-003',
        title: 'Database Admin / Service-Role Key Exposed in Client Asset',
        severity: 'CRITICAL',
        layer: 'Database',
        technology: 'Supabase / PostgreSQL',
        asset: 'client/dashboard.js',
        file: 'client/dashboard.js',
        line: 3,
        description: 'An administrative master key (SUPABASE_SERVICE_ROLE_KEY) that bypasses all security rules was included in files sent directly to web browsers.',
        code_snippet: 'const SERVICE_ROLE_KEY = "VPL_FAKE_service_role_client_key_998877";\nconst supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);',
        evidence_reference: 'EVD-DBA-003-882194',
        status: 'OPEN',
        cwe: 'CWE-798: Use of Hard-coded Credentials',
      },
    ];
  }

  private flatten(arr: any[]): any[] {
    return arr.reduce(
      (acc, val) => (Array.isArray(val) ? acc.concat(this.flatten(val)) : acc.concat(val)),
      []
    );
  }

  async getFindingById(id: string): Promise<FindingRecord | null> {
    const rawData = this.loadData();
    const all: any[] = this.flatten(Array.isArray(rawData) ? rawData : []);
    const searchId = id.toLowerCase().trim();
    const found = all.find(
      (item) =>
        (item && item.id && String(item.id).toLowerCase() === searchId) ||
        (item && item.rule_id && String(item.rule_id).toLowerCase() === searchId)
    );
    return found || null;
  }

  async getAllFindings(): Promise<FindingRecord[]> {
    const rawData = this.loadData();
    return this.flatten(Array.isArray(rawData) ? rawData : []);
  }
}

