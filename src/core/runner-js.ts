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
  runTests(solutionPath: string, tests: TestCase[], unordered: boolean = false): TestResult[] {
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
        
        // Deep compare (with optional unordered comparison)
        const passed = this.deepEqual(actual, test.output, unordered);

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
  private deepEqual(a: any, b: any, unordered: boolean = false): boolean {
    if (a === b) return true;
    
    if (a == null || b == null) return false;
    
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      
      // Unordered comparison: sort arrays before comparing
      if (unordered) {
        const sortedA = this.sortArrayDeep([...a]);
        const sortedB = this.sortArrayDeep([...b]);
        for (let i = 0; i < sortedA.length; i++) {
          if (!this.deepEqual(sortedA[i], sortedB[i], unordered)) return false;
        }
        return true;
      }
      
      // Ordered comparison
      for (let i = 0; i < a.length; i++) {
        if (!this.deepEqual(a[i], b[i], unordered)) return false;
      }
      return true;
    }
    
    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      
      if (keysA.length !== keysB.length) return false;
      
      for (const key of keysA) {
        if (!keysB.includes(key)) return false;
        if (!this.deepEqual(a[key], b[key], unordered)) return false;
      }
      return true;
    }
    
    return false;
  }

  /**
   * Deep sort arrays for unordered comparison
   */
  private sortArrayDeep(arr: any[]): any[] {
    return arr.map(item => {
      if (Array.isArray(item)) {
        return this.sortArrayDeep([...item]);
      }
      return item;
    }).sort((a, b) => {
      const aStr = JSON.stringify(a);
      const bStr = JSON.stringify(b);
      return aStr.localeCompare(bStr);
    });
  }
}
