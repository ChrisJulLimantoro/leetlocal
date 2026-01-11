import * as fs from 'fs';
import * as path from 'path';
import { ProblemMetadata } from './problem-loader';

export class TemplateEngine {
  private templatesDir: string;

  constructor(templatesDir: string = 'templates') {
    this.templatesDir = path.resolve(templatesDir);
  }

  /**
   * Generate solution file from template
   */
  generateSolution(
    problem: ProblemMetadata,
    language: 'js' | 'python',
    outputPath: string
  ): void {
    const templateFile = language === 'js' ? 'js.solution.tpl' : 'python.solution.tpl';
    const templatePath = path.join(this.templatesDir, templateFile);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templateFile}`);
    }

    // Read template
    let template = fs.readFileSync(templatePath, 'utf-8');

    // Replace placeholders
    template = template.replace(/\{\{functionName\}\}/g, problem.function.name);
    template = template.replace(/\{\{params\}\}/g, problem.function.params.join(', '));

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Check if file already exists
    if (fs.existsSync(outputPath)) {
      throw new Error(`Solution already exists at ${outputPath}. Delete it first to regenerate.`);
    }

    // Write solution file
    fs.writeFileSync(outputPath, template, 'utf-8');
  }
}
