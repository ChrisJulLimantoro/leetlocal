# LeetLocal

A local LeetCode-style practice tool that lets you solve coding problems offline with your favorite editor.

## Features

- 📝 **File-based problems** - Problems defined in simple Markdown and JSON
- 🚀 **Multi-language support** - JavaScript and Python (easily extensible)
- ⚡ **Local testing** - Run test cases instantly without internet
- 📊 **Complexity analysis** - Automatic O(n) time/space complexity detection
- 🎯 **Sampling mode** - Quick check with 3 test cases for fast feedback
- 🎯 **Simple workflow** - Generate templates, code, and test
- 🔧 **Clone-and-run** - No database, no web UI, just files

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd leetlocal

# Install dependencies
npm install

# Build TypeScript (optional, ts-node handles this automatically)
npm run build
```

## Quick Start

### 1. List available problems

```bash
npm run list
```

### 2. Create a new problem (optional)

```bash
npm run add
```

This will interactively prompt you for:
- Problem title
- Problem ID (auto-generated from title)
- Difficulty (Easy/Medium/Hard)
- Function name
- Function parameters

### 3. Generate a solution template

```bash
# JavaScript
npm run gen two-sum -- --lang js

# Python
npm run gen two-sum -- --lang python

# Or use the Makefile
make gen problem=two-sum lang=js
```

### 3. Implement your solution

Edit the generated file:
- JavaScript: `problems/two-sum/solutions/js/solution.js`
- Python: `problems/two-sum/solutions/python/solution.py`

### 4. Run tests

```bash
# JavaScript - all tests
npm run test two-sum -- --lang js

# Python - all tests
npm run test two-sum -- --lang python

# Quick check with sampling (3 tests)
npm run test two-sum -- --lang js --sample

# Or use the Makefile
make test problem=two-sum lang=js
```

**Output includes:**
- 📊 Detected time/space complexity (e.g., O(n), O(n²), O(1))
- ✓ Pass/fail for each test
- Detailed error messages for failures

## Project Structure

```
leetlocal/
├── problems/              # Problem definitions
│   └── two-sum/
│       ├── problem.md     # Human-readable description
│       ├── problem.json   # Metadata and function signature
│       ├── tests.json     # Test cases
│       └── solutions/     # Your solutions (gitignored)
│           ├── js/
│           └── python/
├── templates/             # Solution templates
│   ├── js.solution.tpl
│   └── python.solution.tpl
├── src/                   # CLI source code
│   ├── cli/              # Command handlers
│   └── core/             # Core engine
└── package.json
```

## Adding a New Problem

### Easy Way: Use the `add` Command

```bash
npm run add
```

Follow the interactive prompts to create a new problem with all necessary files.

### Manual Way

### 1. Create problem directory

```bash
mkdir -p problems/your-problem/solutions/{js,python}
```

### 2. Create `problem.md`

Write a clear problem description with examples and constraints.

### 3. Create `problem.json`

```json
{
  "id": "your-problem",
  "title": "Your Problem Title",
  "difficulty": "Easy|Medium|Hard",
  "function": {
    "name": "yourFunctionName",
    "params": ["param1", "param2"]
  }
}
```

### 4. Create `tests.json`

```json
[
  {
    "input": [arg1, arg2],
    "output": expectedOutput
  }
]
```

## Example Workflow

```bash
# 1. See what's available
npm run list

# 2. Create a new problem (optional)
npm run add
# Follow prompts: title, difficulty, function name, parameters

# 3. Edit the problem files
# - problems/<id>/problem.md - Add description and examples
# - problems/<id>/tests.json - Add test cases

# 4. Generate JavaScript solution
npm run gen <problem-id> -- --lang js

# 5. Edit problems/<problem-id>/solutions/js/solution.js
# Implement your solution...

# 6. Test it
npm run test <problem-id> -- --lang js

# Output:
# ✓ Test 1: PASSED
# ✓ Test 2: PASSED
# ✓ Test 3: PASSED
# ✓ All tests passed! (3/3)
```

## Requirements

- **Node.js** 16+ (for JavaScript solutions and CLI)
- **Python** 3.7+ (for Python solutions)

## CLI Commands

### `add`

Create a new problem with interactive prompts.

**Example:**
```bash
npm run add
```

**Prompts:**
- Problem title
- Problem ID (auto-generated, can customize)
- Difficulty (Easy/Medium/Hard)
- Function name (auto-generated, can customize)
- Function parameters (comma-separated)

**Creates:**
- `problems/<id>/problem.md` - Problem description template
- `problems/<id>/problem.json` - Problem metadata
- `problems/<id>/tests.json` - Empty test case template
- `problems/<id>/solutions/js/` - JavaScript solutions directory
- `problems/<id>/solutions/python/` - Python solutions directory

---

### `gen <problem-id> --lang <js|python>`

Generate a solution template from the problem definition.

**Options:**
- `-l, --lang <language>` - Language (js or python), default: js

**Example:**
```bash
npm run gen two-sum -- --lang python
```

### `test <problem-id> --lang <js|python> [--sample]`

Run test cases for your solution.

**Options:**
- `-l, --lang <language>` - Language (js or python), default: js
- `-s, --sample` - Sampling mode: run only 3 test cases for quick check

**Features:**
- Automatic time/space complexity analysis
- Detailed error reporting with input/expected/actual
- Sampling mode for fast feedback

**Example:**
```bash
# Run all tests
npm run test two-sum -- --lang js

# Quick check with 3 tests
npm run test two-sum -- --lang js --sample
```

### `list`

List all available problems with difficulty levels.

**Example:**
```bash
npm run list
```

---

### `stats`

Show progress statistics and generate GitHub-ready markdown.

**Example:**
```bash
npm run stats
```

**Output:**
- Overall progress (solved/total)
- Breakdown by difficulty
- Breakdown by language
- Recent activity with complexity
- **GitHub markdown** ready to copy/paste

**Features:**
- Tracks only first successful solution per language
- Only tracks full test suite passes (not sampling mode)
- Generates progress bar and stats for GitHub profile
- Shows complexity analysis for recent problems

**Tip:** Run after solving problems, then copy the markdown section to your GitHub profile README!

## Makefile Shortcuts

```bash
# Show all available commands
make help

# Create a new problem
make add

# Generate solution
make gen problem=two-sum lang=js

# Run tests
make test problem=two-sum lang=python

# List problems
make list

# Show progress stats
make stats
```

## Tips

- Solutions are gitignored by default - commit your own if desired
- Use `problem.md` to read the problem description
- Test cases are in `tests.json` - add more if needed
- Templates are in `templates/` - customize them to your style

## What's NOT Included

- Web UI
- Database
- Online judge integration
- Authentication
- Docker containers

This is intentionally minimal - just you, your editor, and the terminal.

## License

MIT
