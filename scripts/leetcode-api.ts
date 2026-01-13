import axios from 'axios';

const LEETCODE_API = 'https://leetcode.com/graphql';

export interface LeetCodeProblem {
  questionId: string;
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  difficulty: string;
  content: string;
  exampleTestcases: string;
  codeSnippets: Array<{
    lang: string;
    langSlug: string;
    code: string;
  }>;
}

export class LeetCodeAPI {
  /**
   * Fetch problem details by slug
   */
  async fetchProblem(slug: string): Promise<LeetCodeProblem> {
    const query = `
      query getQuestionDetail($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          questionFrontendId
          title
          titleSlug
          difficulty
          content
          exampleTestcases
          codeSnippets {
            lang
            langSlug
            code
          }
        }
      }
    `;

    try {
      const response = await axios.post(LEETCODE_API, {
        query,
        variables: { titleSlug: slug }
      });

      if (response.data.errors) {
        throw new Error(`GraphQL Error: ${JSON.stringify(response.data.errors)}`);
      }

      const problem = response.data.data.question;
      
      if (!problem) {
        throw new Error(`Problem "${slug}" not found`);
      }

      return problem;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch problem: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Extract function signature from code snippet
   */
  extractFunctionSignature(code: string, language: 'javascript' | 'python'): {
    name: string;
    params: string[];
  } {
    if (language === 'javascript') {
      // Match: function name(param1, param2) or var name = function(param1, param2)
      const match = code.match(/(?:function\s+(\w+)|var\s+(\w+)\s*=\s*function)\s*\(([^)]*)\)/);
      if (match) {
        const name = match[1] || match[2];
        const params = match[3]
          .split(',')
          .map(p => p.trim().split(/\s+/)[0])
          .filter(p => p);
        return { name, params };
      }
    } else if (language === 'python') {
      // Match: def name(self, param1, param2):
      const match = code.match(/def\s+(\w+)\s*\(([^)]*)\)/);
      if (match) {
        const name = match[1];
        const params = match[2]
          .split(',')
          .map(p => p.trim().split(':')[0].trim())
          .filter(p => p && p !== 'self');
        return { name, params };
      }
    }

    throw new Error(`Could not extract function signature from ${language} code`);
  }
}
