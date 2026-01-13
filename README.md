# LeetLocal

A local LeetCode-style practice tool that lets you solve coding problems offline with your favorite editor.

## Why LeetLocal?

- 🏠 **Practice Offline** - Work on problems without internet dependency
- 📊 **Track Progress** - Automatic complexity analysis and progress tracking
- 💾 **Version Control** - Commit your solutions and track improvements over time
- 🚀 **Fast Iteration** - Instant local testing with sampling mode
- 🎯 **Personal Growth** - See your learning journey with stats and GitHub integration

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

### 2. Scrape a problem from LeetCode (optional)

```bash
npm run scrape <problem-slug>
# Example: npm run scrape reverse-integer
```

This will:
- Fetch problem from LeetCode's GraphQL API
- Generate `problem.md` with description
- Generate `problem.json` with metadata
- Create `tests.json` template (you'll need to add test cases)

### 3. Create a new problem manually (optional)

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
│       └── solutions/     # Your solutions (tracked in git!)
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

**After creating a problem:**

1. **Edit `problem.md`** - Add detailed description, examples, constraints
2. **Edit `tests.json`** - Add test cases with input/output pairs
3. **Generate solution** - `npm run gen <problem-id> -- --lang js`
4. **Add helpers if needed** - For tree/list problems, add imports:

   **Python:**
   ```python
   import sys
   sys.path.insert(0, '../../helpers')
   from python_helpers import TreeNode, ListNode
   ```

   **JavaScript:**
   ```javascript
   const { TreeNode, ListNode } = require('../../helpers/js_helpers');
   ```

5. **Implement solution** - Write your algorithm
6. **Test** - `npm run test <problem-id> -- --lang js`

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

# 4. Generate solution template
npm run gen <problem-id> -- --lang js

# 5. Add helper imports if needed (tree/list problems)
# For Python:
#   import sys
#   sys.path.insert(0, '../../helpers')
#   from python_helpers import TreeNode, ListNode
#
# For JavaScript:
#   const { TreeNode, ListNode } = require('../../helpers/js_helpers');

# 6. Implement your solution
# Edit problems/<problem-id>/solutions/js/solution.js

# 7. Test it
npm run test <problem-id> -- --lang js

# Output:
# 📊 Complexity Analysis: O(n) time, O(n) space
# ✓ Test 1: PASSED
# ✓ Test 2: PASSED
# ✓ All tests passed!
```

## Requirements

- **Node.js** 16+ (for JavaScript solutions and CLI)
- **Python** 3.7+ (for Python solutions)

## CLI Commands

### `scrape <problem-slug>`

Fetch a problem from LeetCode and generate files automatically.

**Example:**
```bash
npm run scrape reverse-integer
npm run scrape two-sum
```

**What it does:**
- Fetches problem from LeetCode GraphQL API
- Converts HTML description to Markdown
- Extracts function signature automatically
- Creates problem directory structure
- Generates `problem.md`, `problem.json`, `tests.json`

**Note:** You'll need to manually add test cases to `tests.json` as LeetCode's API doesn't provide all test cases publicly.

---

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

## Helper Classes and Libraries

LeetLocal keeps solution templates **clean and minimal**. Helper classes are available **only when you need them**.

### When to Use Helpers

✅ **Use helpers for:**
- Binary tree problems → `TreeNode`
- Linked list problems → `ListNode`
- Graph problems → `Node`
- Doubly-linked list → `DLNode`

❌ **Don't use for:**
- Array/string problems
- Hash map/set problems
- Math/number problems

### How to Use Helper Classes

Helper classes are in the `helpers/` directory. Import them only when needed:

#### Python

```python
# Add at the top of your solution
import sys
sys.path.insert(0, '../../helpers')
from python_helpers import TreeNode, ListNode

def isSymmetric(root):
    # Now you can use TreeNode
    if not root:
        return True
    # ... your solution
```

**Available classes:**
- `TreeNode` - Binary tree node (val, left, right)
- `ListNode` - Singly-linked list (val, next)
- `DLNode` - Doubly-linked list (val, prev, next)
- `Node` - Graph node (val, neighbors)

#### JavaScript

```javascript
// Add at the top of your solution
const { TreeNode, ListNode } = require('../../helpers/js_helpers');

module.exports = function isSymmetric(root) {
  // Now you can use TreeNode
  if (!root) return true;
  // ... your solution
};
```

**Available classes:**
- `TreeNode` - Binary tree node (val, left, right)
- `ListNode` - Singly-linked list (val, next)
- `DLNode` - Doubly-linked list (val, prev, next)
- `Node` - Graph node (val, neighbors)

### Using Standard Libraries

**Python:**
```python
import heapq
import collections
from typing import List, Optional, Dict
from itertools import combinations
```

**JavaScript:**
```javascript
// Built-in modules work automatically
const map = new Map();
const set = new Set();
```

### Example: Tree Problem

**Simple array problem (no helpers needed):**
```python
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        # ... clean, no imports
```

**Tree problem (with helpers):**
```python
import sys
sys.path.insert(0, '../../helpers')
from python_helpers import TreeNode

def isSymmetric(root):
    def isMirror(left, right):
        if not left and not right:
            return True
        # ... use TreeNode
```

See [HELPERS.md](file:///Users/ceje/leetlocal/HELPERS.md) for more examples.

## Tips

- **Commit your solutions** - Your solutions are now tracked in git, commit often to see your progress!
- **Use sampling mode** - Quick iteration with `--sample` flag during development
- **Review complexity** - Learn to recognize O(n) patterns in your code
- **Track stats** - Run `npm run stats` to see your progress and share on GitHub
- **Scrape problems** - Use `npm run scrape` to quickly add new problems from LeetCode

## Personal Progress Tracking

This tool is designed for personal learning and progress tracking:

1. **Solutions are committed** - Track your journey and see improvements over time
2. **Progress file** - `.progress.json` stores your solved problems
3. **GitHub integration** - Share your stats on your profile README
4. **Local first** - Practice offline, commit when ready

## Project Purpose

LeetLocal started as a personal tool to track LeetCode progress locally and evolved into a full practice environment. It's designed to help you:

- Practice problems offline with your favorite editor
- Track your learning journey in version control
- Analyze your solution complexity automatically
- Build a portfolio of solutions you can commit and share
- Generate GitHub-ready stats to showcase your progress

Feel free to fork and customize for your own learning needs!

## License

MIT
