/**
 * Status reporting for generator runs: generator code logs outcomes through
 * these functions instead of a UI, and the CLI classifies the run (exit
 * code) from the collected messages.
 */

const messages = {
    errors: [] as string[],
    warnings: [] as string[],
    infos: [] as string[]
};

export function reportError(message: string): void {
    console.log(`[error] ${message}`);
    messages.errors.push(message);
}

export function reportWarning(message: string): void {
    console.log(`[warning] ${message}`);
    messages.warnings.push(message);
}

export function reportInfo(message: string): void {
    console.log(`[info] ${message}`);
    messages.infos.push(message);
}

export function hasErrors(): boolean {
    return messages.errors.length !== 0;
}
