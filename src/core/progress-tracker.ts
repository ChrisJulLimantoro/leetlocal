import * as fs from 'fs';
import * as path from 'path';
import { ProblemLoader } from './problem-loader';

interface SolvedProblem {
  id: string;
  title: string;
  difficulty: string;
  language: string;
  solvedAt: string;
  complexity?: {
    time: string;
    space: string;
  };
}

interface ProgressData {
  solved: SolvedProblem[];
}

export class ProgressTracker {
  private progressFile: string;

  constructor() {
    this.progressFile = path.resolve('.progress.json');
  }

  /**
   * Load progress data
   */
  private loadProgress(): ProgressData {
    if (!fs.existsSync(this.progressFile)) {
      return { solved: [] };
    }

    try {
      const content = fs.readFileSync(this.progressFile, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.warn('Warning: Could not load progress file, starting fresh');
      return { solved: [] };
    }
  }

  /**
   * Save progress data
   */
  private saveProgress(data: ProgressData): void {
    fs.writeFileSync(this.progressFile, JSON.stringify(data, null, 2) + '\n');
  }

  /**
   * Mark a problem as solved (only first time)
   */
  markSolved(
    problemId: string,
    title: string,
    difficulty: string,
    language: string,
    complexity?: { time: string; space: string }
  ): boolean {
    const progress = this.loadProgress();
    
    // Check if already solved with this language
    const alreadySolved = progress.solved.some(
      p => p.id === problemId && p.language === language
    );

    if (alreadySolved) {
      return false; // Already tracked
    }

    // Add new solved problem
    progress.solved.push({
      id: problemId,
      title,
      difficulty,
      language,
      solvedAt: new Date().toISOString(),
      complexity
    });

    this.saveProgress(progress);
    return true; // Newly tracked
  }

  /**
   * Get all solved problems
   */
  getSolved(): SolvedProblem[] {
    return this.loadProgress().solved;
  }

  /**
   * Get statistics
   */
  getStats() {
    const solved = this.getSolved();
    const loader = new ProblemLoader();
    const allProblems = loader.listProblems();

    // Count by difficulty
    const byDifficulty = {
      Easy: 0,
      Medium: 0,
      Hard: 0
    };

    // Count by language
    const byLanguage: Record<string, number> = {};

    // Get unique problem IDs
    const uniqueProblems = new Set<string>();

    solved.forEach(s => {
      uniqueProblems.add(s.id);
      byDifficulty[s.difficulty as keyof typeof byDifficulty]++;
      byLanguage[s.language] = (byLanguage[s.language] || 0) + 1;
    });

    // Get recent (last 5)
    const recent = [...solved]
      .sort((a, b) => new Date(b.solvedAt).getTime() - new Date(a.solvedAt).getTime())
      .slice(0, 5);

    return {
      total: allProblems.length,
      solved: uniqueProblems.size,
      byDifficulty,
      byLanguage,
      recent
    };
  }
}
