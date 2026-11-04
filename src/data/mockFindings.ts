export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type Layer = 'Code' | 'Database' | 'Website' | 'Hosting' | 'Server and API';
export type Status = 'Open' | 'Accepted' | 'Fixed';

export interface Finding {
  id: string;
  ruleId: string;
  severity: Severity;
  layer: Layer;
  title: string;
  location: string;
  line?: number;
  status: Status;
  cwe?: string;
  technology?: string;
  verifiedInBrowser?: boolean;
  confidence?: 'High' | 'Medium' | 'Low';
  
  // Code snippet & Evidence
  maskedSnippet: string;
  rawSnippetPlaceholder?: string;
  
  // Dual-Perspective Descriptions
  clientExplanation: string;
  developerGuidance: string;
  oneClickAiPrompt: string;
  
  // Executive summary for client advisory
  executiveSummary: string;
  riskImpact: string;
  threatVector: string;
  
  // Unified Git Diff Patch
  suggestedPatch?: string;
}

export const mockFindings: Finding[] = [
  {
    id: "DBA-003",
    ruleId: "DBA-003",
    severity: "Critical",
    layer: "Database",
    title: "Database Admin / Service-Role Key Exposed in Client Asset",
    location: "client/dashboard.js",
    line: 3,
    status: "Open",
    cwe: "CWE-798: Use of Hard-coded Credentials",
    technology: "Supabase / PostgreSQL",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `const SERVICE_ROLE_KEY = "VPL_FAKE_service_role_client_key_998877";
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);`,
    clientExplanation: "An administrative master key that bypasses all security rules was included in files sent directly to web browsers. Visitors can extract this key using browser developer tools and gain full administrative database control.",
    developerGuidance: "A SUPABASE_SERVICE_ROLE_KEY or Firebase admin secret was bundled into frontend client-side JavaScript. Service role keys bypass all Row Level Security policies.",
    oneClickAiPrompt: "Remove the service role key from client-side bundles. Restrict frontend code to only use the public anon key with Row Level Security enforced, and keep service keys strictly on backend servers.",
    executiveSummary: "A master administrative key granting unrestricted database privileges is exposed within public website code. Any user or competitor can download client assets via browser inspect tools to extract, alter, or delete student and institution database records without authentication.",
    riskImpact: "Total breach of database confidentiality and integrity; immediate administrative takeover possible.",
    threatVector: "Client-side credential scraping via Browser DevTools Network/Source tab inspection.",
    suggestedPatch: `--- a/client/dashboard.js
+++ b/client/dashboard.js
@@ -1,5 +1,6 @@
 import { createClient } from '@supabase/supabase-js';
 
-// VULNERABILITY: Service role key exposed on client
-const SERVICE_ROLE_KEY = "VPL_FAKE_service_role_client_key_998877";
-export const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
+// FIX: Restrict client to public anon key; service operations moved to server route
+const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
+export const supabase = createClient(SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);`
  },
  {
    id: "CFG-002",
    ruleId: "CFG-002",
    severity: "Critical",
    layer: "Code",
    title: "Dockerfile Without Dedicated USER Instruction",
    location: "Dockerfile",
    line: 1,
    status: "Open",
    cwe: "CWE-250: Execution with Unnecessary Privileges",
    technology: "Docker / Container",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]`,
    clientExplanation: "Your container is running with unrestricted root permissions. If an attacker compromises the container, they may gain greater control over the underlying operating system.",
    developerGuidance: "Running containers as root poses serious security risks. Any Remote Code Execution (RCE) vulnerability inside the app inherits root privileges on the container engine and host namespaces.",
    oneClickAiPrompt: "Add a dedicated non-root USER instruction (e.g., node or www-data) before executing the application process in the Dockerfile.",
    executiveSummary: "Your container is running with unrestricted root permissions. If an attacker compromises the container, they may gain greater control over the underlying operating system.",
    riskImpact: "Container breakout and privilege escalation directly to the host operating system.",
    threatVector: "Exploitation of web framework vulnerabilities running under process UID 0 (root).",
    suggestedPatch: `--- a/Dockerfile
+++ b/Dockerfile
@@ -3,4 +3,6 @@ WORKDIR /app
 COPY . .
 RUN npm install
+USER node
 CMD ["npm", "start"]`
  },
  {
    id: "SEC-001",
    ruleId: "SEC-001",
    severity: "Critical",
    layer: "Code",
    title: "Hardcoded API Key / Secret Literal",
    location: "src/services/payment.ts",
    line: 14,
    status: "Open",
    cwe: "CWE-798: Hard-coded Credentials",
    technology: "Stripe / TypeScript",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `const STRIPE_SECRET = "VPL_FAKE_sk_live_94819482918471928471";
const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2023-10-16' });`,
    clientExplanation: "Live commercial payment gateway credentials were baked directly into your source code repository, exposing customer financial transactions and refund permissions to anyone with codebase access.",
    developerGuidance: "Payment gateway secret keys (sk_live) must never exist in version control. Load them via runtime environment variables (process.env.STRIPE_SECRET_KEY) injected through your secure hosting provider.",
    oneClickAiPrompt: "Migrate hardcoded Stripe secret key to process.env.STRIPE_SECRET_KEY, add variable to .env.example, and configure key in your production deployment secrets manager.",
    executiveSummary: "Commercial payment provider secret keys were detected directly in software assets. An unauthorized entity could inspect billing logs, initiate fraudulent refunds, or divert payout accounts.",
    riskImpact: "Direct financial liability, unauthorized transaction triggers, and PCI-DSS compliance failure.",
    threatVector: "Git commit history scraping or unauthorized collaborator access.",
    suggestedPatch: `--- a/src/services/payment.ts
+++ b/src/services/payment.ts
@@ -11,4 +11,4 @@ import Stripe from 'stripe';
-const STRIPE_SECRET = "VPL_FAKE_sk_live_94819482918471928471";
+const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY!;
 const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2023-10-16' });`
  },
  {
    id: "SEC-002",
    ruleId: "SEC-002",
    severity: "Critical",
    layer: "Code",
    title: "Committed Environment Configuration File (.env)",
    location: ".env",
    line: 1,
    status: "Open",
    cwe: "CWE-552: Files or Directories Accessible to External Parties",
    technology: "Git / Configuration",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `DATABASE_URL=postgres://vpl_user:VPL_FAKE_pw_9824@db.prod:5432/main
JWT_SECRET=VPL_FAKE_jwt_token_secret_8819284
SENDGRID_API_KEY=VPL_FAKE_sg_key_28471928`,
    clientExplanation: "A private configuration file holding multiple database passwords, authentication secrets, and mail server credentials was mistakenly packaged inside the release archive.",
    developerGuidance: "The .env file must be removed from Git tracking and added to .gitignore immediately. Secrets within the file should be rotated as they are considered compromised.",
    oneClickAiPrompt: "Add .env to .gitignore, run git rm --cached .env, and rotate all database, mail, and authentication credentials exposed in the committed archive.",
    executiveSummary: "Production environment secrets file packaged directly in the release archive. Exposes core infrastructure credentials across database, authentication tokens, and notification dispatchers.",
    riskImpact: "Immediate exposure of full infrastructure stack across all third-party integrations.",
    threatVector: "Archive extraction from build artifacts or public repository releases.",
  },
  {
    id: "SEC-004",
    ruleId: "SEC-004",
    severity: "Critical",
    layer: "Database",
    title: "Database Connection String with Embedded Credentials",
    location: "config/database.json",
    line: 5,
    status: "Open",
    cwe: "CWE-312: Cleartext Storage of Sensitive Information",
    technology: "PostgreSQL / JSON",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `"connection": "postgres://postgres:VPL_FAKE_pg_super_admin@rds.campusone.internal:5432/production"`,
    clientExplanation: "Database credentials including master database admin login and host URL are stored in plaintext configuration files accessible to all project users.",
    developerGuidance: "Replace cleartext connection strings with dynamic runtime credential resolvers or connection poolers (PgBouncer) using vault-backed secrets.",
    oneClickAiPrompt: "Configure dynamic database connection string loading from environment variables with SSL enforcement enabled (sslmode=require).",
    executiveSummary: "Database master connection string containing cleartext username and password committed to project repository configuration files.",
    riskImpact: "Direct database access from unauthorized internal networks or compromised repository tokens.",
    threatVector: "Internal network lateral movement and unauthorized SQL queries.",
  },
  {
    id: "SEC-005",
    ruleId: "SEC-005",
    severity: "High",
    layer: "Code",
    title: "High-Entropy Secret Literal Detected in Source",
    location: "src/utils/crypto.ts",
    line: 22,
    status: "Open",
    cwe: "CWE-798: Use of Hard-coded Credentials",
    technology: "TypeScript / Node.js",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `const ENCRYPTION_SALT = "VPL_FAKE_high_entropy_salt_77a9b82c1e4d";`,
    clientExplanation: "A cryptographic encryption key used to protect sensitive student records was found hardcoded directly in encryption utility code.",
    developerGuidance: "Cryptographic salts and master keys should be retrieved from a key management service (KMS) or secure environment variable at startup.",
    oneClickAiPrompt: "Refactor crypto utility to read ENCRYPTION_SALT from process.env with fallback error handling if key is missing.",
    executiveSummary: "Static high-entropy cryptographic salt detected in encryption modules. Compromises data-at-rest protection guarantees.",
    riskImpact: "Deterministic ciphertext generation allowing rainbow table attacks on encrypted fields.",
    threatVector: "Cryptanalytic attacks exploiting static salt re-use across all tenants.",
  },
  {
    id: "COD-008",
    ruleId: "COD-008",
    severity: "Critical",
    layer: "Code",
    title: "SQL Injection via Raw String Interpolation in Query Builder",
    location: "server/controllers/grades.ts",
    line: 42,
    status: "Open",
    cwe: "CWE-89: SQL Injection",
    technology: "Node.js / PostgreSQL",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `const query = \`SELECT * FROM student_records WHERE student_id = '\${req.params.id}' AND semester = '\${req.query.semester}'\`;
const records = await db.raw(query);`,
    clientExplanation: "User inputs from web requests are plugged directly into database queries without sanitization. An attacker can manipulate inputs to view private student grades or wipe database tables.",
    developerGuidance: "Never construct raw SQL queries using template literals or string concatenation. Use parameterized query binding (e.g., db.query('SELECT * FROM student_records WHERE student_id = $1 AND semester = $2', [id, semester])).",
    oneClickAiPrompt: "Refactor raw SQL interpolation in server/controllers/grades.ts to use parameterized query placeholders ($1, $2) and pass parameters via an array.",
    executiveSummary: "Direct concatenation of untrusted client parameters into a raw SQL query string allows attackers to inject arbitrary SQL statements, bypass authentication, or exfiltrate database records.",
    riskImpact: "Total database compromise, arbitrary data exfiltration, and unauthorized alteration of academic transcripts.",
    threatVector: "SQL injection injection payload via HTTP request query parameters.",
    suggestedPatch: `--- a/server/controllers/grades.ts
+++ b/server/controllers/grades.ts
@@ -40,3 +40,3 @@ export async function getStudentGrades(req, res) {
-  const query = \`SELECT * FROM student_records WHERE student_id = '\${req.params.id}' AND semester = '\${req.query.semester}'\`;
-  const records = await db.raw(query);
+  const query = 'SELECT * FROM student_records WHERE student_id = $1 AND semester = $2';
+  const records = await db.query(query, [req.params.id, req.query.semester]);`
  },
  {
    id: "COD-009",
    ruleId: "COD-009",
    severity: "High",
    layer: "Code",
    title: "Unhandled Promise Rejection & Missing Exception Boundary in Async Handler",
    location: "server/routes/billing.ts",
    line: 18,
    status: "Open",
    cwe: "CWE-755: Improper Handling of Exceptional Conditions",
    technology: "Express / TypeScript",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `router.post('/process-tuition', async (req, res) => {
  const invoice = await createInvoice(req.body);
  const receipt = await stripe.charges.create({ amount: invoice.total });
  res.status(200).json({ invoice, receipt });
});`,
    clientExplanation: "If an unexpected error happens while charging a student's card (such as network timeout or database failure), the entire payment server can crash and leave financial transactions half-completed.",
    developerGuidance: "Async Express route handlers must be wrapped in a try/catch block or encapsulated in an async-handler wrapper (like express-async-handler). Ensure transactions are rolled back on failure.",
    oneClickAiPrompt: "Wrap the async handler in a try/catch block, ensure database rollback occurs on Stripe API failure, and pass error to next(err).",
    executiveSummary: "Asynchronous controller function lacks exception handling boundaries. Any unhandled rejection from the payment gateway or database causes node process termination and transaction inconsistency.",
    riskImpact: "Denial of service (server crash) and duplicate billing charges without recorded receipts.",
    threatVector: "Triggering API exceptions through malformed JSON bodies or simulating network disconnects.",
    suggestedPatch: `--- a/server/routes/billing.ts
+++ b/server/routes/billing.ts
@@ -17,5 +17,9 @@ router.post('/process-tuition', async (req, res, next) => {
+  try {
     const invoice = await createInvoice(req.body);
     const receipt = await stripe.charges.create({ amount: invoice.total });
     res.status(200).json({ invoice, receipt });
+  } catch (error) {
+    next(error);
+  }
 });`
  },
  {
    id: "COD-010",
    ruleId: "COD-010",
    severity: "High",
    layer: "Code",
    title: "Prototype Pollution via Unsafe Recursive Object Merge",
    location: "src/utils/deepMerge.js",
    line: 12,
    status: "Open",
    cwe: "CWE-1321: Prototype Pollution",
    technology: "JavaScript / Node.js",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object) {
      Object.assign(source[key], deepMerge(target[key] || {}, source[key]));
    }
    target[key] = source[key];
  }
  return target;
}`,
    clientExplanation: "The utility that combines user account settings has a logic flaw that allows a malicious user to modify the basic blueprint of all objects in the system, potentially elevating themselves to administrator.",
    developerGuidance: "Recursive object merge functions must validate that key is not '__proto__', 'constructor', or 'prototype'. Alternatively, use structuredClone or libraries with built-in prototype pollution guards (lodash.merge with proto checks).",
    oneClickAiPrompt: "Add a security guard in deepMerge: if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;",
    executiveSummary: "Flawed recursive object merger permits modification of base JavaScript object prototypes, which can subvert downstream authorization checks.",
    riskImpact: "Privilege escalation and remote code execution if polluted properties alter execution control flow.",
    threatVector: "Submitting JSON payloads containing '__proto__' or 'constructor' keys in user profile updates.",
    suggestedPatch: `--- a/src/utils/deepMerge.js
+++ b/src/utils/deepMerge.js
@@ -1,4 +1,5 @@ function deepMerge(target, source) {
   for (const key of Object.keys(source)) {
+    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
     if (source[key] instanceof Object) {`
  },
  {
    id: "COD-011",
    ruleId: "COD-011",
    severity: "High",
    layer: "Code",
    title: "Path Traversal via Unsanitized File Stream Path Concatenation",
    location: "src/api/export.ts",
    line: 24,
    status: "Open",
    cwe: "CWE-22: Path Traversal",
    technology: "Node.js / File System",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `const filePath = path.join(EXPORT_DIR, req.query.reportFile as string);
fs.createReadStream(filePath).pipe(res);`,
    clientExplanation: "The file download feature allows users to request files using dot-dot-slash (../../) sequences to escape the downloads folder and read secret system files from the server.",
    developerGuidance: "Normalize the requested path with path.resolve and verify that it starts with the canonical base export directory: if (!resolvedPath.startsWith(path.resolve(EXPORT_DIR))) throw new Error('Forbidden').",
    oneClickAiPrompt: "Validate that path.resolve(EXPORT_DIR, filename).startsWith(path.resolve(EXPORT_DIR)) before creating read streams.",
    executiveSummary: "File retrieval endpoint concatenates untrusted filename input without path confinement verification, exposing server configuration and application source code.",
    riskImpact: "Confidentiality breach of server environment files (.env), private certificates, and local credentials.",
    threatVector: "HTTP GET request with parameter: ?reportFile=../../../../etc/passwd",
    suggestedPatch: `--- a/src/api/export.ts
+++ b/src/api/export.ts
@@ -23,3 +23,5 @@ app.get('/export', (req, res) => {
-  const filePath = path.join(EXPORT_DIR, req.query.reportFile as string);
+  const safeFile = path.basename(req.query.reportFile as string);
+  const filePath = path.resolve(EXPORT_DIR, safeFile);
+  if (!filePath.startsWith(path.resolve(EXPORT_DIR))) return res.status(403).send('Forbidden');
   fs.createReadStream(filePath).pipe(res);`
  },
  {
    id: "COD-012",
    ruleId: "COD-012",
    severity: "High",
    layer: "Code",
    title: "Race Condition in Financial Transfer (Non-Atomic Check-Then-Act)",
    location: "src/services/wallet.ts",
    line: 35,
    status: "Open",
    cwe: "CWE-362: Race Condition / TOCTOU",
    technology: "Prisma / TypeScript",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `const account = await db.accounts.findUnique({ where: { id: userId } });
if (account.balance >= transferAmount) {
  await db.accounts.update({ where: { id: userId }, data: { balance: account.balance - transferAmount } });
  await db.accounts.update({ where: { id: targetId }, data: { balance: { increment: transferAmount } } });
}`,
    clientExplanation: "When a user sends money, the system checks their balance first and subtracts it second without locking the account. Sending two requests simultaneously allows spending the same money twice.",
    developerGuidance: "Use a database transaction with atomic decrement and a balance constraint (e.g. UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND balance >= $1) or Prisma interactive transactions with row-level locks.",
    oneClickAiPrompt: "Refactor wallet balance transfer into an atomic Prisma interactive transaction (db.$transaction) with optimistic concurrency or balance checks.",
    executiveSummary: "Non-atomic balance checking and updating creates a time-of-check to time-of-use (TOCTOU) race condition allowing concurrent double-spending.",
    riskImpact: "Financial ledger deficit, unauthorized wallet overdrafts, and institutional financial discrepancy.",
    threatVector: "Automated concurrent HTTP requests sent in the same millisecond window.",
  },
  {
    id: "COD-013",
    ruleId: "COD-013",
    severity: "Medium",
    layer: "Code",
    title: "Stale Closure & Missing useEffect Dependency in Critical Data Fetch",
    location: "components/StudentList.tsx",
    line: 15,
    status: "Open",
    cwe: "CWE-664: Improper Control of Resource Lifetime",
    technology: "React / Next.js",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `useEffect(() => {
  fetch(\`/api/students?department=\${selectedDept}\`)
    .then(res => res.json())
    .then(data => setStudents(data));
}, []); // Anti-pattern: Missing selectedDept dependency causes stale closure`,
    clientExplanation: "A user interface component fails to update when changing departments because the code forgets to re-trigger the data fetch, showing wrong student records to staff.",
    developerGuidance: "Include all reactive values referenced inside useEffect in its dependency array ([selectedDept]), or use React Query / SWR with cache keys for automatic cache invalidation.",
    oneClickAiPrompt: "Add selectedDept to the useEffect dependency array in components/StudentList.tsx and add AbortController cleanup to cancel inflight requests.",
    executiveSummary: "React hook dependency array omission creates a stale closure where state updates do not refresh UI data, causing phantom UI desynchronization.",
    riskImpact: "Staff acting upon outdated student records and potential cross-department data confusion.",
    threatVector: "Internal user workflow state divergence caused by UI state caching flaws.",
  },
  {
    id: "COD-007",
    ruleId: "COD-007",
    severity: "High",
    layer: "Code",
    title: "Direct HTML Injection via innerHTML / dangerouslySetInnerHTML",
    location: "components/RichNotice.tsx",
    line: 18,
    status: "Open",
    cwe: "CWE-79: Cross-site Scripting (XSS)",
    technology: "React / Next.js",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `<div dangerouslySetInnerHTML={{ __html: userSubmittedNoticeBody }} />`,
    clientExplanation: "User-submitted announcements are rendered directly into the web page without sanitization, allowing malicious scripts to steal admin session cookies.",
    developerGuidance: "Never pass unsanitized user inputs to dangerouslySetInnerHTML. Use DOMPurify (DOMPurify.sanitize()) or native Markdown renderers with strict AST sanitization.",
    oneClickAiPrompt: "Wrap userSubmittedNoticeBody with DOMPurify.sanitize() before passing to dangerouslySetInnerHTML, or replace with safe text rendering.",
    executiveSummary: "Cross-site scripting (XSS) vulnerability allowing arbitrary JavaScript execution inside authenticated user sessions.",
    riskImpact: "Session hijacking, credential theft, and unauthorized actions performed on behalf of campus administrators.",
    threatVector: "Malicious payload injection in student and staff notice board submissions.",
  },
  {
    id: "SEC-003",
    ruleId: "SEC-003",
    severity: "High",
    layer: "Code",
    title: "Hardcoded Secret in JWT Sign / Verify",
    location: "middleware/auth.ts",
    line: 8,
    status: "Open",
    cwe: "CWE-321: Use of Hard-coded Cryptographic Key",
    technology: "JWT / Node.js",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `const token = jwt.sign(payload, "VPL_FAKE_hardcoded_jwt_super_secret", { expiresIn: '1h' });`,
    clientExplanation: "The security seal used to verify logged-in users uses a fixed password written into the code. An attacker can forge credentials and impersonate any user.",
    developerGuidance: "JWT signing secrets must be generated with at least 256 bits of cryptographically secure randomness and loaded from environment variables.",
    oneClickAiPrompt: "Replace hardcoded secret literal in jwt.sign and jwt.verify with process.env.JWT_SIGNING_SECRET.",
    executiveSummary: "Authentication token signature key is hardcoded. Attackers can forge valid JSON Web Tokens for arbitrary user IDs including system administrators.",
    riskImpact: "Complete authentication bypass and universal account takeover.",
    threatVector: "Off-line token forgery using publicly known signing secret.",
  },
  {
    id: "COD-005",
    ruleId: "COD-005",
    severity: "High",
    layer: "Website",
    title: "Cookie Issued Without Secure or HttpOnly Flags",
    location: "api/auth/login.ts",
    line: 45,
    status: "Open",
    cwe: "CWE-614: Sensitive Cookie in HTTPS Session Without 'Secure' Attribute",
    technology: "HTTP / Express",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `res.cookie('auth_session', sessionId, { path: '/', maxAge: 86400000 });`,
    clientExplanation: "User login session cookies lack browser defense flags, allowing them to be transmitted over unencrypted connections or read by unauthorized scripts.",
    developerGuidance: "Add httpOnly: true, secure: true, and sameSite: 'lax' to all session cookie issuance logic.",
    oneClickAiPrompt: "Update cookie configuration to include httpOnly: true, secure: process.env.NODE_ENV === 'production', and sameSite: 'strict'.",
    executiveSummary: "Session identification cookies lack mandatory security attributes (HttpOnly, Secure, SameSite), exposing sessions to client-side scripts and downgrade attacks.",
    riskImpact: "Session hijacking via cross-site scripting or unencrypted WiFi sniffing.",
    threatVector: "Man-in-the-middle transmission interception or client-side JavaScript theft.",
  },
  {
    id: "COD-004",
    ruleId: "COD-004",
    severity: "High",
    layer: "Server and API",
    title: "Unprotected Administrative Endpoint Without Auth Middleware",
    location: "routes/admin.ts",
    line: 12,
    status: "Open",
    cwe: "CWE-306: Missing Authentication for Critical Function",
    technology: "Express / REST API",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `router.delete('/users/purge-all', async (req, res) => { await db.users.truncate(); });`,
    clientExplanation: "A high-privilege system administration URL can be called by anyone without verifying if they are logged in or possess administrator authority.",
    developerGuidance: "Attach authentication middleware (verifyToken) and role-based authorization guards (requireRole('ADMIN')) to all admin router groups.",
    oneClickAiPrompt: "Add authMiddleware and requireAdminRole guards to router.delete('/users/purge-all').",
    executiveSummary: "Destructive administrative endpoint is accessible without authentication token verification, allowing unauthorized data purge.",
    riskImpact: "Catastrophic data loss and operational disruption.",
    threatVector: "Direct HTTP DELETE request from any unauthenticated client.",
  },
  {
    id: "COD-003",
    ruleId: "COD-003",
    severity: "High",
    layer: "Website",
    title: "Permissive Wildcard Cross-Origin Resource Sharing (CORS)",
    location: "server.ts",
    line: 28,
    status: "Open",
    cwe: "CWE-942: Permissive Cross-domain Policy with Untrusted Domains",
    technology: "CORS / Node.js",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `app.use(cors({ origin: '*', credentials: true }));`,
    clientExplanation: "The web server permits any third-party website on the internet to read sensitive student data on behalf of a logged-in visitor.",
    developerGuidance: "Never pair origin: '*' with credentials: true. Explicitly declare approved domain origins in an allowlist array.",
    oneClickAiPrompt: "Replace wildcard CORS with explicit allowedOrigins array containing institutional domain names.",
    executiveSummary: "Wildcard CORS policy combined with credential forwarding exposes protected API responses to malicious third-party origins.",
    riskImpact: "Cross-origin data exfiltration from authenticated student and employee sessions.",
    threatVector: "Drive-by exploitation via malicious third-party web pages visited by logged-in users.",
  },
  {
    id: "CFG-003",
    ruleId: "CFG-003",
    severity: "High",
    layer: "Code",
    title: "Dockerfile ENV Direct Sensitive Credential Assignment",
    location: "Dockerfile",
    line: 6,
    status: "Open",
    cwe: "CWE-526: Cleartext Storage of Sensitive Information in an Environment Variable",
    technology: "Docker / Alpine",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `ENV ADMIN_PASSWORD=VPL_FAKE_docker_env_pw_192847`,
    clientExplanation: "An administrator password was written into the container blueprint, making it visible to anyone who inspects the built container image layers.",
    developerGuidance: "Avoid ENV declarations for sensitive values in Dockerfile. Pass credentials at container runtime via secret volumes or orchestrator secrets.",
    oneClickAiPrompt: "Remove ENV ADMIN_PASSWORD from Dockerfile and update deployment manifests to supply value via runtime environment variables.",
    executiveSummary: "Container build recipe bakes sensitive credentials directly into image metadata layers where docker history reveals them.",
    riskImpact: "Secret leakage across all public or private container registries where the image is pushed.",
    threatVector: "Image layer inspection via `docker history` or registry analysis.",
  },
  {
    id: "CFG-001",
    ruleId: "CFG-001",
    severity: "Medium",
    layer: "Code",
    title: "Debug / Development Mode Committed to Archive",
    location: "config/environment.ts",
    line: 4,
    status: "Open",
    cwe: "CWE-489: Active Debug Code",
    technology: "TypeScript / Node.js",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `export const DEBUG_MODE = true;
export const VERBOSE_STACK_TRACES = true;`,
    clientExplanation: "The software was built with developer debug mode switched on. If an error happens, technical system details and internal paths are displayed to visitors.",
    developerGuidance: "Ensure DEBUG_MODE evaluates to false in production builds and disable stack trace output in API error responses.",
    oneClickAiPrompt: "Set DEBUG_MODE to process.env.NODE_ENV !== 'production' and sanitize error responses.",
    executiveSummary: "Application configuration leaves diagnostic debugging enabled in release build, printing internal stack traces on runtime errors.",
    riskImpact: "Information disclosure aiding attackers in mapping internal server architecture.",
    threatVector: "Triggering 500 errors to inspect detailed server stack traces.",
  },
  {
    id: "DBA-001",
    ruleId: "DBA-001",
    severity: "Medium",
    layer: "Database",
    title: "Row Level Security (RLS) Disabled on Sensitive Table",
    location: "migrations/003_students.sql",
    line: 14,
    status: "Open",
    cwe: "CWE-284: Improper Access Control",
    technology: "PostgreSQL / Supabase",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `ALTER TABLE student_records DISABLE ROW LEVEL SECURITY;`,
    clientExplanation: "Protective access barriers on student records were turned off, allowing anyone connected to the database to view all students' private information.",
    developerGuidance: "Enable Row Level Security on all user-facing tables and define explicit SELECT, INSERT, UPDATE policies matching auth.uid().",
    oneClickAiPrompt: "ALTER TABLE student_records ENABLE ROW LEVEL SECURITY; and create policy for authenticated users.",
    executiveSummary: "Student record table has Row Level Security disabled, permitting unrestricted queries across tenant boundaries.",
    riskImpact: "Unauthorized access to confidential student demographic and academic records.",
    threatVector: "Direct API query to Supabase PostgREST endpoint.",
  },
  {
    id: "DBA-002",
    ruleId: "DBA-002",
    severity: "Medium",
    layer: "Database",
    title: "Permissive Database Policy Allows Global Read",
    location: "migrations/004_grades.sql",
    line: 22,
    status: "Open",
    cwe: "CWE-285: Improper Authorization",
    technology: "PostgreSQL / RLS",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `CREATE POLICY "Allow public read" ON exam_grades FOR SELECT USING (true);`,
    clientExplanation: "The database rule permits all visitors to read examination grades without checking if they are the student who took the exam.",
    developerGuidance: "Restrict RLS policy USING clause to match auth.uid() = student_id or current_user_has_role('TEACHER').",
    oneClickAiPrompt: "Update policy on exam_grades to restrict access to authenticated owners and verified instructors.",
    executiveSummary: "Security policy evaluates to true for all queries, effectively neutralizing database access control on exam results.",
    riskImpact: "Confidentiality breach of institutional grade books and academic evaluations.",
    threatVector: "Unauthenticated REST queries to grades table.",
  },
  {
    id: "WEB-001",
    ruleId: "WEB-001",
    severity: "Medium",
    layer: "Website",
    title: "Missing Content Security Policy (CSP) Header",
    location: "next.config.mjs",
    line: 9,
    status: "Open",
    cwe: "CWE-693: Protection Mechanism Failure",
    technology: "HTTP Headers / Next.js",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `// Headers configuration lacks Content-Security-Policy definition`,
    clientExplanation: "Your website does not restrict where scripts can be loaded from. This increases the risk if a third-party library is hijacked.",
    developerGuidance: "Implement a Content-Security-Policy HTTP response header restricting script-src, style-src, and object-src to trusted origins.",
    oneClickAiPrompt: "Add Content-Security-Policy header in Next.js headers config restricting script-src to 'self' and trusted CDNs.",
    executiveSummary: "HTTP response headers lack Content-Security-Policy directive, leaving the frontend vulnerable to rogue script execution.",
    riskImpact: "Execution of malicious scripts if an injection flaw occurs in any UI component.",
    threatVector: "Third-party supply chain script tampering.",
  },
  {
    id: "WEB-002",
    ruleId: "WEB-002",
    severity: "Medium",
    layer: "Website",
    title: "Missing Strict-Transport-Security (HSTS) Header",
    location: "server.ts",
    line: 52,
    status: "Open",
    cwe: "CWE-523: Unprotected Transport of Sensitive Information",
    technology: "HTTP / TLS",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `// Strict-Transport-Security header not configured in middleware`,
    clientExplanation: "The web server does not force web browsers to always connect via encrypted HTTPS, leaving visitors vulnerable on public WiFi networks.",
    developerGuidance: "Configure Strict-Transport-Security header with max-age=31536000; includeSubDomains; preload.",
    oneClickAiPrompt: "Add Helmet middleware with strict hsts options enabled (maxAge: 31536000, includeSubDomains: true).",
    executiveSummary: "Absence of HSTS header permits protocol downgrade attacks on unencrypted transport layers.",
    riskImpact: "SSL stripping attacks on public unencrypted wireless networks.",
    threatVector: "Active man-in-the-middle network tampering.",
  },
  {
    id: "HST-001",
    ruleId: "HST-001",
    severity: "Medium",
    layer: "Hosting",
    title: "Legacy TLS 1.0 & 1.1 Protocols Permitted",
    location: "ingress/tls-config.yaml",
    line: 12,
    status: "Open",
    cwe: "CWE-326: Inadequate Encryption Strength",
    technology: "TLS / Ingress",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `minProtocolVersion: "TLSv1.0"`,
    clientExplanation: "The server allows older, outdated cryptographic protocols that have known security flaws and are forbidden under modern data regulations.",
    developerGuidance: "Enforce TLS 1.2 as minimum acceptable protocol version, preferably TLS 1.3.",
    oneClickAiPrompt: "Update ingress TLS settings to set minProtocolVersion: 'TLSv1.2' and disable weak cipher suites.",
    executiveSummary: "Web server accepts deprecated TLS 1.0 and 1.1 handshake negotiations vulnerable to POODLE and BEAST exploits.",
    riskImpact: "Non-compliance with PCI-DSS 4.0 and increased risk of session decryption.",
    threatVector: "Downgrade handshake coercion by adjacent network adversary.",
  },
  {
    id: "HST-002",
    ruleId: "HST-002",
    severity: "Low",
    layer: "Hosting",
    title: "Server Information Header Disclosure (Server: Apache/2.4.41)",
    location: "nginx.conf",
    line: 15,
    status: "Open",
    cwe: "CWE-200: Exposure of Sensitive Information",
    technology: "Nginx / Apache",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `Server: Apache/2.4.41 (Ubuntu)`,
    clientExplanation: "The server tells visitors exactly what web server software and operating system version it uses, making it easier for attackers to look up known exploits.",
    developerGuidance: "Configure server_tokens off; in Nginx configuration or Header unset Server in Apache.",
    oneClickAiPrompt: "Add server_tokens off; to nginx.conf http block to suppress server version banners.",
    executiveSummary: "Web server broadcasts software banner and exact patch version in HTTP response headers.",
    riskImpact: "Simplifies target reconnaissance for automated vulnerability scanners.",
    threatVector: "Version banner enumeration via automated HTTP HEAD probes.",
  },
  {
    id: "HST-003",
    ruleId: "HST-003",
    severity: "Low",
    layer: "Hosting",
    title: "DNS CAA (Certification Authority Authorization) Record Missing",
    location: "dns/zonefile",
    line: 1,
    status: "Fixed",
    cwe: "CWE-295: Improper Certificate Validation",
    technology: "DNS / Cloudflare",
    verifiedInBrowser: true,
    confidence: "High",
    maskedSnippet: `// No CAA records found for domain campusone.edu`,
    clientExplanation: "There are no domain rules specifying which certificate authorities are allowed to issue SSL certificates for your university domain.",
    developerGuidance: "Add CAA records to DNS specifying approved Certificate Authorities (e.g., letsencrypt.org, digicert.com).",
    oneClickAiPrompt: "Generate RFC 6844 compliant DNS CAA records authorizing Let's Encrypt and Cloudflare for certificate issuance.",
    executiveSummary: "Domain lacks CAA records, meaning any public Certificate Authority could theoretically issue certificates for the domain.",
    riskImpact: "Rogue or compromised CA could issue fraudulent certificates without authorization.",
    threatVector: "Compromised third-party Certificate Authority issuance.",
  }
];

export const getFindingById = (id: string): Finding | undefined => {
  return mockFindings.find(f => f.id.toLowerCase() === id.toLowerCase() || f.ruleId.toLowerCase() === id.toLowerCase());
};

export const severityCounts = {
  All: 48,
  Critical: 5,
  High: 23,
  Medium: 18,
  Low: 2
};

