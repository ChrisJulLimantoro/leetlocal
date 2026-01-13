import * as fs from 'fs';
import * as path from 'path';
import TurndownService from 'turndown';
import { LeetCodeProblem } from './leetcode-api';

export class ProblemGenerator {
  private turndown: TurndownService;

  constructor() {
    this.turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });
  }

  /**
   * Generate problem.md from LeetCode HTML content
   */
  generateMarkdown(problem: LeetCodeProblem): string {
    // Convert HTML to Markdown
    let markdown = this.turndown.turndown(problem.content);

    // Add header
    const header = `# ${problem.title}\n\n**Difficulty:** ${problem.difficulty}\n\n`;
    
    return header + markdown;
  }

  /**
   * Generate problem.json
   */
  generateProblemJson(
    problem: LeetCodeProblem,
    functionName: string,
    params: string[]
  ): string {
    const problemJson = {
      id: problem.titleSlug,
      title: problem.title,
      difficulty: problem.difficulty,
      function: {
        name: functionName,
        params: params
      }
    };

    return JSON.stringify(problemJson, null, 2) + '\n';
  }

  /**
   * Generate tests.json from example test cases
   */
  generateTestsJson(exampleTestcases: string): string {
    // LeetCode provides test cases as newline-separated values
    // Parse them into input/output pairs
    const lines = exampleTestcases.trim().split('\n');
    
    // For now, create a basic structure
    // User will need to manually add expected outputs
    const tests = [
      {
        input: this.parseTestInput(lines[0] || '[]'),
        output: null // User needs to fill this
      }
    ];

    return JSON.stringify(tests, null, 2) + '\n';
  }

  /**
   * Parse test input from string
   */
  private parseTestInput(input: string): any {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(input);
      // Wrap in array if not already
      return Array.isArray(parsed) ? [parsed] : [[parsed]];
    } catch {
      // If parsing fails, return as string wrapped in array
      return [[input]];
    }
  }

  /**
   * Create problem directory structure
   */
  createProblemDirectory(problemId: string): void {
    const problemDir = path.resolve('problems', problemId);
    
    if (fs.existsSync(problemDir)) {
      throw new Error(`Problem directory "${problemId}" already exists`);
    }

    // Create directories
    fs.mkdirSync(problemDir, { recursive: true });
    fs.mkdirSync(path.join(problemDir, 'solutions', 'js'), { recursive: true });
    fs.mkdirSync(path.join(problemDir, 'solutions', 'python'), { recursive: true });

    // Create .gitkeep files
    fs.writeFileSync(
      path.join(problemDir, 'solutions', 'js', '.gitkeep'),
      '# Solutions directory for JavaScript\n'
    );
    fs.writeFileSync(
      path.join(problemDir, 'solutions', 'python', '.gitkeep'),
      '# Solutions directory for Python\n'
    );
  }

  /**
   * Write problem files
   */
  writeProblemFiles(
    problemId: string,
    markdown: string,
    problemJson: string,
    testsJson: string
  ): void {
    const problemDir = path.resolve('problems', problemId);

    fs.writeFileSync(path.join(problemDir, 'problem.md'), markdown);
    fs.writeFileSync(path.join(problemDir, 'problem.json'), problemJson);
    fs.writeFileSync(path.join(problemDir, 'tests.json'), testsJson);
  }
}
