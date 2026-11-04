# VibeProofLens - Module 13: AI Security Explainer & Fix Assistant

This directory contains the complete backend microservice architecture for **Module 13: AI Security Explainer & Fix Assistant**, decoupled from the frontend and upstream scanner modules.

---

## 🏗 Architecture & Folder Structure

```
module-13-explainer/
├── backend-nestjs/             # Main REST API Service (Port 5000)
│   ├── src/
│   │   ├── database/           # Neon PostgreSQL + Drizzle ORM
│   │   │   ├── schema.ts       # ai_explanations, ai_patches, ai_messages, retests
│   │   │   ├── database.service.ts
│   │   │   └── database.module.ts
│   │   ├── findings/           # Findings Provider, Service & Controller
│   │   │   ├── findings-provider.interface.ts
│   │   │   ├── mock-findings.provider.ts
│   │   │   ├── real-findings.provider.ts (stub for Modules 1–12)
│   │   │   ├── findings.service.ts       # Decoupled Redaction & AI Fix Pipeline
│   │   │   ├── findings.controller.ts
│   │   │   └── findings.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env                    # Port 5000, ZeroLeak URL, AI Worker URL, Database URL
│   ├── drizzle.config.ts
│   └── package.json
│
├── ai-worker-fastapi/          # Python AI Worker Service (Port 5001)
│   ├── main.py                 # FastAPI application, Pydantic schemas, NVIDIA NIM client
│   ├── requirements.txt
│   └── .env                    # Port 5001, NVIDIA_API_KEY, NVIDIA_MODEL
│
├── test-data/
│   └── findings.json           # Mock scanner findings (DBA-003, CFG-002, SEC-001)
│
└── test_pipeline.py            # End-to-end integration test runner
```

---

## ⚡ Quick Start

### 1. Start AI Worker (FastAPI on Port 5001)
```bash
cd ai-worker-fastapi
pip install -r requirements.txt
python main.py
```
*Health check:* `http://localhost:5001/health`

### 2. Start Main API Backend (NestJS on Port 5000)
```bash
cd backend-nestjs
npm install
npm run build
npm run start
```
*API Base:* `http://localhost:5000/api/v1/findings`

### 3. Run Automated Integration Test
```bash
python test_pipeline.py
```

---

## 🔄 The Decoupled Redaction Pipeline (`POST /api/v1/findings/:id/fix`)

1. **Fetch Finding:** Retrieves finding context and vulnerable code snippet via `FindingsProvider` interface (`MockFindingsProvider` or `RealFindingsProvider`).
2. **Pre-Redact (ZeroLeak):** Dispatches code to ZeroLeak gateway (`POST http://localhost:4000/api/v1/zeroleak/redact`). Fails-closed if secrets violate safety policy (`blocked === true`).
3. **AI Generation (FastAPI Worker):** Sends `sanitized_text` to Python AI Worker on Port 5001. The worker constructs a versioned prompt and invokes NVIDIA NIM (`meta/llama-3.1-70b-instruct`) with strict Pydantic response validation:
   - `client_explanation`: Non-technical executive summary.
   - `developer_guidance`: Technical code review and root-cause analysis.
   - `ai_patch`: Unified git diff remediation.
4. **Response Inspection (ZeroLeak):** Intercepts AI patch via ZeroLeak (`POST http://localhost:4000/api/v1/zeroleak/inspect-response`) to guarantee credentials and private tokens are never restored into code patches.
5. **Persistence (Neon PostgreSQL + Drizzle ORM):** Stores safe records into `ai_explanations` and `ai_patches` tables.

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/findings` | Returns all discovered security findings |
| `GET` | `/api/v1/findings/:id` | Returns finding details by Rule ID or Finding ID |
| `POST` | `/api/v1/findings/:id/fix` | Executes the 5-step Decoupled Redaction & AI Remediation pipeline |
| `POST` | `/api/v1/findings/:id/retest` | Executes a targeted simulated retest and stores `simulated_pass` record |
| `POST` | `http://localhost:5001/api/v1/ai/generate` | Direct FastAPI AI Worker endpoint with Pydantic validation |

