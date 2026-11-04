import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { FindingsProvider, FindingRecord } from './findings-provider.interface';

/**
 * RealFindingsProvider
 * Production integration adapter for Modules 1–12.
 * Connects to the upstream scanner REST API or shared Neon PostgreSQL findings table.
 */
@Injectable()
export class RealFindingsProvider implements FindingsProvider {
  private readonly logger = new Logger(RealFindingsProvider.name);
  private scannerApiUrl = process.env.SCANNER_API_URL || 'http://localhost:3000/api/v1/findings';

  async getFindingById(id: string): Promise<FindingRecord | null> {
    this.logger.log(`[RealFindingsProvider Stub] Fetching finding ${id} from upstream scanner API: ${this.scannerApiUrl}`);
    
    try {
      const response = await axios.get(`${this.scannerApiUrl}/${id}`, {
        timeout: 4000,
      });

      // Normalize upstream scanner payload into standard Module 13 FindingRecord format
      const data = response.data;
      return {
        id: data.id || data.finding_id,
        rule_id: data.rule_id || data.rule,
        title: data.title || data.vulnerability_name,
        severity: (data.severity || data.risk_level || 'MEDIUM').toUpperCase(),
        layer: data.layer || data.security_layer || 'Code',
        technology: data.technology || 'General',
        asset: data.asset || data.file || 'unknown',
        file: data.file,
        line: data.line,
        description: data.description,
        code_snippet: data.code_snippet || data.raw_snippet || '',
        evidence_reference: data.evidence_reference || data.evidence_id || '',
        status: (data.status || 'OPEN').toUpperCase(),
        cwe: data.cwe || data.cwe_id,
      };
    } catch (err) {
      this.logger.warn(`Could not reach real scanner API at ${this.scannerApiUrl}: ${err.message}. (Stub ready for live integration)`);
      return null;
    }
  }

  async getAllFindings(): Promise<FindingRecord[]> {
    try {
      const response = await axios.get(this.scannerApiUrl, { timeout: 4000 });
      return response.data;
    } catch (err) {
      return [];
    }
  }
}

