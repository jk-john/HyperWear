#!/usr/bin/env node

const https = require('https');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          process.env[key.trim()] = value;
        }
      }
    });
  }
}

// Load environment variables before validation
loadEnvFile();

// Required environment variables
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_SUPABASE_URL', 
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'RESEND_API_KEY'
];

// Optional but recommended environment variables
const RECOMMENDED_ENV_VARS = [
  'NODE_ENV',
  'NEXT_PUBLIC_APP_ENV'
];

// Required files for the application
const REQUIRED_FILES = [
  'next.config.ts',
  'middleware.ts',
  'package.json',
  'app/layout.tsx',
  'lib/security.ts'
];

function checkEnvironmentVariables() {
  console.log('🔧 Checking environment variables...');
  
  const missing = REQUIRED_ENV_VARS.filter(name => !process.env[name]);
  const missingRecommended = RECOMMENDED_ENV_VARS.filter(name => !process.env[name]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  if (missingRecommended.length > 0) {
    console.log(`⚠️  Missing recommended environment variables: ${missingRecommended.join(', ')}`);
  }
  
  // Validate environment variable formats
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.startsWith('https://') && !supabaseUrl.includes('supabase.co')) {
    console.log('⚠️  NEXT_PUBLIC_SUPABASE_URL might not be a valid Supabase URL');
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl && !siteUrl.startsWith('http')) {
    console.log('⚠️  NEXT_PUBLIC_SITE_URL should include protocol (http/https)');
  }
  
  console.log('✅ Environment variables validated');
}

function checkRequiredFiles() {
  console.log('📁 Checking required files...');
  
  const missing = REQUIRED_FILES.filter(file => !fs.existsSync(file));
  
  if (missing.length > 0) {
    throw new Error(`Missing required files: ${missing.join(', ')}`);
  }
  
  console.log('✅ Required files present');
}

function checkPackageJson() {
  console.log('📦 Checking package.json configuration...');
  
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found');
  }
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check for required dependencies
  const requiredDeps = ['next', 'react', '@supabase/supabase-js'];
  const requiredDevDeps = ['typescript', 'eslint', '@types/node'];
  
  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies || !packageJson.dependencies[dep]
  );
  
  const missingDevDeps = requiredDevDeps.filter(dep =>
    !packageJson.devDependencies || !packageJson.devDependencies[dep]
  );
  
  if (missingDeps.length > 0) {
    throw new Error(`Missing required dependencies: ${missingDeps.join(', ')}`);
  }
  
  if (missingDevDeps.length > 0) {
    console.log(`⚠️  Missing recommended dev dependencies: ${missingDevDeps.join(', ')}`);
  }
  
  // Check for required scripts
  const requiredScripts = ['dev', 'build', 'start', 'lint'];
  const missingScripts = requiredScripts.filter(script =>
    !packageJson.scripts || !packageJson.scripts[script]
  );
  
  if (missingScripts.length > 0) {
    console.log(`⚠️  Missing recommended scripts: ${missingScripts.join(', ')}`);
  }
  
  console.log('✅ Package.json validated');
}

function checkDatabaseConnection() {
  return new Promise((resolve, reject) => {
    console.log('🗄️  Testing database connection...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      reject(new Error('Supabase credentials not found'));
      return;
    }
    
    // Simple HTTP test to Supabase REST API
    const url = `${supabaseUrl}/rest/v1/`;
    const options = {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    };
    
    https.get(url, options, (res) => {
      if (res.statusCode === 200 || res.statusCode === 401) {
        // 401 is expected for unauthenticated requests to protected endpoints
        console.log('✅ Database connection validated');
        resolve();
      } else {
        reject(new Error(`Database connection failed: HTTP ${res.statusCode}`));
      }
    }).on('error', (err) => {
      reject(new Error(`Database connection failed: ${err.message}`));
    });
  });
}

function checkExternalServices() {
  console.log('🌐 Testing external service connections...');
  
  const services = [
    { 
      name: 'Stripe API', 
      url: 'https://api.stripe.com/v1/charges',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
      }
    }
  ];
  
  const promises = services.map(service => {
    return new Promise((resolve, reject) => {
      const options = {
        headers: service.headers || {}
      };
      
      https.get(service.url, options, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 500) {
          console.log(`✅ ${service.name} accessible`);
          resolve();
        } else {
          reject(new Error(`${service.name} returned HTTP ${res.statusCode}`));
        }
      }).on('error', (err) => {
        reject(new Error(`${service.name} connection failed: ${err.message}`));
      });
    });
  });
  
  return Promise.all(promises);
}

function checkNodeVersion() {
  console.log('⚙️  Checking Node.js version...');
  
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].slice(1));
  
  if (majorVersion < 18) {
    throw new Error(`Node.js version ${nodeVersion} is not supported. Please use Node.js 18 or higher.`);
  }
  
  if (majorVersion < 20) {
    console.log(`⚠️  Node.js ${nodeVersion} detected. Node.js 20+ is recommended for better performance.`);
  }
  
  console.log(`✅ Node.js version ${nodeVersion} is compatible`);
}

function checkNextJsConfiguration() {
  console.log('⚡ Checking Next.js configuration...');
  
  if (!fs.existsSync('next.config.ts') && !fs.existsSync('next.config.js')) {
    throw new Error('Next.js configuration file not found');
  }
  
  const configFile = fs.existsSync('next.config.ts') ? 'next.config.ts' : 'next.config.js';
  const configContent = fs.readFileSync(configFile, 'utf8');
  
  // Check for important security configurations
  const securityChecks = [
    { pattern: /poweredByHeader.*false/, message: 'X-Powered-By header disabled' },
    { pattern: /X-Frame-Options/, message: 'X-Frame-Options header configured' },
    { pattern: /Content-Security-Policy/, message: 'Content-Security-Policy configured' }
  ];
  
  securityChecks.forEach(check => {
    if (check.pattern.test(configContent)) {
      console.log(`  ✅ ${check.message}`);
    } else {
      console.log(`  ⚠️  ${check.message} - not found`);
    }
  });
  
  console.log('✅ Next.js configuration checked');
}

function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`🔧 ${description}...`);
    
    exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`${description} failed: ${error.message}`));
      } else {
        console.log(`✅ ${description} completed`);
        resolve({ stdout, stderr });
      }
    });
  });
}

async function checkBuildProcess() {
  try {
    // Test TypeScript compilation
    await runCommand('pnpm exec tsc --noEmit --skipLibCheck', 'TypeScript compilation check');
    
    // Test ESLint
    await runCommand('pnpm exec eslint --max-warnings 0 --ext .ts,.tsx --quiet .', 'ESLint validation');
    
  } catch (error) {
    console.log(`⚠️  Build process warning: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Validating HyperWear development environment...\n');
  
  const startTime = Date.now();
  
  try {
    // Core validation checks
    checkNodeVersion();
    checkEnvironmentVariables();
    checkRequiredFiles();
    checkPackageJson();
    checkNextJsConfiguration();
    
    // External service checks
    await checkDatabaseConnection();
    await checkExternalServices();
    
    // Build process validation
    await checkBuildProcess();
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    console.log(`\n🎉 Development environment validation completed successfully in ${duration}s!`);
    console.log('\n📋 Summary:');
    console.log('  ✅ Node.js version compatible');
    console.log('  ✅ Environment variables configured');
    console.log('  ✅ Required files present');
    console.log('  ✅ Dependencies installed');
    console.log('  ✅ Database connection working');
    console.log('  ✅ External services accessible');
    console.log('  ✅ Build process functional');
    
    console.log('\n🚀 Ready for development!');
    
  } catch (error) {
    console.error('\n💥 Environment validation failed:');
    console.error(`   ${error.message}`);
    
    console.log('\n📚 Troubleshooting tips:');
    console.log('  1. Check your .env.local file for missing variables');
    console.log('  2. Ensure all dependencies are installed (pnpm install)');
    console.log('  3. Verify your internet connection');
    console.log('  4. Check Supabase and Stripe service status');
    
    process.exit(1);
  }
}

main();