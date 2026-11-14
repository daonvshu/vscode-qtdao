import * as fs from 'fs';
import path = require('path');
import { generateEntityCode } from './src/codegenerator';
import { hasErrors } from './src/notifier';

/**
 * CLI entry of the qtdao entity generator:
 *   node cli.js <xml-file> [--templates <dir>]
 *
 * Generation writes the entity sources next to the XML file, exactly like
 * the "create entity for qtdao" command of the vscode-qtdao extension.
 * Exit code is 0 when no error was reported and 1 otherwise.
 */

const args = process.argv.slice(2);
let xmlPath = '';
let templatesDir = '';
for (let i = 0; i < args.length; i++) {
    if (args[i] === '--templates') {
        templatesDir = args[++i] || '';
    } else if (!xmlPath) {
        xmlPath = args[i];
    }
}

if (!xmlPath) {
    console.error('Usage: node cli.js <xml-file> [--templates <dir>]');
    process.exit(2);
}

xmlPath = path.resolve(xmlPath);
if (!fs.existsSync(xmlPath)) {
    console.error(`[error] file not found: ${xmlPath}`);
    process.exit(2);
}

if (!templatesDir) {
    templatesDir = path.join(__dirname, '..', 'templates');
}
templatesDir = path.resolve(templatesDir);

//last-resort reporters so unexpected failures (e.g. file write permission)
//still reach the caller as a parseable [error] line with a nonzero exit code
process.on('uncaughtException', (err: Error) => {
    console.error('[error] ' + (err && err.message ? err.message : err));
    process.exit(1);
});
process.on('unhandledRejection', (reason: unknown) => {
    const err = reason as Error;
    console.error('[error] ' + (err && err.message ? err.message : reason));
    process.exit(1);
});

generateEntityCode(xmlPath, templatesDir).then(() => {
    process.exit(hasErrors() ? 1 : 0);
}).catch((err: Error) => {
    console.error('[error] ' + (err && err.message ? err.message : err));
    process.exit(1);
});
