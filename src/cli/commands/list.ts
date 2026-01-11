import { ProblemLoader } from '../../core/problem-loader';

export async function listCommand(): Promise<void> {
  try {
    const loader = new ProblemLoader();
    const problems = loader.listProblems();

    if (problems.length === 0) {
      console.log('No problems found in the problems/ directory.');
      return;
    }

    console.log('\nAvailable Problems:\n');
    console.log('─'.repeat(70));
    console.log(
      padRight('ID', 20) +
      padRight('Title', 35) +
      padRight('Difficulty', 15)
    );
    console.log('─'.repeat(70));

    for (const problem of problems) {
      const difficultyColor = getDifficultyColor(problem.difficulty);
      console.log(
        padRight(problem.id, 20) +
        padRight(problem.title, 35) +
        difficultyColor(problem.difficulty)
      );
    }

    console.log('─'.repeat(70));
    console.log(`\nTotal: ${problems.length} problem(s)\n`);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

function padRight(str: string, length: number): string {
  return str + ' '.repeat(Math.max(0, length - str.length));
}

function getDifficultyColor(difficulty: string): (text: string) => string {
  const lower = difficulty.toLowerCase();
  if (lower === 'easy') {
    return (text: string) => `\x1b[32m${text}\x1b[0m`; // Green
  } else if (lower === 'medium') {
    return (text: string) => `\x1b[33m${text}\x1b[0m`; // Yellow
  } else if (lower === 'hard') {
    return (text: string) => `\x1b[31m${text}\x1b[0m`; // Red
  }
  return (text: string) => text;
}
