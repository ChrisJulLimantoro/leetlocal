#!/usr/bin/env ts-node

import { LeetCodeAPI } from './leetcode-api';
import { ProblemGenerator } from './problem-generator';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: npm run scrape <problem-slug>');
    console.error('Example: npm run scrape two-sum');
    process.exit(1);
  }

  const slug = args[0];
  
  console.log(`\n🔍 Fetching problem: ${slug}...`);

  try {
    const api = new LeetCodeAPI();
    const generator = new ProblemGenerator();

    // Fetch problem from LeetCode
    const problem = await api.fetchProblem(slug);
    
    console.log(`✓ Found: ${problem.title} (${problem.difficulty})`);

    // Extract function signature (prefer JavaScript, fallback to Python)
    const jsSnippet = problem.codeSnippets.find(s => s.langSlug === 'javascript');
    const pySnippet = problem.codeSnippets.find(s => s.langSlug === 'python3' || s.langSlug === 'python');
    
    let functionName: string;
    let params: string[];

    if (jsSnippet) {
      const sig = api.extractFunctionSignature(jsSnippet.code, 'javascript');
      functionName = sig.name;
      params = sig.params;
      console.log(`✓ Extracted function: ${functionName}(${params.join(', ')})`);
    } else if (pySnippet) {
      const sig = api.extractFunctionSignature(pySnippet.code, 'python');
      functionName = sig.name;
      params = sig.params;
      console.log(`✓ Extracted function: ${functionName}(${params.join(', ')})`);
    } else {
      throw new Error('No JavaScript or Python code snippet found');
    }

    // Generate files
    console.log('\n📝 Generating files...');
    
    const markdown = generator.generateMarkdown(problem);
    const problemJson = generator.generateProblemJson(problem, functionName, params);
    const testsJson = generator.generateTestsJson(problem.exampleTestcases);

    // Create directory and write files
    generator.createProblemDirectory(problem.titleSlug);
    generator.writeProblemFiles(problem.titleSlug, markdown, problemJson, testsJson);

    console.log(`\n✅ Problem "${problem.title}" created successfully!`);
    console.log(`\n📁 Location: problems/${problem.titleSlug}/`);
    console.log('\n📝 Next steps:');
    console.log(`   1. Review problems/${problem.titleSlug}/problem.md`);
    console.log(`   2. Add test cases to problems/${problem.titleSlug}/tests.json`);
    console.log(`   3. Generate solution: npm run gen ${problem.titleSlug} -- --lang js`);

  } catch (error) {
    console.error(`\n❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main();
