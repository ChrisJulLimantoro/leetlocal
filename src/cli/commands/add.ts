import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

interface ProblemConfig {
  id: string;
  title: string;
  difficulty: string;
  functionName: string;
  params: string[];
}

export async function addCommand(): Promise<void> {
  console.log('📝 Create a new LeetCode problem\n');

  const config = await promptForProblemDetails();
  
  try {
    createProblemStructure(config);
    console.log(`\n✅ Problem "${config.title}" created successfully!`);
    console.log(`\n📁 Location: problems/${config.id}/`);
    console.log('\n📝 Next steps:');
    console.log(`   1. Edit problems/${config.id}/problem.md - Add problem description`);
    console.log(`   2. Edit problems/${config.id}/problem.json - Verify function signature`);
    console.log(`   3. Edit problems/${config.id}/tests.json - Add test cases`);
    console.log(`   4. Generate solution: npm run gen ${config.id} -- --lang js`);
  } catch (error) {
    console.error(`\n❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

async function promptForProblemDetails(): Promise<ProblemConfig> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        resolve(answer.trim());
      });
    });
  };

  try {
    const title = await question('Problem title: ');
    if (!title) throw new Error('Title is required');

    const id = await question(`Problem ID (default: ${slugify(title)}): `) || slugify(title);
    
    const difficulty = await question('Difficulty (Easy/Medium/Hard): ');
    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      throw new Error('Difficulty must be Easy, Medium, or Hard');
    }

    const functionName = await question(`Function name (default: ${camelCase(title)}): `) || camelCase(title);
    
    const paramsInput = await question('Function parameters (comma-separated, e.g., nums, target): ');
    const params = paramsInput.split(',').map(p => p.trim()).filter(p => p);

    if (params.length === 0) {
      throw new Error('At least one parameter is required');
    }

    rl.close();

    return { id, title, difficulty, functionName, params };
  } catch (error) {
    rl.close();
    throw error;
  }
}

function createProblemStructure(config: ProblemConfig): void {
  const problemDir = path.resolve('problems', config.id);
  
  // Check if problem already exists
  if (fs.existsSync(problemDir)) {
    throw new Error(`Problem "${config.id}" already exists`);
  }

  // Create directory structure
  fs.mkdirSync(problemDir, { recursive: true });
  fs.mkdirSync(path.join(problemDir, 'solutions', 'js'), { recursive: true });
  fs.mkdirSync(path.join(problemDir, 'solutions', 'python'), { recursive: true });

  // Create .gitkeep files
  fs.writeFileSync(path.join(problemDir, 'solutions', 'js', '.gitkeep'), '# Solutions directory for JavaScript\n');
  fs.writeFileSync(path.join(problemDir, 'solutions', 'python', '.gitkeep'), '# Solutions directory for Python\n');

  // Generate problem.md from template
  const problemMdTemplate = fs.readFileSync('templates/problem.md.tpl', 'utf-8');
  const problemMd = problemMdTemplate
    .replace(/{PROBLEM_TITLE}/g, config.title)
    .replace(/{DIFFICULTY}/g, config.difficulty);
  fs.writeFileSync(path.join(problemDir, 'problem.md'), problemMd);

  // Generate problem.json from template
  const problemJsonTemplate = fs.readFileSync('templates/problem.json.tpl', 'utf-8');
  const paramsJson = JSON.stringify(config.params);
  const problemJson = problemJsonTemplate
    .replace(/{PROBLEM_ID}/g, config.id)
    .replace(/{PROBLEM_TITLE}/g, config.title)
    .replace(/{DIFFICULTY}/g, config.difficulty)
    .replace(/{FUNCTION_NAME}/g, config.functionName)
    .replace(/\["{PARAM1}", "{PARAM2}"\]/g, paramsJson);
  fs.writeFileSync(path.join(problemDir, 'problem.json'), problemJson);

  // Copy tests.json template
  const testsTemplate = fs.readFileSync('templates/tests.json.tpl', 'utf-8');
  fs.writeFileSync(path.join(problemDir, 'tests.json'), testsTemplate);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function camelCase(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (chr) => chr.toLowerCase());
}
