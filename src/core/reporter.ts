import { TestResult } from './runner-js';
import { ComplexityAnalysis } from './complexity-analyzer';

export class Reporter {
  /**
   * Format and display test results with optional complexity analysis
   */
  report(
    results: TestResult[],
    problemTitle: string,
    complexity?: ComplexityAnalysis,
    isSampling: boolean = false
  ): void {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${problemTitle}${isSampling ? ' (SAMPLING MODE - 3 tests)' : ''}`);
    console.log('='.repeat(60));

    // Display complexity analysis if available
    if (complexity) {
      console.log('\n📊 Complexity Analysis:');
      console.log(`   Time:  ${this.green(complexity.time)}`);
      console.log(`   Space: ${this.green(complexity.space)}`);
      console.log('');
    }

    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;

    for (const result of results) {
      this.reportSingleTest(result);
    }

    console.log('\n' + '='.repeat(60));
    
    if (passedCount === totalCount) {
      console.log(this.green(`✓ All tests passed! (${passedCount}/${totalCount})`));
    } else {
      console.log(this.red(`✗ ${totalCount - passedCount} test(s) failed. (${passedCount}/${totalCount} passed)`));
    }
    
    console.log('='.repeat(60) + '\n');
  }

  /**
   * Report a single test result
   */
  private reportSingleTest(result: TestResult): void {
    const testNum = result.testIndex + 1;
    
    if (result.passed) {
      console.log(this.green(`\n✓ Test ${testNum}: PASSED`));
    } else {
      console.log(this.red(`\n✗ Test ${testNum}: FAILED`));
      console.log(`  Input:    ${this.formatValue(result.input)}`);
      console.log(`  Expected: ${this.formatValue(result.expected)}`);
      console.log(`  Actual:   ${this.formatValue(result.actual)}`);
      
      if (result.error) {
        console.log(this.red(`  Error:    ${result.error}`));
      }
    }
  }

  /**
   * Format value for display
   */
  private formatValue(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return JSON.stringify(value);
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  /**
   * Color text green
   */
  private green(text: string): string {
    return `\x1b[32m${text}\x1b[0m`;
  }

  /**
   * Color text red
   */
  private red(text: string): string {
    return `\x1b[31m${text}\x1b[0m`;
  }

  /**
   * Color text yellow
   */
  private yellow(text: string): string {
    return `\x1b[33m${text}\x1b[0m`;
  }
}
