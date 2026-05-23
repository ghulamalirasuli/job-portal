#!/usr/bin/env node
/**
 * Cross-platform npm script runner.
 *
 * On Windows the Tailwind Oxide and Rollup native `.node` binaries are blocked
 * by some corporate Application Control policies. We work around this by
 * shipping the WASM/WASI variants and forcing them here. On Linux/macOS this
 * is a no-op and the native binaries are used.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const env = { ...process.env };
if (process.platform === 'win32') {
    env.NAPI_RS_FORCE_WASI = '1';
}

const [cmd, ...args] = process.argv.slice(2);
if (!cmd) {
    console.error('Usage: node scripts/run.mjs <bin> [args...]');
    process.exit(1);
}

const binDir = path.resolve('node_modules', '.bin');
const isWin = process.platform === 'win32';
const target = isWin ? path.join(binDir, `${cmd}.cmd`) : path.join(binDir, cmd);

// Quote the binary path to survive cmd.exe word-splitting on paths with spaces.
const command = isWin ? `"${target}"` : target;

const child = spawn(command, args, {
    env,
    stdio: 'inherit',
    shell: true,
});

child.on('error', (err) => {
    console.error(err);
    process.exit(1);
});

child.on('exit', (code) => {
    process.exit(code ?? 1);
});
