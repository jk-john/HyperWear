#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Node.js modules that are not available in Edge Runtime
const FORBIDDEN_IMPORTS = [
  'crypto', 'fs', 'path', 'os', 'util', 'stream', 'buffer', 'events',
  'http', 'https', 'net', 'tls', 'dns', 'dgram', 'cluster', 'worker_threads',
  'child_process', 'readline', 'repl', 'vm', 'zlib', 'querystring', 'url'
];

// Files that run in Edge Runtime and must be compatible
const EDGE_RUNTIME_PATTERNS = [
  'middleware.ts',
  'middleware.js',
  'lib/security.ts',
  'lib/security.js',
  'utils/**/middleware.ts',
  'utils/**/middleware.js'
];

// API routes that might run in Edge Runtime
const API_ROUTE_PATTERNS = [
  'app/api/**/route.ts',
  'app/api/**/route.js',
  'pages/api/**/*.ts', 
  'pages/api/**/*.js'
];

function findFilesMatching(patterns) {
  let files = [];
  
  patterns.forEach(pattern => {
    try {
      const matches = glob.sync(pattern, { 
        ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**'],
        cwd: process.cwd()
      });
      files = files.concat(matches);
    } catch (error) {
      console.warn(`Warning: Could not process pattern ${pattern}:`, error.message);
    }
  });
  
  return [...new Set(files)]; // Remove duplicates
}

function checkFileContent(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: File ${filePath} does not exist`);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];
  
  // Check for forbidden imports
  FORBIDDEN_IMPORTS.forEach(module => {
    const importPatterns = [
      new RegExp(`import.*from\\s+['"\`]${module}['"\`]`, 'g'),
      new RegExp(`import\\s+.*\\s*=\\s*require\\(['"\`]${module}['"\`]\\)`, 'g'),
      new RegExp(`require\\(['"\`]${module}['"\`]\\)`, 'g'),
      new RegExp(`import\\(['"\`]${module}['"\`]\\)`, 'g'),
      new RegExp(`from\\s+['"\`]${module}['"\`]`, 'g')
    ];
    
    importPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        violations.push({
          file: filePath,
          type: 'forbidden_import',
          module: module,
          message: `Forbidden Node.js module '${module}' imported`
        });
      }
    });
  });
  
  // Check for Node.js global usage (avoid false positives in comments)
  const nodeGlobals = ['process', '__dirname', '__filename', 'Buffer'];
  nodeGlobals.forEach(globalVar => {
    // Check for actual usage, not in comments or type checks
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      // Skip comments and type checks
      if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || 
          line.includes(`typeof ${globalVar}`) || line.includes(`process.env`)) {
        return;
      }
      
      const globalPattern = new RegExp(`\\b${globalVar}\\b(?!\\s*[=:]|\\s*\\.|env)`, 'g');
      if (globalPattern.test(line)) {
        violations.push({
          file: filePath,
          type: 'node_global',
          global: globalVar,
          message: `Node.js global '${globalVar}' used on line ${index + 1} (may not be available in Edge Runtime)`
        });
      }
    });
  });
  
  // Special check for 'global' keyword usage (more specific)
  const globalUsagePattern = /\bglobal\s*[\.\[]/g;
  if (globalUsagePattern.test(content)) {
    violations.push({
      file: filePath,
      type: 'node_global',
      global: 'global',
      message: `Node.js global 'global' object used (not available in Edge Runtime)`
    });
  }
  
  // Check for potential Edge Runtime incompatible APIs
  const incompatibleAPIs = [
    'createHash', 'createCipher', 'randomBytes', 'pbkdf2',
    'createReadStream', 'createWriteStream', 'readFile', 'writeFile'
  ];
  
  incompatibleAPIs.forEach(api => {
    if (content.includes(api)) {
      violations.push({
        file: filePath,
        type: 'incompatible_api',
        api: api,
        message: `Potentially incompatible API '${api}' used`
      });
    }
  });
  
  return violations;
}

function checkSpecialFiles(filePath) {
  const violations = [];
  
  // Note: In Next.js 15+, middleware automatically runs on Edge Runtime
  // No need to explicitly set runtime: 'edge' in middleware config
  
  return violations;
}

function suggestAlternatives(violation) {
  const alternatives = {
    'crypto': 'Use Web Crypto API (crypto.getRandomValues, crypto.subtle)',
    'fs': 'Use dynamic imports or move file operations to API routes',
    'path': 'Use URL constructor or string manipulation',
    'process': 'Use environment variables through process.env only',
    'Buffer': 'Use Uint8Array or TextEncoder/TextDecoder'
  };
  
  if (alternatives[violation.module] || alternatives[violation.global]) {
    return alternatives[violation.module] || alternatives[violation.global];
  }
  
  return 'Consider moving this logic to a server-side API route';
}

function main() {
  console.log('🔍 Checking Edge Runtime compatibility...\n');
  
  // Find all files to check
  const edgeFiles = findFilesMatching(EDGE_RUNTIME_PATTERNS);
  const apiFiles = findFilesMatching(API_ROUTE_PATTERNS);
  
  const allFiles = [...edgeFiles, ...apiFiles];
  
  if (allFiles.length === 0) {
    console.log('⚠️  No files found to check. This might indicate a configuration issue.');
    return;
  }
  
  console.log(`Checking ${allFiles.length} files for Edge Runtime compatibility:`);
  allFiles.forEach(file => console.log(`  - ${file}`));
  console.log('');
  
  let totalViolations = 0;
  const violationsByFile = {};
  
  // Check each file
  allFiles.forEach(file => {
    const violations = [
      ...checkFileContent(file),
      ...checkSpecialFiles(file)
    ];
    
    if (violations.length > 0) {
      violationsByFile[file] = violations;
      totalViolations += violations.length;
    }
  });
  
  // Report results
  if (totalViolations === 0) {
    console.log('✅ All files are Edge Runtime compatible!');
    console.log('🎉 No compatibility issues found.\n');
    return;
  }
  
  console.log(`❌ Found ${totalViolations} Edge Runtime compatibility issues:\n`);
  
  Object.entries(violationsByFile).forEach(([file, violations]) => {
    console.log(`📄 ${file}:`);
    violations.forEach(violation => {
      console.log(`  ❌ ${violation.message}`);
      const suggestion = suggestAlternatives(violation);
      console.log(`     💡 Suggestion: ${suggestion}\n`);
    });
  });
  
  console.log('📚 Resources:');
  console.log('  - Edge Runtime API: https://nextjs.org/docs/app/api-reference/edge');
  console.log('  - Web APIs: https://nextjs.org/docs/app/api-reference/edge#web-apis');
  console.log('  - Node.js APIs: https://nextjs.org/docs/app/api-reference/edge#unsupported-apis\n');
  
  process.exit(1);
}

// Handle missing glob dependency gracefully
try {
  require.resolve('glob');
} catch (error) {
  console.error('❌ Missing dependency: glob');
  console.error('Please install it with: npm install --save-dev glob');
  process.exit(1);
}

main();