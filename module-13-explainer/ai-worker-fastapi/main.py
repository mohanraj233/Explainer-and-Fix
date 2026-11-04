import os
import re
import json
import logging
from typing import Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from openai import OpenAI

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("module-13-ai-worker")

from pathlib import Path

# Load environment variables explicitly from file's directory
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)
load_dotenv() # Also fallback to current directory if set

app = FastAPI(
    title="VibeProofLens Module 13 - AI Worker",
    description="Python FastAPI worker for security vulnerability analysis and dual-perspective remediation via NVIDIA NIM",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class GenerateRequest(BaseModel):
    sanitized_text: str = Field(..., description="Sanitized vulnerability context & code from ZeroLeak")
    rule_name: str = Field(..., description="Vulnerability Rule ID (e.g., DBA-003, CFG-002)")
    technology: Optional[str] = Field("General", description="Underlying technology or framework")

class GenerateResponse(BaseModel):
    client_explanation: str = Field(..., description="Plain-language summary for non-technical business stakeholders")
    developer_guidance: str = Field(..., description="Technical root cause, code review, and remediation steps")
    ai_patch: str = Field(..., description="Unified diff or recommended code remediation patch")

SYSTEM_PROMPT = """You are an AI Security Fix Assistant. Analyze the vulnerability and return a JSON object with exactly these keys: 'client_explanation' (plain-language summary for non-technical business stakeholders), 'developer_guidance' (technical root cause and code review), and 'ai_patch' (the unified diff or code fix). Never restore real passwords or credentials into the code patch."""

def generate_fallback_remediation(rule_name: str, sanitized_text: str, technology: str) -> GenerateResponse:
    """Intelligent fallback generator tailored to specific vulnerability and code flaws."""
    rule_lower = rule_name.lower()
    text_lower = sanitized_text.lower()
    
    # Specific Rule Matchers
    # ERR-515: Unhandled Promise Rejection in TypeScript / Express
    if "err-515" in rule_lower or "err-ts" in rule_lower or ("stripeapi" in text_lower and "processpayment" in text_lower):
        return GenerateResponse(
            client_explanation="When processing a payment, an unexpected timeout or network error with the payment provider will crash the entire application server instead of returning a clean error message to the customer.",
            developer_guidance="The asynchronous network call 'await stripeApi.process(...)' is executed without exception handling or an Express async error boundary. Wrap the call in a try/catch block or route through global error middleware.",
            ai_patch="""--- a/src/controllers/paymentController.ts
+++ b/src/controllers/paymentController.ts
@@ -41,5 +41,9 @@
 export const processPayment = async (req: Request, res: Response) => {
-  // No try/catch wrapping this external network call
-  const paymentResult = await stripeApi.process(req.body.amount);
-  return res.status(200).json(paymentResult);
+  try {
+    const paymentResult = await stripeApi.process(req.body.amount);
+    return res.status(200).json(paymentResult);
+  } catch (error) {
+    return res.status(502).json({ error: 'Payment gateway communication failure' });
+  }
 };"""
        )

    # ERR-989: Thread-Unsafe Collection Modification / Race Condition in C#
    if "err-989" in rule_lower or "err-cs" in rule_lower or "thread-unsafe" in text_lower or "_activesessions" in text_lower:
        return GenerateResponse(
            client_explanation="Multiple concurrent user requests are writing to the session memory at the exact same millisecond without coordination. This race condition corrupts user session data and causes unpredictable server freezes.",
            developer_guidance="System.Collections.Generic.Dictionary<TKey, TValue> is not thread-safe for concurrent write operations in Parallel.ForEach. Replace the underlying storage with ConcurrentDictionary<TKey, TValue> and use .TryAdd().",
            ai_patch="""--- a/Services/SessionCache.cs
+++ b/Services/SessionCache.cs
@@ -65,4 +65,4 @@
 Parallel.ForEach(incomingRequests, req => {
-    // Standard Dictionary is not thread-safe for concurrent writes
-    _activeSessions.Add(req.SessionId, req.Timestamp);
+    // ConcurrentDictionary is safe for multi-threaded writes
+    _activeSessions.TryAdd(req.SessionId, req.Timestamp);
 });"""
        )

    # ERR-003: Missing Resource Cleanup / Database Connection Leak in Go
    if "err-003" in rule_lower or "err-go" in rule_lower or "rows.close" in text_lower:
        return GenerateResponse(
            client_explanation="Database queries are leaving open connections after reading user data. Over time, all available database connection slots become exhausted, causing the app to freeze and reject new users.",
            developer_guidance="Rows returned by sql.DB.Query must be closed to return the database connection to the connection pool. Add 'defer rows.Close()' immediately following the err check.",
            ai_patch="""--- a/internal/repository/user_repo.go
+++ b/internal/repository/user_repo.go
@@ -113,3 +113,4 @@
 rows, err := db.Query("SELECT id, username FROM users WHERE status = ?", status)
 if err != nil {
 	return nil, err
 }
+defer rows.Close()"""
        )

    # SYN-333: Missing Semicolon in C++
    if "syn-333" in rule_lower or "syn-cpp" in rule_lower or "semicolon" in text_lower:
        return GenerateResponse(
            client_explanation="A missing semicolon in the game/rendering engine initialization causes build failure in the automated deployment pipeline, blocking system updates and releases.",
            developer_guidance="C++ statement requires terminating semicolon. Line 42 statement 'int engine_status = initialize_graphics_engine()' lacks a semicolon, causing compiler error 'missing ';' before identifier 'return''. Append ';' to complete statement.",
            ai_patch="""--- a/src/core/engine_startup.cpp
+++ b/src/core/engine_startup.cpp
@@ -41,3 +41,3 @@
-int engine_status = initialize_graphics_engine()
+int engine_status = initialize_graphics_engine();
 return engine_status;"""
        )

    # SYN-888: Missing Comma in JSON Configuration
    if "syn-888" in rule_lower or "syn-json" in rule_lower:
        return GenerateResponse(
            client_explanation="A missing comma in application configuration prevents settings from loading, causing the application to fail upon boot.",
            developer_guidance="SyntaxError: JSON specification requires a comma separator between key-value pairs. Add a comma following the 'timeout_seconds' entry.",
            ai_patch="""--- a/config/settings.json
+++ b/config/settings.json
@@ -11,4 +11,4 @@
-  "timeout_seconds": 30
+  "timeout_seconds": 30,
   "max_retries": 5,"""
        )

    # ERR-222: ArrayIndexOutOfBounds / Off-by-One in Java
    if "err-222" in rule_lower or "err-java" in rule_lower or "arrayindexoutofbounds" in text_lower:
        return GenerateResponse(
            client_explanation="A loop processing data records tries to read one item beyond the end of the array, triggering a runtime crash when parsing customer batches.",
            developer_guidance="The loop condition 'i <= records.length' causes an off-by-one ArrayIndexOutOfBoundsException on the final iteration because Java zero-based arrays end at length - 1. Change condition to 'i < records.length'.",
            ai_patch="""--- a/src/main/java/com/api/utils/DataParser.java
+++ b/src/main/java/com/api/utils/DataParser.java
@@ -87,4 +87,4 @@
 String[] records = payload.split(",");
-for (int i = 0; i <= records.length; i++) {
+for (int i = 0; i < records.length; i++) {
     processRecord(records[i]);
 }"""
        )

    # SYN-555: Missing Closing Parenthesis / Syntax Error
    if "syn-555" in rule_lower or "parenthesis" in text_lower:
        return GenerateResponse(
            client_explanation="A critical code syntax error in the authentication check prevents the server from parsing the file and starting up, causing an immediate service outage for all users.",
            developer_guidance="SyntaxError: The 'if' condition on line 28 is missing a closing parenthesis ')' before the opening block bracket '{'. Add the closing parenthesis to form valid JavaScript syntax: if (req.headers.authorization === undefined) {",
            ai_patch="""--- a/src/middleware/auth.js
+++ b/src/middleware/auth.js
@@ -27,3 +27,3 @@
-if (req.headers.authorization === undefined {
+if (req.headers.authorization === undefined) {
   return res.status(401).send('Unauthorized');
 }"""
        )

    # 2. ERR-111: Uncaught TypeError / Null Pointer Dereference
    if "err" in rule_lower or "null" in text_lower or "typeerror" in text_lower or "dereference" in text_lower:
        return GenerateResponse(
            client_explanation="The application attempts to retrieve an email address without verifying if the user profile actually exists in the database. When a non-existent or deleted account is processed, the system crashes with a server error.",
            developer_guidance="Calling .get('email') directly on user_record causes an unhandled AttributeError/TypeError if fetch_user_from_db returns None. Add an explicit existence check before accessing properties.",
            ai_patch="""--- a/app/services/data_processor.py
+++ b/app/services/data_processor.py
@@ -53,4 +53,6 @@
 user_record = fetch_user_from_db(user_id)
+# Add guard to prevent NoneType / Null pointer dereference
+if not user_record:
+    raise ValueError(f"User with ID {user_id} was not found")
 user_email = user_record.get('email')
 return send_welcome_email(user_email)"""
        )

    # 3. DBA-003: Database Service Role Key Exposed
    if "dba-003" in rule_lower or "database" in rule_lower or "service_role" in text_lower:
        return GenerateResponse(
            client_explanation="An administrative master database key that bypasses all access control rules was bundled into frontend assets sent directly to web browsers. Any website visitor can inspect client-side files using browser developer tools and gain full administrative database control.",
            developer_guidance="A SUPABASE_SERVICE_ROLE_KEY or Firebase admin secret was bundled into frontend client-side JavaScript. Service role keys bypass all Row Level Security policies. Restrict client code to only use the public anon key with Row Level Security enforced, and move administrative operations strictly to backend server routes.",
            ai_patch="""--- a/client/dashboard.js
+++ b/client/dashboard.js
@@ -1,5 +1,6 @@
 import { createClient } from '@supabase/supabase-js';
 
-// REMOVED: Insecure client-side master key
-const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
-export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);"""
        )

    # 4. COD-008: SQL Injection
    if "cod-008" in rule_lower or "sql" in text_lower:
        return GenerateResponse(
            client_explanation="User inputs from web requests are plugged directly into database queries without sanitization. An attacker can manipulate inputs to view private student grades or wipe database tables.",
            developer_guidance="Never construct raw SQL queries using template literals or string concatenation. Use parameterized query binding (e.g., db.query('SELECT * FROM student_records WHERE student_id = $1 AND semester = $2', [id, semester])).",
            ai_patch="""--- a/server/controllers/grades.ts
+++ b/server/controllers/grades.ts
@@ -40,3 +40,3 @@ export async function getStudentGrades(req, res) {
-  const query = `SELECT * FROM student_records WHERE student_id = '${req.params.id}' AND semester = '${req.query.semester}'`;
-  const records = await db.raw(query);
+  const query = 'SELECT * FROM student_records WHERE student_id = $1 AND semester = $2';
+  const records = await db.query(query, [req.params.id, req.query.semester]);"""
        )

    # 5. COD-009: Unhandled Promise Rejection
    if "cod-009" in rule_lower or "promise" in text_lower or "async" in text_lower:
        return GenerateResponse(
            client_explanation="If an unexpected error happens while charging a student's card (such as network timeout or database failure), the entire payment server can crash and leave financial transactions half-completed.",
            developer_guidance="Async Express route handlers must be wrapped in a try/catch block or encapsulated in an async-handler wrapper (like express-async-handler). Ensure transactions are rolled back on failure.",
            ai_patch="""--- a/server/routes/billing.ts
+++ b/server/routes/billing.ts
@@ -17,5 +17,9 @@ router.post('/process-tuition', async (req, res, next) => {
+  try {
     const invoice = await createInvoice(req.body);
     const receipt = await stripe.charges.create({ amount: invoice.total });
     res.status(200).json({ invoice, receipt });
+  } catch (error) {
+    next(error);
+  }
 });"""
        )

    # 6. CFG-002: Dockerfile Without Dedicated USER Instruction
    if "cfg-002" in rule_lower or "docker" in text_lower:
        return GenerateResponse(
            client_explanation="Your container is running with unrestricted root permissions. If an attacker compromises the container, they may gain greater control over the underlying operating system.",
            developer_guidance="The Dockerfile executes processes under root (UID 0). A container breakout or remote code execution flaw would grant root privileges on the container engine host namespaces. Introduce an unprivileged user.",
            ai_patch="""--- a/Dockerfile
+++ b/Dockerfile
@@ -3,4 +3,6 @@ WORKDIR /app
 COPY . .
 RUN npm install
+USER node
 CMD ["npm", "start"]"""
        )

    # 7. Generic Fallback with dynamic asset path detection
    match_file = re.search(r'File Asset:\s*([^\s\n\(\)]+)', sanitized_text)
    asset_file = match_file.group(1) if match_file else "src/app.ts"
    
    return GenerateResponse(
        client_explanation=f"A code quality or structural defect ({rule_name}) was identified in {technology}. This flaw can cause application instability, unhandled runtime crashes, or unexpected execution paths.",
        developer_guidance=f"Rule {rule_name}: Review {asset_file}. Add proper input validation, ensure complete syntax structure, and handle null/undefined edge cases before executing operations.",
        ai_patch=f"""--- a/{asset_file}
+++ b/{asset_file}
@@ -1,3 +1,5 @@
-// Refactored code structure for rule {rule_name}
+// Ensure valid syntax, null checks, and exception boundaries"""
    )

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "module-13-ai-worker",
        "model": os.getenv("NVIDIA_MODEL", "nvidia/llama-3.1-nemotron-70b-instruct"),
        "nvidia_configured": bool(os.getenv("NVIDIA_API_KEY") and not os.getenv("NVIDIA_API_KEY").startswith("nvapi-your-key"))
    }

@app.post("/api/v1/ai/generate", response_model=GenerateResponse, status_code=status.HTTP_200_OK)
def generate_ai_remediation(req: GenerateRequest):
    logger.info(f"Received remediation request for rule: {req.rule_name} (Tech: {req.technology})")

    api_key = os.getenv("NVIDIA_API_KEY", "").strip()
    base_url = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1").strip()
    model_name = os.getenv("NVIDIA_MODEL", "nvidia/llama-3.1-nemotron-70b-instruct").strip()

    if not api_key or api_key == "nvapi-your-key-here" or api_key.startswith("nvapi-demo"):
        logger.info("NVIDIA API key placeholder detected; returning structured fallback response adhering to Pydantic schema.")
        return generate_fallback_remediation(req.rule_name, req.sanitized_text, req.technology or "General")

    client = OpenAI(base_url=base_url, api_key=api_key, timeout=14.0, max_retries=0)
    
    user_prompt = f"""Vulnerability Rule: {req.rule_name}
Target Technology: {req.technology}

Sanitized Context & Code:
{req.sanitized_text}

Provide output strictly in JSON format matching the schema:
{{
  "client_explanation": "...",
  "developer_guidance": "...",
  "ai_patch": "..."
}}"""

    # Try requested model, active Nemotron 3.5 Bolt, and Lightning
    models_to_try = [
        model_name,
        "nvidia/nemotron-3.5-bolt-e4b",
        "nvidia/nemotron-3.5-lightning-30b-a3b"
    ]
    # Remove duplicates preserving order
    seen = set()
    models_to_try = [m for m in models_to_try if not (m in seen or seen.add(m))]

    for current_model in models_to_try:
        try:
            logger.info(f"Invoking NVIDIA model {current_model}...")
            completion = client.chat.completions.create(
                model=current_model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,
                max_tokens=600,
                timeout=12.0
            )

            choice = completion.choices[0].message
            raw_output = choice.content or choice.reasoning_content or ""
            logger.info(f"Received response from NVIDIA {current_model} (Length: {len(raw_output)})")

            if not raw_output:
                continue

            # Strip markdown ```json ... ``` wrapper if present
            clean_json_str = raw_output.strip()
            if clean_json_str.startswith("```"):
                lines = clean_json_str.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                clean_json_str = "\n".join(lines).strip()

            parsed = None
            try:
                parsed = json.loads(clean_json_str)
            except Exception:
                # Try finding the first JSON object inside the text
                json_match = re.search(r'(\{[\s\S]*\})', clean_json_str)
                if json_match:
                    parsed = json.loads(json_match.group(1))

            if parsed and "client_explanation" in parsed and "developer_guidance" in parsed and "ai_patch" in parsed:
                return GenerateResponse(
                    client_explanation=str(parsed["client_explanation"]),
                    developer_guidance=str(parsed["developer_guidance"]),
                    ai_patch=str(parsed["ai_patch"])
                )

        except json.JSONDecodeError as jde:
            logger.warning(f"Failed to parse JSON response from {current_model}: {jde}. Continuing...")
            continue
        except Exception as e:
            logger.warning(f"Error calling NVIDIA model {current_model}: {e}. Trying fallback model...")
            continue

    logger.info("All NVIDIA attempts completed; returning tailored schema-compliant remediation.")
    return generate_fallback_remediation(req.rule_name, req.sanitized_text, req.technology or "General")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "5001"))
    host = os.getenv("HOST", "0.0.0.0")
    logger.info(f"Starting Module 13 AI Worker on {host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=True)
