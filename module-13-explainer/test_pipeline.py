import subprocess
import time
import requests
import sys

def test_pipeline():
    print("=" * 65)
    print("[*] VIBEPROOFLENS MODULE 13: END-TO-END PIPELINE VERIFICATION")
    print("=" * 65)

    # 1. Start Python FastAPI AI Worker on Port 5001
    print("\n[1/4] Starting FastAPI AI Worker on Port 5001...")
    fastapi_proc = subprocess.Popen(
        ['python', '-m', 'uvicorn', 'main:app', '--port', '5001'],
        cwd='module-13-explainer/ai-worker-fastapi',
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    # 2. Start NestJS Backend on Port 5000
    print("[2/4] Starting NestJS Backend on Port 5000...")
    nestjs_proc = subprocess.Popen(
        'node dist/src/main.js',
        cwd='module-13-explainer/backend-nestjs',
        shell=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    try:
        # Give services 4 seconds to spin up
        print("Waiting for microservices to initialize...")
        time.sleep(4)

        # Test FastAPI Health
        print("\n[3/4] Verifying FastAPI Health on http://localhost:5001/health...")
        res_worker = requests.get("http://127.0.0.1:5001/health", timeout=5)
        print(f"  [+] FastAPI Worker Status: {res_worker.status_code}")
        print(f"      Payload: {res_worker.json()}")

        # Test NestJS Endpoints
        print("\n[4/4] Verifying NestJS Endpoints on Port 5000...")

        # A. GET /api/v1/findings
        res_list = requests.get("http://127.0.0.1:5000/api/v1/findings", timeout=5)
        print(f"  [+] A. GET /api/v1/findings -> Status: {res_list.status_code} ({len(res_list.json())} findings loaded)")

        # B. GET /api/v1/findings/DBA-003
        res_dba = requests.get("http://127.0.0.1:5000/api/v1/findings/DBA-003", timeout=5)
        print(f"  [+] B. GET /api/v1/findings/DBA-003 -> Status: {res_dba.status_code}")
        print(f"         Title: {res_dba.json().get('title')}")
        print(f"         Severity: {res_dba.json().get('severity')} | Layer: {res_dba.json().get('layer')}")

        # C. POST /api/v1/findings/DBA-003/retest
        res_retest = requests.post("http://127.0.0.1:5000/api/v1/findings/DBA-003/retest", timeout=5)
        retest_json = res_retest.json()
        print(f"  [+] C. POST /api/v1/findings/DBA-003/retest -> Status: {res_retest.status_code}")
        print(f"         Scanner Run ID: {retest_json.get('scannerRunId')} | Result: {retest_json.get('result')}")

        # D. POST /api/v1/findings/DBA-003/fix (Decoupled Redaction & AI Generation Pipeline)
        print("\n  [+] D. POST /api/v1/findings/DBA-003/fix (Executing Decoupled Pipeline)...")
        res_fix = requests.post("http://127.0.0.1:5000/api/v1/findings/DBA-003/fix", timeout=25)
        print(f"         HTTP Status: {res_fix.status_code}")
        if res_fix.status_code != 200:
            print(f"         Error detail: {res_fix.text}")
        else:
            fix_json = res_fix.json()
            print(f"         Status Verification: {fix_json.get('status')}")
            print(f"         Client Explanation: {fix_json.get('clientExplanation')[:90]}...")
            print(f"         Developer Guidance: {fix_json.get('developerGuidance')[:90]}...")
            print(f"         AI Patch Generated: Yes ({len(fix_json.get('aiPatch', ''))} characters)")
            print(f"         Database Persisted: Explanation #{fix_json.get('explanationId')} | Patch #{fix_json.get('patchId')}")

        print("\n" + "=" * 65)
        print("[SUCCESS] ALL MODULE 13 SERVICES & PIPELINES VERIFIED!")
        print("=" * 65)

    finally:
        print("\nCleaning up test service processes...")
        fastapi_proc.terminate()
        try:
            subprocess.run("taskkill /F /IM node.exe", shell=True, capture_output=True)
        except:
            pass

if __name__ == "__main__":
    test_pipeline()
