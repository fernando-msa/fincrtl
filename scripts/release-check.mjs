import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

async function run() {
  const root = process.cwd();
  const packageJsonPath = path.join(root, 'package.json');
  const changelogPath = path.join(root, 'CHANGELOG.md');

  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  const changelog = await readFile(changelogPath, 'utf8');

  const currentVersion = packageJson.version;
  const expectedHeader = `## [${currentVersion}]`;

  const checks = [
    {
      name: 'CHANGELOG contém a versão atual',
      ok: changelog.includes(expectedHeader),
      detail: `Esperado encontrar: ${expectedHeader}`
    },
    {
      name: 'CHANGELOG possui seção semântica de Bug Fixes/Features',
      ok: /###\s+(Bug Fixes|Features|Added|Changed|Fixed)/.test(changelog),
      detail: 'Esperado encontrar subtítulos semânticos de release.'
    },
    {
      name: 'Página pública de releases está disponível no app',
      ok: await access(path.join(root, 'app/(public)/releases/page.tsx')).then(() => true).catch(() => false),
      detail: 'Arquivo esperado: app/(public)/releases/page.tsx'
    }
  ];

  const failed = checks.filter((item) => !item.ok);

  for (const item of checks) {
    const prefix = item.ok ? '✅' : '❌';
    console.log(`${prefix} ${item.name}`);
    if (!item.ok) {
      console.log(`   ${item.detail}`);
    }
  }

  if (failed.length > 0) {
    process.exit(1);
  }
}

run().catch((error) => {
  console.error('❌ Falha ao executar release-check:', error);
  process.exit(1);
});
