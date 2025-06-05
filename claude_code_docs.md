# AutoZone Claude Code Developer Documentation v1.0

**Published:** May 2025

## Quick Navigation

**Essential for Everyone:**
- [Security Setup](#security-guidance-using-vertex-ai) (Required)
- [Installation](#installation) (Required)
- [Memory Management](#claude-code-memory-overview)
- [Commands Reference](#commands-reference-card)
- [Common Pitfalls](#common-pitfalls) (Avoid these!)
- [Troubleshooting](#troubleshooting)

**For Teams:**
- [Team Best Practices](#best-practices-using-claude-code-as-a-team)
- [GitLab Integration](#using-claude-code-cli-with-gitlab)

**Advanced Features:**
- [Sub-Agents Deep Dive](#understanding-claude-code-sub-agents)
- [Git Worktrees](#git-worktrees-and-claude-code-cli)
- [Advanced Workflows](#medium-to-large-development-workflows)
- [Security Considerations](#security-considerations)

**Concepts & Summary:**
- [Natural Language Workflow](#natural-language-workflow-with-claude-code)
- [Summary](#summary)

---

## 🔒 Security Guidance: Using Vertex AI

> **⚠️ Required Setup**: This section is mandatory for secure enterprise usage

To securely connect Claude Code and protect your codebase privacy, route all interactions through Google Cloud's Vertex AI instead of directly connecting to Anthropic with an API key. Before running Claude Code:

* Set environment variables with your Google Cloud Project ID
* Authenticate with your Google Cloud account

This ensures Claude Code uses Vertex AI by default, keeping your data within secure GCP infrastructure.

#### Environment Variables Setup

**Required Environment Variables**

```bash
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_VERTEX_PROJECT_ID=azsb-it-genai
```

**Optional**

```bash
export ANTHROPIC_VERTEX_BASE_URL=<proxy-url>
export DISABLE_PROMPT_CACHING=1
```

**Apply Changes**

```bash
source ~/.zshrc  # or your shell profile
```

---

## ⚡ Installation

#### Prerequisites

* macOS 10.15+, Ubuntu 20.04+, Debian 10+, or Windows via WSL
* 4GB+ RAM
* Node.js 18+
* Git 2.23+ (optional)
* Google Cloud SDK (`gcloud`)
* GitLab CLI (optional)
* Internet connection

#### Windows

```bash
wsl --install
nvm install 18
npm install -g @anthropic-ai/claude-code
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_VERTEX_PROJECT_ID=azsb-it-genai
gcloud auth application-default login
claude
```

### Linux

```bash
nvm install 18
npm install -g @anthropic-ai/claude-code
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_VERTEX_PROJECT_ID=azsb-it-genai
gcloud auth application-default login
claude
```

### Mac

```bash
nvm install 18
npm install -g @anthropic-ai/claude-code
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_VERTEX_PROJECT_ID=azsb-it-genai
gcloud auth application-default login
claude
```

---

## 🧠 Claude Code Memory Overview

### Memory Configuration Files

- **`./CLAUDE.md`**: Project-specific memory and context
- **`~/.claude/CLAUDE.md`**: User preferences and global settings
- **`./CLAUDE.local.md`**: Deprecated overrides (legacy support)

### Session-Based Memory

Memory persists throughout your Claude Code session and includes:

- **Project context**: Understanding of your codebase structure and goals
- **Environment configuration**: Tool preferences and setup details
- **File structure awareness**: Knowledge of your project's organization

**Important**: Exit Claude Code to reset memory. Use memory strategically to retain context across related tasks.

### Checking Your Setup with `/status`

Use the `/status` command to get detailed information about your current Claude Code configuration:

```
/status
```

The status command provides comprehensive information including:

- **Claude Code Version**: Current version (e.g., v1.0.5)
- **Working Directory**: Your current project location
- **IDE Integration**: VS Code extension installation status
- **API Configuration**: Vertex AI setup details
- **Model Information**: Current Claude model in use

#### Example Status Output

```
What's new:
• Fixed a bug where MCP tool errors weren't being parsed correctly

Claude Code Status v1.0.5

Working Directory
└ /Users/loyd.horn/AutoZoneWorkSpace/wms-order-processing-handler

IDE Integration • /config
✓ Connected to VS Code extension
└ Installed VS Code extension version 1.0.5 (server version: 1.0.2)

API Configuration
└ API Provider: Google Vertex AI
└ GCP Project: azsb-it-genai
└ Default region: us-east5

Model • /model
└ Default (claude-sonnet-4@20250514)
```

### Example CLAUDE.md Configuration

Here's an example of a well-structured `CLAUDE.md` file for a Node.js project:

```markdown
# E-Commerce API Project

## Project Overview
RESTful API for e-commerce platform built with Node.js, Express, and PostgreSQL.

## Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Caching**: Redis for session management
- **Testing**: Jest with Supertest

## Coding Standards
- Use TypeScript strict mode
- Follow Airbnb ESLint configuration
- Implement comprehensive error handling with custom error classes
- Write unit tests for all business logic (minimum 80% coverage)
- Use async/await instead of Promises
- Validate all inputs with Joi schemas

## API Design Patterns
- RESTful endpoints following OpenAPI 3.0 spec
- Consistent response format: `{ success: boolean, data: any, error?: string }`
- Use HTTP status codes appropriately
- Implement pagination for list endpoints
- Version APIs with /v1, /v2 prefixes

## Database Conventions
- Table names: snake_case
- Column names: snake_case
- Primary keys: id (UUID)
- Timestamps: created_at, updated_at
- Soft deletes: deleted_at

## Security Requirements
- Rate limiting on all endpoints
- Input sanitization for XSS prevention
- SQL injection protection via ORM
- CORS configuration for production
- Helmet.js for security headers

## Development Workflow
1. Create feature branch from main
2. Implement feature with tests
3. Run linting and tests locally
4. Create pull request with description
5. Require peer review before merging
6. Deploy to staging for QA testing
```

---

## 📋 Commands Reference Card

#### Core Commands

- **`/help`** - Display available commands and usage information
- **`/status`** - Show current configuration, model, and environment details
- **`/memory`** - View and edit current memory and context information
- **`/config`** - Access configuration settings
- **`/model`** - View or change the active Claude model
- **`/clear`** - Clear conversation history and free up context
- **`/compact`** - Clear conversation history but keep a summary in context
- **`/exit`** - Exit the REPL

#### Development Commands

- **`/review`** - Review a pull request
- **`/pr-comments`** - Get comments from a GitHub pull request
- **`/init`** - Initialize a new CLAUDE.md file with codebase documentation
- **`/cost`** - Show the total cost and duration of the current session
- **`/doctor`** - Check the health of your Claude Code installation

#### Task Management Commands

- **`/resume`** - Resume a previously interrupted task or conversation
- **`/continue`** - Continue with the current task or workflow
- **`/pause`** - Pause the current operation (useful for long-running tasks)
- **`/stop`** - Stop the current operation immediately

#### Tool and Integration Commands

- **`/allowed-tools`** - List all currently allowed tools
- **`/ide`** - Manage IDE integrations and show status
- **`/mcp`** - Show MCP server connection status
- **`/terminal-setup`** - Install Shift+Enter key binding for newlines
- **`/vim`** - Toggle between Vim and Normal editing modes

#### Auto-Edit Functionality

**Shift + Tab**: Trigger auto-edit mode for quick file modifications
- Automatically detects files that need changes
- Applies edits without explicit approval for simple modifications
- Useful for repetitive tasks like updating imports, fixing formatting, or applying consistent changes
- Can be disabled in settings if manual approval is preferred

```bash
# Example: After describing changes needed
"Update all import statements to use absolute paths"
# Press Shift + Tab to auto-apply changes across files
```

#### Usage Modes

- **Interactive REPL**: `claude` (start interactive session)
- **Non-interactive**: `claude -p "question"` (single command)
- **Bash commands**: `!ls` (run shell commands from within Claude)

#### GitLab Integration Tip

The `/review` and `/pr-comments` commands are worth trying. By default, they use `gh` (GitHub CLI), but you can instruct Claude Code to switch tools:
```
use glab to /pr-comment
```
Claude Code will then switch to GitLab CLI for these operations.

---

## ❗ Common Pitfalls

> **💡 Read this section to avoid frustrating issues!**

#### Running Multiple Claude Instances in Same Directory

**Problem**: Opening multiple terminals and running `claude` in the same project directory
```bash
# Terminal 1
cd /my-project
claude

# Terminal 2 (same directory - DON'T DO THIS)
cd /my-project  
claude
```

**Why it's problematic**:
- Shared `.claude` context leads to conflicting states
- Agent memory gets jumbled between sessions
- Risk of overwriting files simultaneously
- Unpredictable behavior when both instances try to execute tasks

**Solution**: Use Git worktrees for parallel work
```bash
git worktree add ../my-project-feature -b feature/new-feature
cd ../my-project-feature
claude
```

#### Forgetting to Update CLAUDE.md When Project Changes

**Problem**: Major architectural changes without updating project documentation
- Added new frameworks or dependencies
- Changed coding standards or patterns
- Refactored project structure
- Updated development workflows

**Why it matters**: Claude Code relies on `CLAUDE.md` for context about your project standards and architecture

```bash
# Use Claude Code to help maintain documentation
/memory
# Then update your CLAUDE.md with recent changes
```

#### Not Restarting After Major Updates

**Problem**: Continuing to use Claude Code after updating the CLI or VS Code extension without restarting

**Symptoms**:
- New features not working
- Extension connection issues
- Unexpected behavior or errors
- Version mismatches in `/status`

**Solution**: Always restart after updates
```bash
claude --version  # Check version first
# Exit Claude Code completely
# Restart VS Code if using the extension
claude  # Start fresh session
```

#### Mixing GitHub and GitLab Commands

**Problem**: Switching between `gh` and `glab` commands without telling Claude Code

**Solution**: Be explicit about tool switching
```bash
# Tell Claude Code when switching tools
use glab for pull requests from now on
# or
switch to github cli for this task
```

#### Ignoring Context Limits

**Problem**: Trying to process extremely large codebases or files without breaking them down

**Solution**: Break down large tasks
```bash
# Instead of "analyze entire codebase"
analyze the authentication module in src/auth/
# Then move to next module
now analyze the database layer in src/db/
```

---

## 👥 Best Practices Using Claude Code as a Team

### Example: Feature Planning from Jira Ticket

**Sample Jira Ticket - User Profile Enhancement**

```
TICKET: SHOP-2847
Title: Add User Avatar Upload and Profile Customization

Acceptance Criteria:
✓ AC-1: Users can upload profile images (JPG/PNG, max 5MB)
✓ AC-2: Images are automatically resized to 200x200px and 50x50px thumbnails  
✓ AC-3: Users can set display name, bio (max 500 chars), and timezone
✓ AC-4: Profile changes are saved with optimistic UI updates
✓ AC-5: Avatar changes trigger email notification to user
✓ AC-6: Profile data is validated on both client and server side
✓ AC-7: Existing users get default avatar if none uploaded
```

**Effective Claude Code Planning Prompt:**

```
I need to implement the user profile enhancement feature based on SHOP-2847. 

Create a detailed implementation plan covering all acceptance criteria:

1. Avatar upload system with image validation and resizing
2. Profile editing form with display name, bio, and timezone
3. Optimistic UI updates with rollback on failure
4. Email notification system for avatar changes
5. Client/server validation for all profile fields
6. Default avatar handling for existing users

Please spin up 5 agents to create a comprehensive plan that includes:
- Database schema changes needed
- API endpoints and request/response formats
- Frontend component structure and state management
- Image processing pipeline and storage strategy
- Validation rules and error handling
- Email template and notification logic
- Migration strategy for existing users
- Testing approach for each acceptance criteria

Use our existing patterns from the user authentication module and follow our coding standards from CLAUDE.md. Present the full plan for my approval before starting implementation.
```

**Why This Approach Works:**
- **AC-Driven**: Every acceptance criteria is explicitly addressed
- **Comprehensive Scope**: Covers technical implementation and business logic
- **Context-Aware**: References existing patterns and standards
- **Approval Gate**: Human review before execution begins
- **Multi-Agent Planning**: Complex feature broken down by expertise areas

### Code Review Processes

When using Claude Code in team environments:

- **Include Claude Code suggestions in PRs** - Mention when Claude Code helped with implementation
- **Review Claude-generated code thoroughly** - Treat it like any other code contribution
- **Document Claude Code workflows** - Share effective prompts and patterns with the team
- **Establish review criteria** - Define what constitutes acceptable Claude Code assistance

### Team Onboarding

When onboarding new team members to Claude Code:

- **Share team `CLAUDE.md` templates** - Provide standardized project configurations
- **Document effective prompts** - Create a shared knowledge base of proven patterns
- **Establish clear workflows** - Define when and how to use Claude Code effectively

---

## 🔀 Using Claude Code CLI with GitLab

### Initial Setup

```bash
brew install glab
# or
curl -s https://git.io/install-glab | sudo bash
glab --version
glab auth login
```

### Natural Language Commands

**GitLab Command Flow**

```
Natural Language Input → Claude Code Processing → GitLab CLI Execution

"create a branch"     →  [Claude interprets]  →  glab branch create feature/xyz
"commit changes"      →  [Claude analyzes]    →  glab commit -m "descriptive message"  
"push to remote"      →  [Claude executes]    →  glab push origin feature/xyz
"create mr"           →  [Claude formats]     →  glab mr create --title "..." --description "..."
"run tests"           →  [Claude triggers]    →  glab ci trigger
```

Claude Code understands task-oriented language for GitLab operations:

- **"create a branch"** - Creates and switches to a new feature branch
- **"commit"** - Stages and commits changes with appropriate messaging
- **"push"** - Pushes current branch to remote repository
- **"mr"** - Creates merge requests with proper formatting
- **"lint"** - Runs code quality checks and formatting

Claude processes these commands contextually and executes the appropriate `glab` commands automatically.

### Best Practices for GitLab Integration

1. **Authenticate first**: Always run `glab auth login` before launching Claude Code
2. **Leverage automation**: Claude will use `glab` commands where applicable for Git operations
3. **Include workflows**: Document GitLab-related workflows in your `CLAUDE.md` file

---

## 🌳 Git WorkTrees and Claude Code CLI

### Benefits of Git WorkTrees

Git worktrees provide powerful parallel development capabilities:

- **Parallel work**: Develop on multiple branches simultaneously
- **Isolated directories**: Each branch gets its own working directory
- **Scoped configuration**: Separate `CLAUDE.md` files for each worktree

### Creating Worktrees

**Git Worktrees vs Single Directory Comparison**

```
❌ PROBLEMATIC: Single Directory
┌─────────────────────────────────┐
│         my-project/             │
│  ┌─────────────┐ ┌─────────────┐│
│  │ Terminal 1  │ │ Terminal 2  ││
│  │   claude    │ │   claude    ││
│  └─────────────┘ └─────────────┘│
│                                 │
│    ⚠️  Shared .claude context   │
│    • Conflicting edits          │
│    • Jumbled chat histories     │
│    • Agent state conflicts      │
└─────────────────────────────────┘

✅ RECOMMENDED: Git Worktrees
┌─────────────────────────────────┐
│      my-project/ (main)         │
└─────────────────────────────────┘
           │                │
    ┌─────────────────┐ ┌─────────────────┐
    │  feature-auth/  │ │  feature-api/   │
    │  ┌───────────┐  │ │  ┌───────────┐  │
    │  │  claude   │  │ │  │  claude   │  │
    │  └───────────┘  │ │  └───────────┘  │
    │                 │ │                 │
    │ Isolated context│ │ Isolated context│
    └─────────────────┘ └─────────────────┘

Benefits:
• Separate working directories
• Individual .claude configurations  
• Clean task separation
• Parallel development
```

**Commands:**
```bash
git worktree add ../my-project-feature -b feature/new-feature
cd ../my-project-feature
claude
# Each worktree gets its own isolated Claude Code environment
```

```bash
git worktree add ../my-feature-dir -b feature/my-new-branch
cd ../my-feature-dir
claude
```

### Natural Language Worktree Creation

Instead of remembering Git worktree commands, simply ask Claude:

```
create a new worktree from main (or current branch) and name it feature/abc
```

Claude Code will create a new directory within your current working directory. To isolate your next environment, simply exit Claude Code, navigate one level down, and launch Claude from there. You now have a clean, dedicated space to spin up another 20 subagents.

### Worktree Management Tips

- **Naming convention**: Name worktrees after their branches for clarity
- **Dedicated CLAUDE.md**: Keep a `CLAUDE.md` file in each worktree root
- **Clean removal**: Use `git worktree remove <path>` when finished

---

## 🤖 Understanding Claude Code Sub-Agents

### Sub-Agent Architecture

**Claude Code Sub-Agent System**

```
                    ┌─────────────────┐
                    │   Claude Code   │
                    │ Main Instance   │
                    └─────────┬───────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐        ┌──────▼──────┐        ┌────▼────┐
   │Sub-Agent│        │ Sub-Agent   │        │Sub-Agent│
   │    1    │        │      2      │   ...  │    N    │
   │Planning │        │  Frontend   │        │Database │
   └────┬────┘        └──────┬──────┘        └────┬────┘
        │                    │                    │
   ┌────▼────┐        ┌──────▼──────┐        ┌────▼────┐
   │Create   │        │Build React  │        │Design   │
   │Architect│        │Components   │        │Schema & │
   │Document │        │& Implement  │        │Migration│
   └─────────┘        └─────────────┘        └─────────┘

🔄 PARALLEL EXECUTION: All sub-agents work simultaneously
```

**Key Capabilities:**
- **Parallel Processing**: Multiple tasks execute at once
- **Task Distribution**: Complex projects split across agents  
- **Context Awareness**: Each agent knows project standards
- **Coordinated Execution**: Agents work together seamlessly

Claude Code's sub-agent system is a powerful feature that enables parallel task execution and significantly accelerates development workflows. When you request Claude Code to "spin up sub-agents," you're instructing it to create multiple independent AI agents that can work simultaneously on different aspects of your project.

### How Sub-Agents Work

- **Parallel Processing**: Sub-agents can work on different tasks simultaneously, rather than processing everything sequentially
- **Task Distribution**: Complex projects are automatically broken down and distributed across multiple agents
- **Contextual Awareness**: Each sub-agent maintains awareness of the overall project context and coding standards from your `CLAUDE.md` file
- **Coordinated Execution**: Sub-agents coordinate their work to avoid conflicts and ensure cohesive implementation

### Benefits of Using Sub-Agents

- **Speed**: Tasks that might take hours sequentially can be completed in parallel
- **Quality**: More agents thinking about different aspects often leads to better code quality and more thorough implementation
- **Scalability**: Can handle larger, more complex projects that would be overwhelming for a single agent
- **Efficiency**: Optimal resource utilization for development tasks

### When to Use Sub-Agents

Sub-agents are particularly effective for:
- Large feature implementations
- Code refactoring across multiple files
- Complex architectural changes
- Projects with multiple independent components
- Tasks requiring both planning and execution phases

The general rule: the more complex your project, the more sub-agents you should consider using (typically 5-20 for most scenarios).

### CLI Tool Integration

Claude Code can leverage various CLI tools to extend its capabilities beyond code editing. When you request an action that requires a specific tool, Claude Code can install and use the appropriate CLI utility automatically.

#### Example: PDF Text Extraction

When asked to extract text from a PDF file, Claude Code can install and use tools like `poppler-utils`:

```
• Good! Poppler has been installed successfully. Now let me extract the text from your PDF:

• Bash(pdftotext /Users/dino/Downloads/demo_pdf_file.pdf -)...
  Demo PDF File
  → +6 lines (ctrl+r to expand)
  - Email: john.doe@example.com
  - ID: 123456789

• Perfect! I've successfully extracted the text from your PDF. The document contains:
  - A demo PDF file for testing text extraction
  - Sample contact information for John Doe
  - Email: mailto:john.doe@example.com
  - ID: 123456789

Now I can answer any questions you have about this PDF content. What would you like to know?
```

#### How CLI Tool Integration Works

- **Automatic Detection**: Claude Code recognizes when a task requires external tools
- **Tool Installation**: Installs necessary CLI utilities (like `poppler-utils` for PDF processing)
- **Seamless Execution**: Runs the appropriate commands and processes the output
- **Context Integration**: Incorporates the results into the conversation for further analysis

#### Common CLI Tools Claude Code Can Use

- **PDF Processing**: `poppler-utils` (pdftotext, pdfinfo)
- **Image Analysis**: `imagemagick`, `exiftool`
- **Data Processing**: `jq`, `csvkit`, `xmlstarlet`
- **Network Tools**: `curl`, `wget`, `httpie`
- **File Processing**: `ffmpeg`, `pandoc`
- **Development Tools**: `gh`, `glab`, `docker`, `kubectl`

This integration makes Claude Code a powerful hub for data processing and analysis tasks beyond traditional coding.

---

## ⚙️ Medium to Large Development Workflows

### Planning and Execution Strategy

I always begin by having Claude Code generate a detailed implementation plan for my review and approval. Once the plan looks solid, I spin up 5 to 20 subagents to work in parallel—this significantly accelerates execution.

Create a comprehensive plan (note: we currently have access to Sonnet 4, though Opus is better suited for this kind of task). Since all coding standards, architectural guidelines, and project rules are documented in our `CLAUDE.md` file, Claude Code will have the necessary context.

### Example: Planning a User Authentication System

**Initial Planning Prompt:**
```
I need to implement a comprehensive user authentication system for our e-commerce platform. Please think hard and create a detailed implementation plan that covers:

1. JWT-based authentication with refresh tokens
2. Password reset functionality via email
3. Role-based access control (admin, customer, vendor)
4. Two-factor authentication using TOTP
5. Account lockout after failed attempts
6. Session management and logout

Please spin up 5 agents to deep think about this detailed plan, considering all the steps, security implications, database schema changes, API endpoints, middleware, testing strategies, and anything else that will help create a robust authentication system. 

Use our existing coding standards, architectural guidelines, and patterns from our CLAUDE.md file. Look at how we implemented the 'Payment Processing module' because we should follow similar patterns for error handling and validation.

Present this comprehensive plan to me for my review and approval before executing any code changes.
```

**Plan Approval:**
```
I approve the request
```

**Execution with Sub-Agents:**
```
looks great, go through each task and execute the detailed plan, spin up 20 sub-agents to help speed up completion of these tasks
```

**Progress Monitoring:**
```
looks great, show me what tasks are left
```

**Continuing Execution:**
```
continue with your next task
```

#### Why This Approach Works

- **Comprehensive Planning**: Multiple agents thinking about different aspects (security, architecture, testing) create more thorough plans
- **Context Awareness**: References to existing patterns ensure consistency with your codebase
- **Parallel Execution**: 20 sub-agents can work on different components simultaneously
- **Quality Control**: Human approval ensures the plan meets requirements before execution begins

The more sub-agents I have used, the better plans and code it produced.

---

## 🔒 Security Considerations

### Data Access and Privacy

**Data Flow with Vertex AI**

```
Claude Code Architecture (Secure):

Your Code → Claude Code CLI → Google Vertex AI → Claude Model → Response
    ↑              ↑               ↑                 ↑           ↓
Local Files    Local Process   GCP Infrastructure  Anthropic   Back to You
(Private)      (Your Machine)   (Your Project)     (Processing) (Local)

🔒 Security Layers:
├── Local: Files stay on your machine
├── Transport: Encrypted communication  
├── Processing: Within your GCP project
├── Storage: No persistent code storage
└── Context: Only necessary context sent

❌ What Claude Code CANNOT Access:
• Files outside your working directory
• Your environment variables (unless explicitly shared)
• Other projects or directories
• Your personal data outside the session

✅ What You Control:
• Which files are in the working directory
• What context goes in CLAUDE.md
• GCP project and region settings
• When to start/stop Claude Code sessions
```

- **Code Visibility**: Claude Code can read files in your working directory and subdirectories
- **No Persistent Storage**: Claude Code doesn't store your code permanently on Anthropic's servers when using Vertex AI
- **Local Processing**: Most operations happen locally, with only necessary context sent to the API
- **Sensitive Data**: Avoid putting secrets, API keys, or passwords in files that Claude Code can access

### Enterprise Compliance

- **Vertex AI Benefits**: Using Google Vertex AI keeps your data within GCP infrastructure
- **Audit Trails**: Vertex AI provides logging and monitoring capabilities for compliance
- **Data Residency**: Configure Vertex AI regions to meet data residency requirements
- **Access Controls**: Use GCP IAM to control who can access Claude Code through Vertex AI

### Best Practices for Secure Usage

- **Environment Variables**: Store secrets in environment variables, not in code files
- **`.gitignore` Sensitive Files**: Ensure sensitive files are excluded from version control
- **Regular Updates**: Keep Claude Code updated to receive security patches
- **Team Training**: Educate team members on what information to share with Claude Code
- **Review Generated Code**: Always review Claude-generated code for security vulnerabilities

---

## 🔧 Troubleshooting

### Authentication Issues

**Troubleshooting Authentication Problems**

```
Authentication Flow Diagnosis:

Environment Check:
┌─────────────────────────────────────┐
│ echo $CLAUDE_CODE_USE_VERTEX        │ → Should show: 1
│ echo $ANTHROPIC_VERTEX_PROJECT_ID   │ → Should show: your-project-id  
│ echo $CLOUD_ML_REGION              │ → Should show: us-east5
└─────────────────────────────────────┘
                    │
                    ▼ (If missing)
┌─────────────────────────────────────┐
│ export CLAUDE_CODE_USE_VERTEX=1     │
│ export ANTHROPIC_VERTEX_PROJECT_ID= │
│ export CLOUD_ML_REGION=us-east5     │
│ source ~/.zshrc                     │
└─────────────────────────────────────┘
                    │
                    ▼
Google Cloud Auth:
┌─────────────────────────────────────┐
│ gcloud auth application-default     │
│ gcloud projects list                │ → Verify project access
│ gcloud services list --enabled     │ → Check Vertex AI API
└─────────────────────────────────────┘

Common Error Resolution:
"Authentication failed" → Re-run gcloud auth application-default login
"Project not found"     → Verify ANTHROPIC_VERTEX_PROJECT_ID is correct
"API not enabled"       → Enable Vertex AI API in GCP Console
"Permission denied"     → Check IAM roles for Vertex AI access
```

**Problem**: Cannot connect to Vertex AI
```
Error: Authentication failed with Vertex AI
```

**Solutions**:
1. Verify environment variables are set correctly:
   ```bash
   echo $CLAUDE_CODE_USE_VERTEX
   echo $ANTHROPIC_VERTEX_PROJECT_ID
   ```
2. Re-authenticate with Google Cloud:
   ```bash
   gcloud auth application-default login
   ```
3. Check your GCP project permissions for Vertex AI API access
4. Ensure the Vertex AI API is enabled in your GCP project

### VS Code Extension Problems

**Problem**: VS Code extension not connecting to Claude Code
```
Claude Code extension: Connection failed
```

**Solutions**:
1. Restart VS Code completely
2. Check that Claude Code CLI is running in the correct directory
3. Verify extension version matches CLI version:
   ```bash
   claude --version
   ```
4. Reinstall the VS Code extension if versions don't match
5. Check VS Code developer console for detailed error messages

### Memory and Context Issues

**Problem**: Claude Code seems to forget previous context
```
Claude Code appears to have lost project context
```

**Solutions**:
1. Check if your `CLAUDE.md` file exists and is readable
2. Restart Claude Code to refresh memory
3. Verify you're in the correct working directory
4. Update your `CLAUDE.md` with current project state
5. Avoid running multiple Claude Code instances in the same directory

### Performance Problems

**Problem**: Claude Code responses are slow or timing out
```
Request timeout or very slow responses
```

**Solutions**:
1. Check your internet connection stability
2. Verify Vertex AI region is geographically close:
   ```bash
   echo $CLOUD_ML_REGION
   ```
3. Reduce the scope of your requests (break into smaller tasks)
4. Check GCP quotas and limits for Vertex AI usage
5. Consider using fewer sub-agents if experiencing resource constraints
6. Clear Claude Code cache by restarting if memory usage is high

---

## 🗣️ Natural Language Workflow with Claude Code

#### The Power of Conversational Development

Claude Code represents a fundamental shift in how we interact with development tools. Instead of memorizing complex command-line arguments or navigating through multiple UI menus, you can simply describe what you want to accomplish in natural language.

#### Why Natural Language Works Better

**Traditional Approach:**
```bash
git checkout -b feature/user-auth
npm install jsonwebtoken bcryptjs
mkdir -p src/middleware src/controllers src/models
touch src/middleware/auth.js src/controllers/authController.js
# ... dozens more commands
```

**Claude Code Approach:**
```
Create a user authentication system with JWT tokens, password hashing, and role-based access control. Set up the necessary middleware, controllers, and models following our project structure.
```

#### Key Benefits of Natural Language Workflow

**🎯 Intent-Focused Development**
- Describe *what* you want, not *how* to do it
- Focus on business logic rather than implementation details
- Reduces cognitive load from remembering syntax

**🔄 Iterative Refinement**
```
// Instead of starting over with wrong approach:
"Actually, let's also add email verification to that auth system"
"Make the password requirements more strict - 12 characters minimum"
"Add rate limiting to prevent brute force attacks"
```

**🧠 Context Awareness**
Claude Code understands your project context from your `CLAUDE.md` file:
```
"Add error handling like we did in the payment module"
"Follow the same testing patterns we use for API endpoints"
"Use our standard logging format for authentication events"
```

#### Effective Natural Language Patterns

**Be Specific About Your Goals:**
```
❌ "Fix this code"
✅ "Refactor this function to handle async operations and add proper error handling"
```

**Reference Your Existing Patterns:**
```
❌ "Create a new component"
✅ "Create a user profile component following the same structure as our ProductCard component"
```

**Break Down Complex Tasks:**
```
❌ "Build a complete e-commerce system"
✅ "Start with user authentication, then we'll add product catalog, shopping cart, and payment processing"
```

#### The Future-Forward Mindset

**Why This Approach Matters:**
- **Reduced Learning Curve**: New team members can be productive immediately
- **Less Documentation Overhead**: Self-describing interactions
- **Faster Iteration**: No context switching between docs and implementation
- **Better Collaboration**: Non-technical stakeholders can understand the process

**Thinking in Natural Language:**
Instead of thinking "I need to run X command with Y flags," start thinking "I want to achieve Z outcome." Claude Code bridges the gap between human intention and machine execution.

#### Best Practices for Natural Language Development

**Start Conversations with Context:**
```
"I'm working on the user dashboard component. I need to add a feature that shows recent order history with pagination and filtering options."
```

**Use Progressive Disclosure:**
```
"Let's start with the basic order history display, then we'll add filtering"
// After reviewing the initial implementation:
"Now add filters for date range and order status"
```

**Leverage Domain Knowledge:**
```
"Implement OAuth 2.0 login with our existing authentication patterns"
// Claude Code understands both OAuth concepts and your specific patterns
```

This natural language approach isn't just a convenience feature—it's a fundamental shift toward more intuitive, efficient, and collaborative development workflows.

---

## 📊 Summary

Claude Code CLI provides powerful development capabilities through intelligent memory management, seamless GitLab integration, and sophisticated workflow automation. The combination of scoped memory, natural language Git operations, and parallel development through worktrees creates an efficient development environment for projects of any scale.

**Key Takeaways:**
- Start with proper Vertex AI security setup
- Use worktrees for parallel development
- Leverage sub-agents for complex projects
- Maintain good `CLAUDE.md` documentation
- Avoid common pitfalls for smooth operation

