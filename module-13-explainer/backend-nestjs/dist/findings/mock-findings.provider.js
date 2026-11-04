"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MockFindingsProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockFindingsProvider = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let MockFindingsProvider = MockFindingsProvider_1 = class MockFindingsProvider {
    constructor() {
        this.logger = new common_1.Logger(MockFindingsProvider_1.name);
        this.logger.log(`Initialized MockFindingsProvider`);
    }
    loadData() {
        const candidates = [
            process.env.FINDINGS_DATA_PATH,
            path.resolve(process.cwd(), '../test-data/findings.json'),
            path.resolve(process.cwd(), 'module-13-explainer/test-data/findings.json'),
            path.resolve(process.cwd(), 'test-data/findings.json'),
            path.resolve(__dirname, '../../../test-data/findings.json'),
            path.resolve(__dirname, '../../test-data/findings.json'),
            path.resolve(__dirname, '../../../../module-13-explainer/test-data/findings.json'),
        ].filter(Boolean);
        for (const candidate of candidates) {
            try {
                if (fs.existsSync(candidate)) {
                    const raw = fs.readFileSync(candidate, 'utf-8');
                    const parsed = JSON.parse(raw);
                    return this.flatten(Array.isArray(parsed) ? parsed : []);
                }
            }
            catch (err) {
                this.logger.error(`Error reading findings JSON from ${candidate}: ${err.message}`);
            }
        }
        this.logger.warn(`Findings file not found in any known locations. Returning default mock items.`);
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
    flatten(arr) {
        return arr.reduce((acc, val) => (Array.isArray(val) ? acc.concat(this.flatten(val)) : acc.concat(val)), []);
    }
    async getFindingById(id) {
        const rawData = this.loadData();
        const all = this.flatten(Array.isArray(rawData) ? rawData : []);
        const searchId = id.toLowerCase().trim();
        const found = all.find((item) => (item && item.id && String(item.id).toLowerCase() === searchId) ||
            (item && item.rule_id && String(item.rule_id).toLowerCase() === searchId));
        return found || null;
    }
    async getAllFindings() {
        const rawData = this.loadData();
        return this.flatten(Array.isArray(rawData) ? rawData : []);
    }
};
exports.MockFindingsProvider = MockFindingsProvider;
exports.MockFindingsProvider = MockFindingsProvider = MockFindingsProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MockFindingsProvider);
//# sourceMappingURL=mock-findings.provider.js.map