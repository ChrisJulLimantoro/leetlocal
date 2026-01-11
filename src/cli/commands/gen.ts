import { ProblemLoader } from '../../core/problem-loader';
import { TemplateEngine } from '../../core/template-engine';

export async function genCommand(problemId: string, language: 'js' | 'python'): Promise<void> {
  try {
    const loader = new ProblemLoader();
    const engine = new TemplateEngine();

    // Load problem metadata
    const problem = loader.loadProblem(problemId);
    
    // Get solution path
    const solutionPath = loader.getSolutionPath(problemId, language);

    // Generate solution
    engine.generateSolution(problem, language, solutionPath);

    console.log(`✓ Generated ${language} solution for "${problem.title}"`);
    console.log(`  Location: ${solutionPath}`);
    console.log(`\nNext steps:`);
    console.log(`  1. Implement your solution in ${solutionPath}`);
    console.log(`  2. Run tests: npm run test ${problemId} -- --lang ${language}`);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
