import { ProgressTracker } from '../../core/progress-tracker';

export async function statsCommand(): Promise<void> {
  try {
    const tracker = new ProgressTracker();
    const stats = tracker.getStats();

    console.log('\n' + '='.repeat(60));
    console.log('📊 LeetLocal Progress Stats');
    console.log('='.repeat(60));

    // Overall stats
    console.log(`\n📈 Overall Progress: ${stats.solved}/${stats.total} problems solved`);
    
    // Difficulty breakdown
    console.log('\n🎯 By Difficulty:');
    console.log(`   🟢 Easy:   ${stats.byDifficulty.Easy}`);
    console.log(`   🟡 Medium: ${stats.byDifficulty.Medium}`);
    console.log(`   🔴 Hard:   ${stats.byDifficulty.Hard}`);

    // Language breakdown
    console.log('\n💻 By Language:');
    Object.entries(stats.byLanguage).forEach(([lang, count]) => {
      const langName = lang === 'js' ? 'JavaScript' : 'Python';
      console.log(`   ${langName}: ${count} solution(s)`);
    });

    // Recent activity
    if (stats.recent.length > 0) {
      console.log('\n🕐 Recent Activity:');
      stats.recent.forEach((problem, index) => {
        const date = new Date(problem.solvedAt).toLocaleDateString();
        const complexity = problem.complexity 
          ? ` - ${problem.complexity.time} time, ${problem.complexity.space} space`
          : '';
        console.log(`   ${index + 1}. ${problem.title} (${problem.difficulty}) - ${problem.language}${complexity}`);
        console.log(`      Solved: ${date}`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n📋 GitHub Markdown (copy to your profile README):');
    console.log('='.repeat(60));
    console.log(generateMarkdown(stats));
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

function generateMarkdown(stats: any): string {
  const progressBar = generateProgressBar(stats.solved, stats.total);
  
  let markdown = `
## 🧠 LeetCode Practice Progress

📊 **Stats**
- Total Problems: ${stats.total}
- ✅ Solved: ${stats.solved}
- Progress: ${progressBar} ${Math.round((stats.solved / stats.total) * 100)}%

🎯 **By Difficulty**
- 🟢 Easy: ${stats.byDifficulty.Easy}
- 🟡 Medium: ${stats.byDifficulty.Medium}
- 🔴 Hard: ${stats.byDifficulty.Hard}

💻 **Languages**
`;

  Object.entries(stats.byLanguage).forEach(([lang, count]) => {
    const langName = lang === 'js' ? 'JavaScript' : 'Python';
    markdown += `- ${langName}: ${count} solution(s)\n`;
  });

  if (stats.recent.length > 0) {
    markdown += '\n📈 **Recent Activity**\n';
    stats.recent.slice(0, 5).forEach((problem: any) => {
      const complexity = problem.complexity 
        ? ` - ${problem.complexity.time} time`
        : '';
      markdown += `- ${problem.title} (${problem.difficulty})${complexity}\n`;
    });
  }

  return markdown;
}

function generateProgressBar(solved: number, total: number): string {
  const percentage = total > 0 ? solved / total : 0;
  const filled = Math.round(percentage * 10);
  const empty = 10 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}
