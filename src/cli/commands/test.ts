import { ProblemLoader } from '../../core/problem-loader';
import { JavaScriptRunner } from '../../core/runner-js';
import { PythonRunner } from '../../core/runner-python';
import { Reporter } from '../../core/reporter';
import { ComplexityAnalyzer } from '../../core/complexity-analyzer';
import { ProgressTracker } from '../../core/progress-tracker';

export async function testCommand(
  problemId: string,
  language: 'js' | 'python',
  options: { sample?: boolean } = {}
): Promise<void> {
  try {
    const loader = new ProblemLoader();
    const reporter = new Reporter();
    const analyzer = new ComplexityAnalyzer();
    const tracker = new ProgressTracker();

    // Load problem and tests
    const problem = loader.loadProblem(problemId);
    let tests = loader.loadTests(problemId);
    
    // Get solution path
    const solutionPath = loader.getSolutionPath(problemId, language);

    // Check if solution exists
    if (!loader.solutionExists(problemId, language)) {
      console.error(`Error: Solution not found at ${solutionPath}`);
      console.error(`\nGenerate it first: npm run gen ${problemId} -- --lang ${language}`);
      process.exit(1);
    }

    // Sampling mode: select 3 test cases
    const isSampling = options.sample === true;
    if (isSampling) {
      if (tests.length <= 3) {
        // If 3 or fewer tests, use all
        console.log(`📝 Using all ${tests.length} test(s) (sampling mode requested but ≤3 tests available)\n`);
      } else {
        // Sample: first, middle, last
        const middle = Math.floor(tests.length / 2);
        const sampledTests = [tests[0], tests[middle], tests[tests.length - 1]];
        console.log(`📝 Sampling 3 of ${tests.length} test cases: [1, ${middle + 1}, ${tests.length}]\n`);
        tests = sampledTests;
      }
    }

    console.log(`Running tests for "${problem.title}" (${language})...${isSampling ? ' [SAMPLING MODE]' : ''}\n`);

    // Analyze complexity
    const complexityAnalysis = analyzer.analyzeSolution(solutionPath, language);

    // Check if unordered comparison is enabled
    const unordered = problem.comparison?.unordered || false;

    // Run tests based on language
    let results;
    if (language === 'js') {
      const runner = new JavaScriptRunner();
      results = runner.runTests(solutionPath, tests, unordered);
    } else {
      const runner = new PythonRunner();
      results = await runner.runTests(solutionPath, tests, problem, unordered);
    }

    // Report results with complexity analysis
    reporter.report(results, problem.title, complexityAnalysis, isSampling);

    // Exit with error code if any tests failed
    const allPassed = results.every(r => r.passed);
    
    if (allPassed && !isSampling) {
      // Track progress only on full test suite pass (not sampling)
      const isNew = tracker.markSolved(
        problem.id,
        problem.title,
        problem.difficulty,
        language,
        complexityAnalysis
      );

      if (isNew) {
        console.log(`\n🎉 First time solving "${problem.title}" with ${language}! Progress tracked.\n`);
      }
    }

    if (!allPassed) {
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
