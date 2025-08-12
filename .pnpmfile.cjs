// pnpm configuration file for consistent package management

module.exports = {
  hooks: {
    readPackage(pkg, context) {
      // Ensure consistent dependency versions
      if (pkg.name === 'hyperwear') {
        // Force specific versions for security-critical packages
        if (pkg.dependencies) {
          // Ensure latest security patches
          pkg.dependencies['@supabase/supabase-js'] = '^2.50.0';
          pkg.dependencies['stripe'] = '^18.2.1';
          pkg.dependencies['zod'] = '^3.23.8';
        }
        
        if (pkg.devDependencies) {
          // Ensure consistent tooling versions
          pkg.devDependencies['typescript'] = '^5';
          pkg.devDependencies['eslint'] = '^9';
          pkg.devDependencies['glob'] = '^11.0.0';
        }
      }
      
      return pkg;
    }
  }
};