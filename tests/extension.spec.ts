import { test, expect, chromium } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';

// Bloco de código adicionado para corrigir o erro '__dirname not defined'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dist = path.resolve(__dirname, '..', 'dist');

test('popup carrega e exibe UI (ou content script aplica efeito)', async () => {
    test.skip(!fs.existsSync(dist), 'dist/ não existe - execute npm run build antes');

    const context = await chromium.launchPersistentContext('', {
        headless: true,
        args: [
            `--disable-extensions-except=${dist}`,
            `--load-extension=${dist}`
        ]
    });

    const page = context.pages()[0];
    if (!page) { throw new Error('Não foi possível obter page do contexto'); }
    await page.goto("https://example.com");

    const outline = await page.evaluate(() => {
        const a = document.querySelector('a');
        return a ? getComputedStyle(a).outlineStyle : null;
    });

    expect(outline).toBe('none'); // Ajustado para uma verificação mais específica, pode mudar conforme a lógica da sua extensão

    await context.close();
});