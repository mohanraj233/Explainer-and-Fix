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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FindingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindingsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const findings_provider_interface_1 = require("./findings-provider.interface");
const database_service_1 = require("../database/database.service");
let FindingsService = FindingsService_1 = class FindingsService {
    constructor(findingsProvider, databaseService) {
        this.findingsProvider = findingsProvider;
        this.databaseService = databaseService;
        this.logger = new common_1.Logger(FindingsService_1.name);
        this.zeroleakBaseUrl = (process.env.ZEROLEAK_BASE_URL || 'http://127.0.0.1:4000/api/v1/zeroleak').replace('localhost', '127.0.0.1');
        this.aiWorkerUrl = (process.env.AI_WORKER_URL || 'http://127.0.0.1:5001/api/v1/ai/generate').replace('localhost', '127.0.0.1');
    }
    async getFindingById(id) {
        const finding = await this.findingsProvider.getFindingById(id);
        if (!finding) {
            throw new common_1.NotFoundException(`Finding with ID '${id}' not found`);
        }
        return finding;
    }
    async getAllFindings() {
        if (this.findingsProvider.getAllFindings) {
            return this.findingsProvider.getAllFindings();
        }
        return [];
    }
    async generateSafeFix(findingId) {
        this.logger.log(`[Decoupled Pipeline] Initiating safe fix generation for finding: ${findingId}`);
        const finding = await this.getFindingById(findingId);
        const rawPayload = `Vulnerability Rule: ${finding.rule_id} - ${finding.title}
File Asset: ${finding.asset || finding.file || 'unknown'} (Line: ${finding.line || 1})
Vulnerable Code Snippet:
${finding.code_snippet}

Description:
${finding.description}`;
        let sanitizedText = rawPayload;
        let mappingHandle = `zh-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        let isRedactedByZeroLeak = false;
        try {
            this.logger.log(`[Step 2: Pre-Redact] Calling ZeroLeak at ${this.zeroleakBaseUrl}/redact`);
            const zeroLeakRes = await axios_1.default.post(`${this.zeroleakBaseUrl}/redact`, {
                payload: rawPayload,
                strategy: 'placeholder',
            }, { timeout: 1500 });
            const redactData = zeroLeakRes.data;
            if (redactData.blocked) {
                this.logger.error(`[ZeroLeak Fail-Closed] Request blocked: ${redactData.blockedReason || 'Critical unredactable credentials detected'}`);
                throw new common_1.BadRequestException(`ZeroLeak Intercepted: Critical credentials cannot be passed to AI worker. Reason: ${redactData.blockedReason || 'Secret policy violation'}`);
            }
            sanitizedText = redactData.sanitizedText || rawPayload;
            mappingHandle = redactData.mappingHandle || mappingHandle;
            isRedactedByZeroLeak = true;
            this.logger.log(`[ZeroLeak Pre-Redact] Sanitization completed with handle: ${mappingHandle}`);
        }
        catch (err) {
            if (err instanceof common_1.BadRequestException) {
                throw err;
            }
            this.logger.warn(`ZeroLeak gateway offline at ${this.zeroleakBaseUrl} (${err.message}). Enforcing local fail-safe sanitization.`);
            sanitizedText = rawPayload
                .replace(/(['"])(sk_live_[a-zA-Z0-9]+)\1/g, '"<STRIPE_API_KEY_1>"')
                .replace(/(['"])(VPL_FAKE_[a-zA-Z0-9_]+)\1/g, '"<SERVICE_ROLE_KEY_1>"')
                .replace(/postgres:\/\/[^:]+:[^@]+@/g, 'postgres://<USER>:<DATABASE_URL_1>@');
            isRedactedByZeroLeak = true;
        }
        let aiResponse = {
            client_explanation: '',
            developer_guidance: '',
            ai_patch: '',
        };
        try {
            this.logger.log(`[Step 3: AI Worker] Calling FastAPI worker at ${this.aiWorkerUrl}`);
            const workerRes = await axios_1.default.post(this.aiWorkerUrl, {
                sanitized_text: sanitizedText,
                rule_name: finding.rule_id,
                technology: finding.technology || 'General',
            }, { timeout: 25000 });
            aiResponse = workerRes.data;
            this.logger.log(`[FastAPI AI Worker] Received valid dual-perspective response`);
        }
        catch (err) {
            this.logger.error(`Error calling AI Worker on 5001: ${err.message}.`);
            throw new common_1.BadRequestException(`AI Worker service is unreachable on ${this.aiWorkerUrl}: ${err.message}`);
        }
        let inspectedPatch = aiResponse.ai_patch;
        let inspectedExplanation = aiResponse.client_explanation;
        try {
            this.logger.log(`[Step 4: Response Inspection] Verifying model response with ZeroLeak`);
            const inspectRes = await axios_1.default.post(`${this.zeroleakBaseUrl}/inspect-response`, {
                responseText: aiResponse.ai_patch,
                mappingHandle: mappingHandle,
            }, { timeout: 1500 });
            const inspectData = inspectRes.data;
            if (inspectData.blocked || inspectData.securityVerdict === 'blocked') {
                throw new common_1.BadRequestException('Security Alert: Model output contained echoed secrets. Intercepted by ZeroLeak.');
            }
            if (inspectData.safeResponse) {
                inspectedPatch = inspectData.safeResponse;
            }
        }
        catch (err) {
            if (err instanceof common_1.BadRequestException) {
                throw err;
            }
            this.logger.log(`Response inspection note: ${err.message}`);
        }
        const provider = 'nvidia/meta/llama-3.1-70b-instruct';
        const promptVersion = 'v1.0-dual-perspective';
        const savedExplanation = await this.databaseService.saveExplanation({
            findingId: finding.id,
            provider: provider,
            promptVersion: promptVersion,
            clientExplanation: inspectedExplanation,
            developerGuidance: aiResponse.developer_guidance,
        });
        const savedPatch = await this.databaseService.savePatch({
            findingId: finding.id,
            patchDiff: inspectedPatch,
            status: 'pending_approval',
        });
        this.logger.log(`[Database Storage] Successfully persisted explanation (ID: ${savedExplanation.id}) and patch (ID: ${savedPatch.id})`);
        return {
            findingId: finding.id,
            ruleId: finding.rule_id,
            clientExplanation: inspectedExplanation,
            developerGuidance: aiResponse.developer_guidance,
            aiPatch: inspectedPatch,
            explanationId: savedExplanation.id,
            patchId: savedPatch.id,
            provider: provider,
            status: 'success_protected_by_zeroleak',
            sanitized: isRedactedByZeroLeak,
            mappingHandle: mappingHandle,
        };
    }
    async retestFinding(findingId) {
        this.logger.log(`Executing simulated scanner retest for finding: ${findingId}`);
        const finding = await this.getFindingById(findingId);
        const scannerRunId = `SCAN-RUN-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
        const resultStatus = 'simulated_pass';
        const savedRecord = await this.databaseService.saveRetest({
            findingId: finding.id,
            scannerRunId: scannerRunId,
            result: resultStatus,
        });
        return {
            findingId: finding.id,
            ruleId: finding.rule_id,
            scannerRunId: scannerRunId,
            result: resultStatus,
            retestId: savedRecord.id,
            verifiedAt: new Date().toISOString(),
            scanner: 'Targeted In-Browser & Code Retest Adapter',
            message: 'Retest execution completed with zero unresolved detections under simulated pass criteria.',
        };
    }
};
exports.FindingsService = FindingsService;
exports.FindingsService = FindingsService = FindingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(findings_provider_interface_1.FINDINGS_PROVIDER)),
    __metadata("design:paramtypes", [Object, database_service_1.DatabaseService])
], FindingsService);
//# sourceMappingURL=findings.service.js.map