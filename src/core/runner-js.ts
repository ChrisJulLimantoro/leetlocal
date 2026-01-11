import * as path from 'path';
import { TestCase } from './problem-loader';

export interface TestResult {
  passed: boolean;
  testIndex: number;
  input: any[];
  expected: any;
  actual: any;
  error?: string;
}

export class JavaScriptRunner {
  /**
   * Run tests for a JavaScript solution
   */
  runTests(solutionPath: string, tests: TestCase[]): TestResult[] {
    const absolutePath = path.resolve(solutionPath);
    
    // Clear require cache to get fresh module
    delete require.cache[absolutePath];

    let solutionFn: Function;
    try {
      solutionFn = require(absolutePath);
    } catch (error) {
      throw new Error(`Failed to load solution: ${error instanceof Error ? error.message : String(error)}`);
    }

    if (typeof solutionFn !== 'function') {
      throw new Error('Solution must export a function');
    }

    const results: TestResult[] = [];

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      
      try {
        // Execute function with test inputs
        const actual = solutionFn(...test.input);
        
        // Deep compare
        const passed = this.deepEqual(actual, test.output);

        results.push({
          passed,
          testIndex: i,
          input: test.input,
          expected: test.output,
          actual
        });
      } catch (error) {
        results.push({
          passed: false,
          testIndex: i,
          input: test.input,
          expected: test.output,
          actual: null,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return results;
  }

  /**
   * Deep equality check for test outputs
   */
  private deepEqual(a: any, b: any): boolean {
    if (a === b) return true;
    
    if (a == null || b == null) return false;
    
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!this.deepEqual(a[i], b[i])) return false;
      }
      return true;
    }
    
    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      
      if (keysA.length !== keysB.length) return false;
      
      for (const key of keysA) {
        if (!keysB.includes(key)) return false;
        if (!this.deepEqual(a[key], b[key])) return false;
      }
      return true;
    }
    
    return false;
  }
}
