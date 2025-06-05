/**
 * File System Simulator for Claude Code CLI
 * Simulates a realistic file system for practicing commands
 */

class FileSystemSimulator {
    constructor() {
        this.fileSystem = this.createDefaultFileSystem();
        this.currentPath = '/Users/training/AutoZoneWorkSpace/demo-project';
        this.gitStatus = this.createGitStatus();
        this.watchedFiles = new Set();
        this.changeLog = [];
    }

    createDefaultFileSystem() {
        return {
            '/Users/training/AutoZoneWorkSpace/demo-project': {
                type: 'directory',
                contents: {
                    'CLAUDE.md': {
                        type: 'file',
                        content: `# AutoZone Demo Project

## Project Overview
This is a comprehensive training project for the Claude Code CLI simulator.

## Technology Stack
- Node.js v18+
- Express.js web framework
- React frontend
- PostgreSQL database
- Redis for caching
- Jest for testing

## Project Structure
\`\`\`
demo-project/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── utils/         # Utility functions
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API services
│   └── styles/        # CSS and styling
├── server/
│   ├── routes/        # Express routes
│   ├── models/        # Database models
│   ├── middleware/    # Express middleware
│   └── config/        # Configuration files
├── tests/
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── e2e/          # End-to-end tests
├── docs/              # Documentation
├── scripts/           # Build and deployment scripts
└── config/           # Environment configurations
\`\`\`

## Development Guidelines
- Follow AutoZone JavaScript/TypeScript style guide
- Implement comprehensive error handling
- Write unit tests for all new features
- Use semantic versioning for releases
- Document all public APIs with JSDoc
- Follow security best practices

## Dependencies
### Production
- express: ^4.18.2 (web framework)
- react: ^18.2.0 (frontend library)
- react-dom: ^18.2.0 (React DOM renderer)
- axios: ^1.4.0 (HTTP client)
- lodash: ^4.17.21 (utility library)
- moment: ^2.29.4 (date manipulation)

### Development
- jest: ^29.5.0 (testing framework)
- eslint: ^8.42.0 (linting)
- prettier: ^2.8.8 (code formatting)
- webpack: ^5.88.0 (bundling)
- babel: ^7.22.0 (transpilation)

## Current Status
- Project initialized and configured
- Basic architecture in place
- Core components implemented
- Testing infrastructure set up
- CI/CD pipeline configured

## Recent Changes
- Added user authentication system
- Implemented role-based access control
- Enhanced error handling middleware
- Updated API documentation
- Optimized database queries

## Security Considerations
- Input validation on all endpoints
- JWT token authentication
- Rate limiting implemented
- SQL injection prevention
- XSS protection enabled
- HTTPS enforced in production

## Performance Metrics
- Page load time: < 2 seconds
- API response time: < 500ms
- Test coverage: > 90%
- Bundle size: < 1MB

## AutoZone Standards Compliance
✓ Security guidelines followed
✓ Error handling patterns implemented  
✓ Logging standards applied
✓ Documentation requirements met
✓ Code review process established

Generated: ${new Date().toISOString()}
Claude Code Version: 1.0.5 (Training Simulator)`,
                        lastModified: Date.now() - 3600000,
                        size: 2431
                    },
                    'package.json': {
                        type: 'file',
                        content: JSON.stringify({
                            "name": "autozone-demo-project",
                            "version": "1.2.3",
                            "description": "AutoZone Claude Code training demo project",
                            "main": "server/index.js",
                            "scripts": {
                                "start": "node server/index.js",
                                "dev": "nodemon server/index.js",
                                "build": "webpack --mode production",
                                "test": "jest",
                                "test:watch": "jest --watch",
                                "test:coverage": "jest --coverage",
                                "lint": "eslint src/ server/",
                                "lint:fix": "eslint src/ server/ --fix",
                                "format": "prettier --write .",
                                "deploy": "npm run build && npm run test && ./scripts/deploy.sh"
                            },
                            "dependencies": {
                                "express": "^4.18.2",
                                "react": "^18.2.0",
                                "react-dom": "^18.2.0",
                                "axios": "^1.4.0",
                                "lodash": "^4.17.21",
                                "moment": "^2.29.4",
                                "jsonwebtoken": "^9.0.0",
                                "bcryptjs": "^2.4.3",
                                "cors": "^2.8.5",
                                "helmet": "^7.0.0"
                            },
                            "devDependencies": {
                                "jest": "^29.5.0",
                                "eslint": "^8.42.0",
                                "prettier": "^2.8.8",
                                "webpack": "^5.88.0",
                                "@babel/core": "^7.22.0",
                                "@babel/preset-env": "^7.22.0",
                                "@babel/preset-react": "^7.22.0",
                                "nodemon": "^2.0.22"
                            },
                            "keywords": ["autozone", "training", "react", "node"],
                            "author": "AutoZone Development Team",
                            "license": "MIT"
                        }, null, 2),
                        lastModified: Date.now() - 7200000,
                        size: 1248,
                        modified: true
                    },
                    'README.md': {
                        type: 'file',
                        content: `# AutoZone Demo Project

A comprehensive training project for Claude Code CLI simulator.

## Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

- Modern React frontend
- Express.js backend
- PostgreSQL database
- Redis caching
- JWT authentication
- Role-based access control
- Comprehensive testing
- CI/CD pipeline

## Documentation

See [docs/](./docs/) for detailed documentation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
`,
                        lastModified: Date.now() - 86400000,
                        size: 567
                    },
                    'src': {
                        type: 'directory',
                        contents: {
                            'index.js': {
                                type: 'file',
                                content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
                                lastModified: Date.now() - 1800000,
                                size: 267
                            },
                            'App.js': {
                                type: 'file',
                                content: `import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;`,
                                lastModified: Date.now() - 900000,
                                size: 743
                            },
                            'utils': {
                                type: 'directory',
                                contents: {
                                    'api.js': {
                                        type: 'file',
                                        content: `import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;`,
                                        lastModified: Date.now() - 3600000,
                                        size: 1024
                                    },
                                    'helpers.js': {
                                        type: 'file',
                                        content: `import moment from 'moment';

export const formatDate = (date, format = 'YYYY-MM-DD') => {
  return moment(date).format(format);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const validateEmail = (email) => {
  const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return re.test(email);
};

export const generateId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};`,
                                        lastModified: Date.now() - 7200000,
                                        size: 612
                                    }
                                }
                            }
                        }
                    },
                    'server': {
                        type: 'directory',
                        contents: {
                            'index.js': {
                                type: 'file',
                                content: `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
                                lastModified: Date.now() - 1800000,
                                size: 567
                            }
                        }
                    },
                    'tests': {
                        type: 'directory',
                        contents: {
                            'setup.js': {
                                type: 'file',
                                content: `const { configure } = require('@testing-library/react');

configure({ testIdAttribute: 'data-testid' });

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};`,
                                lastModified: Date.now() - 86400000,
                                size: 267
                            }
                        }
                    }
                }
            }
        };
    }

    createGitStatus() {
        return {
            branch: 'feature/user-authentication',
            ahead: 3,
            behind: 0,
            staged: ['src/utils/api.js'],
            unstaged: ['package.json', 'src/App.js'],
            untracked: ['temp.log', '.env.local'],
            conflicts: [],
            lastCommit: {
                hash: 'a1b2c3d',
                message: 'Add JWT authentication middleware',
                author: 'john.developer@autozone.com',
                timestamp: Date.now() - 3600000
            }
        };
    }

    // File operations
    readFile(filePath) {
        const normalizedPath = this.normalizePath(filePath);
        const file = this.getFileAtPath(normalizedPath);
        
        if (!file) {
            throw new Error(`File not found: ${filePath}`);
        }
        
        if (file.type !== 'file') {
            throw new Error(`${filePath} is not a file`);
        }
        
        return {
            content: file.content,
            size: file.size,
            lastModified: file.lastModified,
            modified: file.modified || false
        };
    }

    writeFile(filePath, content) {
        const normalizedPath = this.normalizePath(filePath);
        const parentPath = this.getParentPath(normalizedPath);
        const fileName = this.getFileName(normalizedPath);
        
        const parent = this.getFileAtPath(parentPath);
        if (!parent || parent.type !== 'directory') {
            throw new Error(`Directory not found: ${parentPath}`);
        }
        
        parent.contents[fileName] = {
            type: 'file',
            content: content,
            size: content.length,
            lastModified: Date.now(),
            modified: true
        };
        
        this.logChange('write', normalizedPath);
        return true;
    }

    createDirectory(dirPath) {
        const normalizedPath = this.normalizePath(dirPath);
        const parentPath = this.getParentPath(normalizedPath);
        const dirName = this.getFileName(normalizedPath);
        
        const parent = this.getFileAtPath(parentPath);
        if (!parent || parent.type !== 'directory') {
            throw new Error(`Parent directory not found: ${parentPath}`);
        }
        
        parent.contents[dirName] = {
            type: 'directory',
            contents: {}
        };
        
        this.logChange('create', normalizedPath);
        return true;
    }

    deleteFile(filePath) {
        const normalizedPath = this.normalizePath(filePath);
        const parentPath = this.getParentPath(normalizedPath);
        const fileName = this.getFileName(normalizedPath);
        
        const parent = this.getFileAtPath(parentPath);
        if (!parent || parent.type !== 'directory') {
            throw new Error(`Directory not found: ${parentPath}`);
        }
        
        if (!parent.contents[fileName]) {
            throw new Error(`File not found: ${filePath}`);
        }
        
        delete parent.contents[fileName];
        this.logChange('delete', normalizedPath);
        return true;
    }

    listDirectory(dirPath = this.currentPath) {
        const normalizedPath = this.normalizePath(dirPath);
        const directory = this.getFileAtPath(normalizedPath);
        
        if (!directory) {
            throw new Error(`Directory not found: ${dirPath}`);
        }
        
        if (directory.type !== 'directory') {
            throw new Error(`${dirPath} is not a directory`);
        }
        
        return Object.entries(directory.contents).map(([name, item]) => ({
            name,
            type: item.type,
            size: item.size || 0,
            lastModified: item.lastModified || Date.now(),
            modified: item.modified || false
        }));
    }

    // Git operations simulation
    getGitStatus() {
        return {
            ...this.gitStatus,
            workingDirectory: this.currentPath
        };
    }

    gitAdd(filePath) {
        const normalizedPath = this.normalizePath(filePath);
        const relativePath = this.getRelativePath(normalizedPath);
        
        // Move from unstaged to staged
        const unstagedIndex = this.gitStatus.unstaged.indexOf(relativePath);
        if (unstagedIndex > -1) {
            this.gitStatus.unstaged.splice(unstagedIndex, 1);
            this.gitStatus.staged.push(relativePath);
        }
        
        return this.gitStatus;
    }

    gitCommit(message) {
        if (this.gitStatus.staged.length === 0) {
            throw new Error('No changes staged for commit');
        }
        
        const newCommit = {
            hash: this.generateCommitHash(),
            message: message,
            author: 'training.user@autozone.com',
            timestamp: Date.now()
        };
        
        this.gitStatus.lastCommit = newCommit;
        this.gitStatus.staged = [];
        this.gitStatus.ahead += 1;
        
        return newCommit;
    }

    // File watching
    watchFile(filePath) {
        const normalizedPath = this.normalizePath(filePath);
        this.watchedFiles.add(normalizedPath);
    }

    unwatchFile(filePath) {
        const normalizedPath = this.normalizePath(filePath);
        this.watchedFiles.delete(normalizedPath);
    }

    getWatchedFiles() {
        return Array.from(this.watchedFiles);
    }

    // Search operations
    searchFiles(pattern, searchPath = this.currentPath) {
        const results = [];
        const normalizedPath = this.normalizePath(searchPath);
        
        this.searchRecursive(normalizedPath, pattern, results);
        return results;
    }

    searchInFiles(searchTerm, searchPath = this.currentPath) {
        const results = [];
        const normalizedPath = this.normalizePath(searchPath);
        
        this.searchContentRecursive(normalizedPath, searchTerm, results);
        return results;
    }

    // Utility methods
    normalizePath(path) {
        if (path.startsWith('/')) {
            return path;
        }
        return this.joinPaths(this.currentPath, path);
    }

    joinPaths(...paths) {
        return paths.join('/').replace(/\/+/g, '/');
    }

    getParentPath(path) {
        const parts = path.split('/');
        parts.pop();
        return parts.join('/') || '/';
    }

    getFileName(path) {
        const parts = path.split('/');
        return parts[parts.length - 1];
    }

    getRelativePath(absolutePath) {
        return absolutePath.replace(this.currentPath + '/', '');
    }

    getFileAtPath(path) {
        const parts = path.split('/').filter(p => p);
        let current = this.fileSystem;
        
        for (const part of parts) {
            if (current[part]) {
                current = current[part];
            } else if (current.contents && current.contents[part]) {
                current = current.contents[part];
            } else {
                return null;
            }
        }
        
        return current;
    }

    searchRecursive(path, pattern, results) {
        const directory = this.getFileAtPath(path);
        if (!directory || directory.type !== 'directory') return;
        
        for (const [name, item] of Object.entries(directory.contents)) {
            const fullPath = this.joinPaths(path, name);
            
            if (name.includes(pattern)) {
                results.push({
                    path: fullPath,
                    name: name,
                    type: item.type
                });
            }
            
            if (item.type === 'directory') {
                this.searchRecursive(fullPath, pattern, results);
            }
        }
    }

    searchContentRecursive(path, searchTerm, results) {
        const directory = this.getFileAtPath(path);
        if (!directory || directory.type !== 'directory') return;
        
        for (const [name, item] of Object.entries(directory.contents)) {
            const fullPath = this.joinPaths(path, name);
            
            if (item.type === 'file' && item.content.includes(searchTerm)) {
                const lines = item.content.split('\n');
                const matches = lines.map((line, index) => ({ line: index + 1, content: line }))
                                   .filter(l => l.content.includes(searchTerm));
                
                results.push({
                    path: fullPath,
                    name: name,
                    matches: matches
                });
            }
            
            if (item.type === 'directory') {
                this.searchContentRecursive(fullPath, searchTerm, results);
            }
        }
    }

    logChange(action, path) {
        this.changeLog.push({
            action,
            path,
            timestamp: Date.now()
        });
        
        // Keep only last 100 changes
        if (this.changeLog.length > 100) {
            this.changeLog.shift();
        }
    }

    generateCommitHash() {
        return Math.random().toString(36).substr(2, 7);
    }

    getFileStats() {
        let totalFiles = 0;
        let totalDirectories = 0;
        let totalSize = 0;
        
        const countRecursive = (item) => {
            if (item.type === 'file') {
                totalFiles++;
                totalSize += item.size || 0;
            } else if (item.type === 'directory') {
                totalDirectories++;
                for (const child of Object.values(item.contents)) {
                    countRecursive(child);
                }
            }
        };
        
        countRecursive(this.fileSystem[this.currentPath]);
        
        return {
            files: totalFiles,
            directories: totalDirectories,
            totalSize: totalSize,
            changeLog: this.changeLog.length
        };
    }

    reset() {
        this.fileSystem = this.createDefaultFileSystem();
        this.gitStatus = this.createGitStatus();
        this.watchedFiles.clear();
        this.changeLog = [];
    }
}

// Create global instance
const fileSystemSimulator = new FileSystemSimulator();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileSystemSimulator;
}

// Add to window for global access
if (typeof window !== 'undefined') {
    window.fileSystemSimulator = fileSystemSimulator;
}