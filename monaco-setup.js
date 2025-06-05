/**
 * Monaco Editor Configuration for Claude Code Training Playground
 * Provides syntax highlighting, themes, and IntelliSense for bash, markdown, and JavaScript
 */

class MonacoEditorSetup {
    constructor() {
        this.editor = null;
        this.theme = 'claude-dark';
        this.language = 'bash';
        this.completionProviders = [];
    }

    /**
     * Initialize Monaco Editor with Claude Code specific configuration
     */
    async initialize(container, options = {}) {
        // Define custom themes
        this.defineThemes();
        
        // Configure languages
        this.configureLanguages();
        
        // Create editor instance
        this.editor = monaco.editor.create(container, {
            value: options.value || this.getDefaultContent(options.language || 'bash'),
            language: options.language || 'bash',
            theme: options.theme || this.theme,
            fontSize: 14,
            fontFamily: 'SF Mono, Monaco, Inconsolata, "Roboto Mono", "Consolas", "Courier New", monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            bracketMatching: 'always',
            autoIndent: 'full',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            quickSuggestions: {
                other: true,
                comments: true,
                strings: true
            },
            ...options
        });

        // Setup completion providers
        this.setupCompletionProviders();
        
        // Setup command palette
        this.setupCommandPalette();
        
        return this.editor;
    }

    /**
     * Define custom themes for Claude Code
     */
    defineThemes() {
        // Claude Dark Theme
        monaco.editor.defineTheme('claude-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'C586C0' },
                { token: 'string', foreground: 'CE9178' },
                { token: 'number', foreground: 'B5CEA8' },
                { token: 'regexp', foreground: 'D16969' },
                { token: 'operator', foreground: 'D4D4D4' },
                { token: 'namespace', foreground: '4EC9B0' },
                { token: 'type', foreground: '4EC9B0' },
                { token: 'struct', foreground: '4EC9B0' },
                { token: 'class', foreground: '4EC9B0' },
                { token: 'interface', foreground: '4EC9B0' },
                { token: 'parameter', foreground: '9CDCFE' },
                { token: 'variable', foreground: '9CDCFE' },
                { token: 'function', foreground: 'DCDCAA' },
                { token: 'member', foreground: 'DCDCAA' },
                { token: 'claude-command', foreground: 'FF6B6B', fontStyle: 'bold' },
                { token: 'claude-flag', foreground: '4ECDC4' },
                { token: 'claude-path', foreground: 'FFE66D' }
            ],
            colors: {
                'editor.background': '#1E1E1E',
                'editor.foreground': '#D4D4D4',
                'editorLineNumber.foreground': '#858585',
                'editorLineNumber.activeForeground': '#C6C6C6',
                'editor.selectionBackground': '#264F78',
                'editor.selectionHighlightBackground': '#ADD6FF26',
                'editor.wordHighlightBackground': '#575757B8',
                'editor.wordHighlightStrongBackground': '#004972B8',
                'editorCursor.foreground': '#AEAFAD',
                'editor.lineHighlightBackground': '#2A2D2E'
            }
        });

        // Claude Light Theme
        monaco.editor.defineTheme('claude-light', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '008000', fontStyle: 'italic' },
                { token: 'keyword', foreground: '0000FF' },
                { token: 'string', foreground: 'A31515' },
                { token: 'number', foreground: '098658' },
                { token: 'regexp', foreground: 'D16969' },
                { token: 'operator', foreground: '000000' },
                { token: 'namespace', foreground: '267F99' },
                { token: 'type', foreground: '267F99' },
                { token: 'struct', foreground: '267F99' },
                { token: 'class', foreground: '267F99' },
                { token: 'interface', foreground: '267F99' },
                { token: 'parameter', foreground: '001080' },
                { token: 'variable', foreground: '001080' },
                { token: 'function', foreground: '795E26' },
                { token: 'member', foreground: '795E26' },
                { token: 'claude-command', foreground: 'D73A49', fontStyle: 'bold' },
                { token: 'claude-flag', foreground: '005CC5' },
                { token: 'claude-path', foreground: 'E36209' }
            ],
            colors: {
                'editor.background': '#FFFFFF',
                'editor.foreground': '#000000'
            }
        });
    }

    /**
     * Configure language-specific features
     */
    configureLanguages() {
        // Configure Bash/Shell language
        monaco.languages.setMonarchTokensProvider('bash', {
            tokenizer: {
                root: [
                    // Claude Code commands
                    [/\/(help|status|memory|clear|exit|review|pr-comments|init|cost|resume|continue|pause)\b/, 'claude-command'],
                    
                    // Command flags
                    [/--?[a-zA-Z-]+/, 'claude-flag'],
                    
                    // File paths
                    [/[~\/][^\s]*/, 'claude-path'],
                    
                    // Comments
                    [/#.*$/, 'comment'],
                    
                    // Strings
                    [/"([^"\\]|\\.)*$/, 'string.invalid'],
                    [/"/, 'string', '@string_double'],
                    [/'/, 'string', '@string_single'],
                    
                    // Environment variables
                    [/\$[a-zA-Z_][a-zA-Z0-9_]*/, 'variable'],
                    [/\$\{[^}]+\}/, 'variable'],
                    
                    // Keywords
                    [/\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|export|source|cd|ls|cp|mv|rm|mkdir|chmod|chown|grep|sed|awk|sort|uniq|head|tail|cat|echo|printf)\b/, 'keyword'],
                    
                    // Operators
                    [/[=!<>]+/, 'operator'],
                    [/[&|;(){}[\]]/, 'delimiter'],
                ]
            }
        });

        // Configure Markdown language enhancements
        monaco.languages.setMonarchTokensProvider('markdown', {
            tokenizer: {
                root: [
                    // Claude Code specific markers
                    [/^# CLAUDE\.md/, 'claude-command'],
                    [/^## (Memory|Context|Project Info|Development Guidelines)/, 'keyword'],
                    
                    // Standard markdown
                    [/^(#{1,6})\s+.*$/, 'keyword'],
                    [/\*\*([^*]+)\*\*/, 'string'],
                    [/\*([^*]+)\*/, 'comment'],
                    [/`([^`]+)`/, 'string'],
                    [/^```[\s\S]*?^```/m, 'string'],
                    [/^\s*[-*+]\s+/, 'keyword'],
                    [/^\s*\d+\.\s+/, 'keyword'],
                    [/\[([^\]]+)\]\(([^)]+)\)/, 'string']
                ]
            }
        });
    }

    /**
     * Setup intelligent completion providers
     */
    setupCompletionProviders() {
        // Bash completion provider
        const bashProvider = monaco.languages.registerCompletionItemProvider('bash', {
            provideCompletionItems: (model, position) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };

                const claudeCommands = [
                    {
                        label: '/help',
                        kind: monaco.languages.CompletionItemKind.Function,
                        documentation: 'Display available commands and usage information',
                        insertText: '/help',
                        range: range
                    },
                    {
                        label: '/status',
                        kind: monaco.languages.CompletionItemKind.Function,
                        documentation: 'Show current configuration, model, and environment details',
                        insertText: '/status',
                        range: range
                    },
                    {
                        label: '/memory',
                        kind: monaco.languages.CompletionItemKind.Function,
                        documentation: 'View and edit current memory and context information',
                        insertText: '/memory',
                        range: range
                    },
                    {
                        label: '/clear',
                        kind: monaco.languages.CompletionItemKind.Function,
                        documentation: 'Clear conversation history and free up context',
                        insertText: '/clear',
                        range: range
                    },
                    {
                        label: '/review',
                        kind: monaco.languages.CompletionItemKind.Function,
                        documentation: 'Review a pull request',
                        insertText: '/review ${1:PR_URL}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range: range
                    },
                    {
                        label: '/init',
                        kind: monaco.languages.CompletionItemKind.Function,
                        documentation: 'Initialize a new CLAUDE.md file with codebase documentation',
                        insertText: '/init',
                        range: range
                    },
                    {
                        label: 'claude',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        documentation: 'Start Claude Code interactive session',
                        insertText: 'claude',
                        range: range
                    },
                    {
                        label: 'export CLAUDE_CODE_USE_VERTEX=1',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        documentation: 'Configure Claude Code to use Vertex AI',
                        insertText: 'export CLAUDE_CODE_USE_VERTEX=1',
                        range: range
                    },
                    {
                        label: 'export ANTHROPIC_VERTEX_PROJECT_ID=azsb-it-genai',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        documentation: 'Set AutoZone GCP project ID for Vertex AI',
                        insertText: 'export ANTHROPIC_VERTEX_PROJECT_ID=azsb-it-genai',
                        range: range
                    },
                    {
                        label: 'gcloud auth application-default login',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        documentation: 'Authenticate with Google Cloud for Vertex AI access',
                        insertText: 'gcloud auth application-default login',
                        range: range
                    }
                ];

                const commonBashCommands = [
                    { label: 'ls', documentation: 'List directory contents' },
                    { label: 'cd', documentation: 'Change directory' },
                    { label: 'pwd', documentation: 'Print working directory' },
                    { label: 'mkdir', documentation: 'Create directory' },
                    { label: 'touch', documentation: 'Create empty file' },
                    { label: 'cp', documentation: 'Copy files/directories' },
                    { label: 'mv', documentation: 'Move/rename files' },
                    { label: 'rm', documentation: 'Remove files' },
                    { label: 'grep', documentation: 'Search text patterns' },
                    { label: 'find', documentation: 'Find files and directories' },
                    { label: 'git status', documentation: 'Show git repository status' },
                    { label: 'git add', documentation: 'Add files to git staging' },
                    { label: 'git commit', documentation: 'Commit changes to git' },
                    { label: 'npm install', documentation: 'Install npm dependencies' },
                    { label: 'npm run', documentation: 'Run npm script' }
                ].map(cmd => ({
                    ...cmd,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: cmd.label,
                    range: range
                }));

                return {
                    suggestions: [...claudeCommands, ...commonBashCommands]
                };
            }
        });

        // JavaScript completion provider for Claude Code examples
        const jsProvider = monaco.languages.registerCompletionItemProvider('javascript', {
            provideCompletionItems: (model, position) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };

                const claudeCodeSnippets = [
                    {
                        label: 'claude-config',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        documentation: 'Claude Code configuration object',
                        insertText: [
                            'const claudeConfig = {',
                            '  useVertex: true,',
                            '  projectId: "azsb-it-genai",',
                            '  region: "us-east5",',
                            '  model: "claude-sonnet-4@20250514"',
                            '};'
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range: range
                    },
                    {
                        label: 'claude-memory-template',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        documentation: 'Template for CLAUDE.md memory file',
                        insertText: [
                            'const memoryTemplate = `',
                            '# ${1:Project Name}',
                            '',
                            '## Project Overview',
                            '${2:Brief description of the project}',
                            '',
                            '## Architecture',
                            '${3:Key architectural decisions and patterns}',
                            '',
                            '## Development Guidelines',
                            '${4:Coding standards and practices}',
                            '`;'
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range: range
                    }
                ];

                return { suggestions: claudeCodeSnippets };
            }
        });

        this.completionProviders.push(bashProvider, jsProvider);
    }

    /**
     * Setup command palette with Claude Code specific commands
     */
    setupCommandPalette() {
        // Add custom actions to command palette
        this.editor.addAction({
            id: 'claude.insertCommand',
            label: 'Insert Claude Command',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK],
            contextMenuGroupId: 'claude',
            run: (editor) => {
                const position = editor.getPosition();
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endColumn: position.column
                };

                // Show quick pick for Claude commands
                this.showCommandQuickPick(editor, range);
            }
        });

        this.editor.addAction({
            id: 'claude.formatCode',
            label: 'Format with Claude Style',
            keybindings: [monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
            contextMenuGroupId: 'claude',
            run: (editor) => {
                this.formatWithClaudeStyle(editor);
            }
        });

        this.editor.addAction({
            id: 'claude.toggleTheme',
            label: 'Toggle Claude Theme',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyT],
            contextMenuGroupId: 'claude',
            run: () => {
                this.toggleTheme();
            }
        });
    }

    /**
     * Show command quick pick dialog
     */
    showCommandQuickPick(editor, range) {
        const commands = [
            { label: '/help', description: 'Show help information' },
            { label: '/status', description: 'Show system status' },
            { label: '/memory', description: 'Manage memory and context' },
            { label: '/clear', description: 'Clear conversation history' },
            { label: '/review', description: 'Review pull request' },
            { label: '/init', description: 'Initialize CLAUDE.md' }
        ];

        // This would typically show a dropdown, but for this demo we'll insert the first command
        const selectedCommand = commands[0];
        editor.executeEdits('claude-insert-command', [{
            range: range,
            text: selectedCommand.label
        }]);
    }

    /**
     * Format code with Claude-specific style guidelines
     */
    formatWithClaudeStyle(editor) {
        const model = editor.getModel();
        const language = model.getLanguageId();

        if (language === 'bash') {
            // Apply bash formatting rules
            const value = model.getValue();
            const formatted = this.formatBashCode(value);
            editor.setValue(formatted);
        } else if (language === 'javascript') {
            // Apply JavaScript formatting
            editor.getAction('editor.action.formatDocument').run();
        }
    }

    /**
     * Format bash code with Claude Code conventions
     */
    formatBashCode(code) {
        return code
            .split('\n')
            .map(line => {
                // Add proper spacing around operators
                line = line.replace(/([^=])=([^=])/g, '$1 = $2');
                
                // Ensure proper spacing for Claude commands
                line = line.replace(/^(\s*)(\/\w+)(\s*)/, '$1$2 ');
                
                // Clean up multiple spaces
                line = line.replace(/\s+/g, ' ').trim();
                
                return line;
            })
            .join('\n');
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        this.theme = this.theme === 'claude-dark' ? 'claude-light' : 'claude-dark';
        monaco.editor.setTheme(this.theme);
        
        // Emit theme change event
        this.onThemeChange && this.onThemeChange(this.theme);
    }

    /**
     * Get default content for different languages
     */
    getDefaultContent(language) {
        switch (language) {
            case 'bash':
                return `# Claude Code Training Exercise
# Welcome to the interactive playground!

# Check your setup
/status

# Initialize project memory
/init

# Start coding with Claude Code
echo "Hello, Claude Code!"`;

            case 'markdown':
                return `# CLAUDE.md

## Project Overview
This is a sample project for learning Claude Code.

## Architecture
- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL

## Development Guidelines
- Use TypeScript for type safety
- Follow ESLint configuration
- Write tests for all new features
- Update this file when architecture changes`;

            case 'javascript':
                return `// Claude Code JavaScript Example
// This demonstrates integration with Claude Code workflow

const claudeConfig = {
  useVertex: true,
  projectId: "azsb-it-genai",
  region: "us-east5"
};

// Example function to process with Claude
async function processWithClaude(input) {
  console.log("Processing:", input);
  // Your implementation here
  return "Processed with Claude Code";
}

processWithClaude("Hello, Claude!");`;

            default:
                return '';
        }
    }

    /**
     * Change editor language and update content
     */
    setLanguage(language) {
        if (this.editor) {
            const model = this.editor.getModel();
            monaco.editor.setModelLanguage(model, language);
            this.language = language;
            
            // Optionally update content for new language
            if (model.getValue().trim() === '') {
                model.setValue(this.getDefaultContent(language));
            }
        }
    }

    /**
     * Get current editor value
     */
    getValue() {
        return this.editor ? this.editor.getValue() : '';
    }

    /**
     * Set editor value
     */
    setValue(value) {
        if (this.editor) {
            this.editor.setValue(value);
        }
    }

    /**
     * Focus the editor
     */
    focus() {
        if (this.editor) {
            this.editor.focus();
        }
    }

    /**
     * Dispose of editor and cleanup
     */
    dispose() {
        if (this.editor) {
            this.editor.dispose();
        }
        
        // Dispose completion providers
        this.completionProviders.forEach(provider => provider.dispose());
        this.completionProviders = [];
    }

    /**
     * Set theme change callback
     */
    onThemeChange(callback) {
        this.onThemeChange = callback;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MonacoEditorSetup;
} else {
    window.MonacoEditorSetup = MonacoEditorSetup;
}