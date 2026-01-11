import * as fs from 'fs';
import * as path from 'path';

export interface ProblemMetadata {
  id: string;
  title: string;
  difficulty: string;
  function: {
    name: string;
    params: string[];
  };
  comparison?: {
    unordered?: boolean; // If true, array order doesn't matter
  };
}

export interface TestCase {
  input: any[];
  output: any;
}

export class ProblemLoader {
  private problemsDir: string;

  constructor(problemsDir: string = 'problems') {
    this.problemsDir = path.resolve(problemsDir);
  }

  /**
   * Load problem metadata from problem.json
   */
  loadProblem(problemId: string): ProblemMetadata {
    const problemPath = path.join(this.problemsDir, problemId, 'problem.json');
    
    if (!fs.existsSync(problemPath)) {
      throw new Error(`Problem not found: ${problemId}`);
    }

    try {
      const content = fs.readFileSync(problemPath, 'utf-8');
      const metadata = JSON.parse(content) as ProblemMetadata;
      
      // Validate structure
      if (!metadata.id || !metadata.title || !metadata.function?.name || !metadata.function?.params) {
        throw new Error(`Invalid problem.json format for ${problemId}`);
      }

      return metadata;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in problem.json for ${problemId}`);
      }
      throw error;
    }
  }

  /**
   * Load test cases from tests.json
   */
  loadTests(problemId: string): TestCase[] {
    const testsPath = path.join(this.problemsDir, problemId, 'tests.json');
    
    if (!fs.existsSync(testsPath)) {
      throw new Error(`Tests not found for problem: ${problemId}`);
    }

    try {
      const content = fs.readFileSync(testsPath, 'utf-8');
      const tests = JSON.parse(content) as TestCase[];
      
      if (!Array.isArray(tests) || tests.length === 0) {
        throw new Error(`tests.json must contain an array of test cases for ${problemId}`);
      }

      return tests;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in tests.json for ${problemId}`);
      }
      throw error;
    }
  }

  /**
   * List all available problems
   */
  listProblems(): ProblemMetadata[] {
    if (!fs.existsSync(this.problemsDir)) {
      return [];
    }

    const entries = fs.readdirSync(this.problemsDir, { withFileTypes: true });
    const problems: ProblemMetadata[] = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        try {
          const metadata = this.loadProblem(entry.name);
          problems.push(metadata);
        } catch (error) {
          // Skip invalid problems
          console.warn(`Warning: Skipping invalid problem directory: ${entry.name}`);
        }
      }
    }

    return problems;
  }

  /**
   * Get solution path for a problem
   */
  getSolutionPath(problemId: string, language: 'js' | 'python'): string {
    const ext = language === 'js' ? 'js' : 'py';
    return path.join(this.problemsDir, problemId, 'solutions', language, `solution.${ext}`);
  }

  /**
   * Check if solution exists
   */
  solutionExists(problemId: string, language: 'js' | 'python'): boolean {
    const solutionPath = this.getSolutionPath(problemId, language);
    return fs.existsSync(solutionPath);
  }
}
