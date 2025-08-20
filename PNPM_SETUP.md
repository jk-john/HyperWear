# 📦 pnpm Setup Guide for HyperWear

This guide covers the pnpm-specific configurations and optimizations for the HyperWear project.

## 🚀 Why pnpm?

- **Faster installs**: Symlinked node_modules structure
- **Disk space efficient**: Content-addressed storage
- **Strict dependency resolution**: Prevents phantom dependencies
- **Better security**: Isolated dependency trees
- **Monorepo support**: Built-in workspace management

## ⚙️ Installation

### **Install pnpm globally**
```bash
# Via npm
npm install -g pnpm

# Via corepack (recommended)
corepack enable
corepack prepare pnpm@latest --activate

# Via standalone installer
curl -fsSL https://get.pnpm.io/install.sh | sh
```

### **Verify installation**
```bash
pnpm --version
# Should show version 8.x or higher
```

## 🔧 Project Configuration

### **Package.json Scripts (pnpm-optimized)**
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build", 
    "start": "next start",
    "lint": "next lint",
    "test:edge-compat": "node scripts/check-edge-compatibility.js",
    "test:dev-env": "node scripts/validate-dev-environment.js",
    "test:security": "pnpm test:edge-compat && pnpm test:dev-env",
    "test:security-ci": "pnpm test:edge-compat",
    "predev": "pnpm test:security-ci",
    "prebuild": "pnpm test:security-ci"
  }
}
```

### **pnpm Configuration (.npmrc)**
```ini
# Create .npmrc in project root
auto-install-peers=true
prefer-frozen-lockfile=true
save-exact=true
strict-peer-dependencies=false
shamefully-hoist=false
```

### **pnpm Workspace (if using monorepo)**
```yaml
# pnpm-workspace.yaml
packages:
  - '.'
  - 'packages/*'
  - 'apps/*'
```

## 🛠️ Development Commands

### **Basic Commands**
```bash
# Install dependencies
pnpm install

# Install with frozen lockfile (CI/production)
pnpm install --frozen-lockfile

# Add dependencies
pnpm add package-name
pnpm add -D package-name  # dev dependency
pnpm add -g package-name  # global

# Remove dependencies  
pnpm remove package-name

# Update dependencies
pnpm update
pnpm update package-name
```

### **Security Commands**
```bash
# Run security audit
pnpm audit

# Fix vulnerabilities
pnpm audit --fix

# Check for outdated packages
pnpm outdated

# Update all to latest
pnpm update --latest
```

### **Project-specific Commands**
```bash
# Development with pre-checks
pnpm dev

# Build with security validation
pnpm build

# Run security tests
pnpm test:security

# Edge Runtime compatibility check
pnpm test:edge-compat

# Environment validation
pnpm test:dev-env
```

## 🔍 pnpm vs npm/yarn Differences

### **Command Mapping**
| npm/yarn | pnpm | Notes |
|----------|------|-------|
| `npm install` | `pnpm install` | Faster, uses symlinks |
| `npm run script` | `pnpm script` | Can omit 'run' |
| `npx command` | `pnpm exec command` | Uses pnpm's binary |
| `npm audit` | `pnpm audit` | Better performance |
| `yarn dlx` | `pnpm dlx` | Download and execute |

### **File Structure Differences**
```
# pnpm structure (symlinked)
node_modules/
├── .pnpm/          # Content-addressed store
├── package-a/      # Symlink to .pnpm
└── package-b/      # Symlink to .pnpm

# vs npm/yarn (hoisted)
node_modules/
├── package-a/      # Physical directory
├── package-b/      # Physical directory
└── nested-deps/    # Hoisted dependencies
```

## 🚨 Common Issues & Solutions

### **Issue: "Module not found" errors**
```bash
# Solution: Check for phantom dependencies
pnpm list --depth=0

# Add missing peer dependencies
pnpm add package-name
```

### **Issue: CI/CD failures**
```bash
# Solution: Use frozen lockfile
pnpm install --frozen-lockfile

# Ensure pnpm-lock.yaml is committed
git add pnpm-lock.yaml
```

### **Issue: Binary not found**
```bash
# Solution: Use pnpm exec
pnpm exec tsc --noEmit
pnpm exec eslint .

# Or add to package.json scripts
"typecheck": "tsc --noEmit"
```

### **Issue: Peer dependency warnings**
```bash
# Solution: Configure .npmrc
echo "auto-install-peers=true" >> .npmrc

# Or manually install peers
pnpm add peer-dependency-name
```

## 🔧 Advanced Configuration

### **pnpm Hooks (.pnpmfile.cjs)**
```javascript
module.exports = {
  hooks: {
    readPackage(pkg, context) {
      // Force consistent versions
      if (pkg.dependencies?.['@supabase/supabase-js']) {
        pkg.dependencies['@supabase/supabase-js'] = '^2.50.0';
      }
      return pkg;
    }
  }
};
```

### **Environment Variables**
```bash
# .env for pnpm-specific settings
PNPM_HOME="/path/to/pnpm"
PATH="$PNPM_HOME:$PATH"

# CI/CD optimization
PNPM_CACHE_FOLDER="/tmp/pnpm-cache"
```

### **Performance Optimization**
```bash
# Enable caching in CI
export PNPM_HOME="/tmp/pnpm"
export PATH="$PNPM_HOME:$PATH"

# Use specific pnpm version in CI
corepack use pnpm@8.15.0
```

## 🚀 GitHub Actions Integration

### **Optimized CI Configuration**
```yaml
- name: Setup pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 8

- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'pnpm'

- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

## 📊 Performance Benefits

### **Installation Speed**
- **pnpm**: ~30-50% faster than npm
- **pnpm**: ~20-30% faster than yarn v1
- **Concurrent installs**: Parallel package resolution

### **Disk Usage**
- **pnpm**: ~30-60% less disk space
- **Shared store**: Packages stored once globally
- **Symlinks**: No duplication across projects

### **Security**
- **Strict isolation**: No phantom dependencies
- **Better audit**: More accurate vulnerability detection
- **Lockfile integrity**: Content-based verification

## 🔒 Security Best Practices

### **Lockfile Management**
```bash
# Always commit lockfile
git add pnpm-lock.yaml

# Verify lockfile integrity
pnpm install --frozen-lockfile

# Regular security updates
pnpm audit
pnpm update --latest
```

### **Dependency Isolation**
```bash
# Check for phantom dependencies
pnpm list --depth=0

# Verify package access
pnpm why package-name

# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📚 Resources

- **Official Documentation**: https://pnpm.io/
- **Migration Guide**: https://pnpm.io/migration
- **Benchmarks**: https://pnpm.io/benchmarks
- **CLI Reference**: https://pnpm.io/cli/add
- **Troubleshooting**: https://pnpm.io/faq

## 🎯 Project-Specific Notes

### **HyperWear Configuration**
- **pnpm version**: 8.15.0+ required
- **Node.js version**: 18.0.0+ required (20.0.0+ recommended)
- **Security checks**: Integrated into pre-dev/pre-build hooks
- **Edge Runtime**: All scripts tested for compatibility
- **CI/CD**: Optimized for GitHub Actions with caching

### **Maintenance Schedule**
- **Weekly**: `pnpm audit` and security updates
- **Monthly**: `pnpm outdated` and dependency updates
- **Quarterly**: Major version upgrades and configuration review