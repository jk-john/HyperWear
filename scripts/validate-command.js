// scripts/validate-command.js
import { appendFileSync } from "node:fs";

const command = process.argv.slice(2).join(" ");
const timestamp = new Date().toISOString();

const result = {
  isValid: true,
  severity: null,
  violations: [],
};

// Core rule definitions
const SECURITY_RULES = {
  DANGEROUS_PATTERNS: [
    /^rm\s+-rf\s+\/$/,
    /^rm\s+-rf\s+\/etc\//,
    /^rm\s+-rf\s+\/usr\//,
    /^rm\s+-rf\s+\/bin\//,
    /^rm\s+-rf\s+\/var\//,
    /^rm\s+-rf\s+\/home\//,
    /^dd\s+.*\/dev\/.*/,
    /^mkfs\s+/,
    /^shred\s+/,
    /^format\s+/,
    /^sudo\s+/,
    /&&/,
    /\|\|/,
    /;.*(rm|sudo|wget|curl)/,
    /wget\s+.*\|.*sh/,
    /curl\s+.*\|.*sh/,
    /\/etc\/passwd/,
    /\/etc\/shadow/,
  ],
  PROTECTED_PATHS: [
    "/etc/",
    "/usr/",
    "/bin/",
    "/dev/",
    "/proc/",
    "/boot/",
    "/home/",
  ],
};

// Check dangerous regex patterns
for (const pattern of SECURITY_RULES.DANGEROUS_PATTERNS) {
  if (pattern.test(command)) {
    result.isValid = false;
    result.severity = "CRITICAL";
    result.violations.push(`Dangerous pattern detected: ${pattern.source}`);
  }
}

// Check for protected path access
for (const path of SECURITY_RULES.PROTECTED_PATHS) {
  if (command.includes(path)) {
    result.isValid = false;
    result.severity = result.severity || "HIGH";
    result.violations.push(`Access to protected path: ${path}`);
  }
}

// Safety: catch overly long or obfuscated commands
if (command.length > 2000) {
  result.isValid = false;
  result.severity = "MEDIUM";
  result.violations.push("Command too long (potential buffer overflow?)");
}

if (/[^\x00-\x7F]/.test(command)) {
  result.isValid = false;
  result.severity = "HIGH";
  result.violations.push("Binary or encoded content detected");
}

// Logging and exit
if (!result.isValid) {
  const logEntry = {
    timestamp,
    command,
    ...result,
  };

  appendFileSync("security.log", JSON.stringify(logEntry) + "\n");

  console.error("🚨 Command blocked by validate-command.js:");
  console.error(`❌ ${command}`);
  console.error(result.violations.join("\n"));
  process.exit(1);
}

process.exit(0);
