import * as fs from 'fs';
import * as path from 'path';

export interface ComplexityAnalysis {
  time: string;
  space: string;
}

export class ComplexityAnalyzer {
  /**
   * Analyze solution code for time and space complexity
   */
  analyzeSolution(
    solutionPath: string,
    language: 'js' | 'python'
  ): ComplexityAnalysis {
    const code = fs.readFileSync(solutionPath, 'utf-8');

    if (language === 'js') {
      return this.analyzeJavaScript(code);
    } else {
      return this.analyzePython(code);
    }
  }

  /**
   * Analyze JavaScript code for complexity patterns
   */
  private analyzeJavaScript(code: string): { time: string; space: string } {
    let time = 'O(n)';
    let space = 'O(n)';

    // Check for nested loops (O(n²) time)
    const nestedLoopPattern = /for\s*\([^)]*\)\s*{[^}]*for\s*\([^)]*\)/s;
    if (nestedLoopPattern.test(code)) {
      time = 'O(n²)';
    }

    // Check for hash map/set usage (O(n) space)
    const hasMapOrSet = /new\s+(Map|Set)\(\)/.test(code);
    const hasSingleLoop = /for\s*\(/.test(code);
    
    if (hasMapOrSet && hasSingleLoop) {
      time = 'O(n)';
      space = 'O(n)';
    }

    // Check for constant space (no data structures)
    if (!hasMapOrSet && !/\[\]/.test(code)) {
      space = 'O(1)';
    }

    return { time, space };
  }

  /**
   * Analyze Python code for complexity patterns
   */
  private analyzePython(code: string): { time: string; space: string } {
    let time = 'O(n)';
    let space = 'O(n)';

    // Check for nested loops (O(n²) time)
    const nestedLoopPattern = /for\s+\w+\s+in\s+[^:]+:[^]*?for\s+\w+\s+in\s+/s;
    if (nestedLoopPattern.test(code)) {
      time = 'O(n²)';
    }

    // Check for dictionary usage (O(n) space)
    const hasDict = /\{\s*\}|dict\(\)/.test(code);
    const hasSingleLoop = /for\s+\w+\s+in\s+/.test(code);
    
    if (hasDict && hasSingleLoop) {
      time = 'O(n)';
      space = 'O(n)';
    }

    // Check for constant space
    if (!hasDict && !/\[\s*\]|list\(\)/.test(code)) {
      space = 'O(1)';
    }

    return { time, space };
  }
}
