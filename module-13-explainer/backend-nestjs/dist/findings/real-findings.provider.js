"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RealFindingsProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealFindingsProvider = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let RealFindingsProvider = RealFindingsProvider_1 = class RealFindingsProvider {
    constructor() {
        this.logger = new common_1.Logger(RealFindingsProvider_1.name);
        this.scannerApiUrl = process.env.SCANNER_API_URL || 'http://localhost:3000/api/v1/findings';
    }
    async getFindingById(id) {
        this.logger.log(`[RealFindingsProvider Stub] Fetching finding ${id} from upstream scanner API: ${this.scannerApiUrl}`);
        try {
            const response = await axios_1.default.get(`${this.scannerApiUrl}/${id}`, {
                timeout: 4000,
            });
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
        }
        catch (err) {
            this.logger.warn(`Could not reach real scanner API at ${this.scannerApiUrl}: ${err.message}. (Stub ready for live integration)`);
            return null;
        }
    }
    async getAllFindings() {
        try {
            const response = await axios_1.default.get(this.scannerApiUrl, { timeout: 4000 });
            return response.data;
        }
        catch (err) {
            return [];
        }
    }
};
exports.RealFindingsProvider = RealFindingsProvider;
exports.RealFindingsProvider = RealFindingsProvider = RealFindingsProvider_1 = __decorate([
    (0, common_1.Injectable)()
], RealFindingsProvider);
//# sourceMappingURL=real-findings.provider.js.map