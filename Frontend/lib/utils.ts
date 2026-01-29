
export function detectLanguage(content: string): string {
    const code = content.slice(0, 1000); // Check first 1000 chars

    // HTML / XML
    if (/<!DOCTYPE html>/i.test(code) || /<html/i.test(code) || (/<[a-z][\s\S]*>/i.test(code) && /<\/[a-z]+>/i.test(code))) {
        return 'html';
    }

    // CSS
    if (/body\s*\{/.test(code) || (/[a-z0-9-]+\s*:\s*[a-z0-9#]+;/i.test(code) && /\{[\s\S]*\}/.test(code))) {
        return 'css';
    }

    // JSON
    if (/^\s*[\{\[]/.test(code) && /[\}\]]\s*$/.test(content.trim()) && /"[\w]+"(\s*:\s*)?/.test(code)) {
        return 'json';
    }

    // SQL
    if (/(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\s+\w+/i.test(code) && /FROM|INTO|TABLE|DATABASE/i.test(code)) {
        return 'sql';
    }

    // Python
    if (/def\s+\w+\(/.test(code) || /import\s+[\w.]+(\s+as\s+\w+)?/.test(code) || /from\s+[\w.]+\s+import/.test(code) || /print\(/.test(code) || /if\s+__name__\s*==\s*['"]__main__['"]:/.test(code)) {
        return 'python';
    }

    // Java
    if (/public\s+class\s+\w+/.test(code) || /public\s+static\s+void\s+main/.test(code) || /System\.out\.println/.test(code)) {
        return 'java';
    }

    // C#
    if (/using\s+System;/.test(code) || /namespace\s+[\w.]+/.test(code) || /Console\.WriteLine/.test(code)) {
        return 'csharp';
    }

    // Bash / Shell
    if (/^#!\/bin\/(bash|sh|zsh)/.test(code) || /echo\s+['"]/.test(code) || /sudo\s+/.test(code)) {
        return 'bash';
    }

    // Go
    if (/package\s+main/.test(code) || /func\s+main\(/.test(code) || /fmt\.Println/.test(code)) {
        return 'go';
    }

    // Rust
    if (/fn\s+main\(/.test(code) || /let\s+mut\s+/.test(code) || /println!/.test(code)) {
        return 'rust';
    }

    // PHP
    if (/<\?php/.test(code) || /\$\w+\s*=/.test(code)) {
        return 'php';
    }

    // TypeScript / JavaScript (catch-all for C-like mostly)
    const jsKeywords = ['function', 'const ', 'let ', 'var ', 'import ', 'export ', 'class ', 'return ', 'console.log', '=>'];
    if (jsKeywords.some(k => code.includes(k))) {
        return 'typescript';
    }

    return 'text';
}
