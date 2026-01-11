import { spawn } from 'child_process';
import * as path from 'path';
import { TestCase, ProblemMetadata } from './problem-loader';
import { TestResult } from './runner-js';

export class PythonRunner {
  /**
   * Run tests for a Python solution
   */
  async runTests(
    solutionPath: string,
    tests: TestCase[],
    problem: ProblemMetadata,
    unordered: boolean = false
  ): Promise<TestResult[]> {
    const absolutePath = path.resolve(solutionPath);
    
    // Create test harness Python script
    const testHarness = this.createTestHarness(absolutePath, tests, problem, unordered);

    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', ['-c', testHarness]);
      
      let stdout = '';
      let stderr = '';

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process exited with code ${code}\n${stderr}`));
          return;
        }

        try {
          const results = JSON.parse(stdout) as TestResult[];
          resolve(results);
        } catch (error) {
          reject(new Error(`Failed to parse test results: ${stdout}\n${stderr}`));
        }
      });

      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to spawn Python process: ${error.message}`));
      });
    });
  }

  /**
   * Create Python test harness script
   */
  private createTestHarness(
    solutionPath: string,
    tests: TestCase[],
    problem: ProblemMetadata,
    unordered: boolean = false
  ): string {
    const testsJson = JSON.stringify(tests);
    const functionName = problem.function.name;

    return `
import sys
import json
import traceback

# Import solution
sys.path.insert(0, '${path.dirname(solutionPath)}')
from solution import ${functionName}

tests = ${testsJson}
results = []

def sort_deep(obj):
    """Deep sort for unordered comparison"""
    if isinstance(obj, list):
        return sorted([sort_deep(item) for item in obj], key=lambda x: json.dumps(x, sort_keys=True))
    return obj

def deep_equal(a, b, unordered=${unordered ? 'True' : 'False'}):
    """Deep equality check"""
    if unordered and isinstance(a, list) and isinstance(b, list):
        return sort_deep(a) == sort_deep(b)
    
    if type(a) != type(b):
        return False
    if isinstance(a, list):
        if len(a) != len(b):
            return False
        return all(deep_equal(x, y, unordered) for x, y in zip(a, b))
    if isinstance(a, dict):
        if set(a.keys()) != set(b.keys()):
            return False
        return all(deep_equal(a[k], b[k], unordered) for k in a.keys())
    return a == b

for i, test in enumerate(tests):
    try:
        actual = ${functionName}(*test['input'])
        expected = test['output']
        passed = deep_equal(actual, expected)
        
        results.append({
            'passed': passed,
            'testIndex': i,
            'input': test['input'],
            'expected': expected,
            'actual': actual
        })
    except Exception as e:
        results.append({
            'passed': False,
            'testIndex': i,
            'input': test['input'],
            'expected': test['output'],
            'actual': None,
            'error': str(e)
        })

print(json.dumps(results))
`;
  }
}
