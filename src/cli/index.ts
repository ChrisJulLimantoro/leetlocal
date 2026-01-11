#!/usr/bin/env node

import { Command } from 'commander';
import { genCommand } from './commands/gen';
import { testCommand } from './commands/test';
import { listCommand } from './commands/list';
import { addCommand } from './commands/add';
import { statsCommand } from './commands/stats';

const program = new Command();

program
  .name('leetlocal')
  .description('Local LeetCode-style practice tool')
  .version('1.0.0');

// Add command
program
  .command('add')
  .description('Create a new problem with interactive prompts')
  .action(async () => {
    await addCommand();
  });

// Generate command
program
  .command('gen <problem-id>')
  .description('Generate solution template for a problem')
  .option('-l, --lang <language>', 'Language (js or python)', 'js')
  .action(async (problemId: string, options: { lang: string }) => {
    const lang = options.lang.toLowerCase();
    if (lang !== 'js' && lang !== 'python') {
      console.error('Error: Language must be "js" or "python"');
      process.exit(1);
    }
    await genCommand(problemId, lang as 'js' | 'python');
  });

// Test command
program
  .command('test <problem-id>')
  .description('Run tests for a problem solution')
  .option('-l, --lang <language>', 'Language (js or python)', 'js')
  .option('-s, --sample', 'Sample mode: run only 3 test cases for quick check', false)
  .action(async (problemId: string, options: { lang: string; sample: boolean }) => {
    const lang = options.lang.toLowerCase();
    if (lang !== 'js' && lang !== 'python') {
      console.error('Error: Language must be "js" or "python"');
      process.exit(1);
    }
    await testCommand(problemId, lang as 'js' | 'python', { sample: options.sample });
  });

// List command
program
  .command('list')
  .description('List all available problems')
  .action(async () => {
    await listCommand();
  });

// Stats command
program
  .command('stats')
  .description('Show progress statistics and generate GitHub markdown')
  .action(async () => {
    await statsCommand();
  });

program.parse(process.argv);
