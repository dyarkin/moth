import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { $ } from 'bun';

const ENTRY_POINT = 'src/main.ts';
const DIST_DIR = 'dist';
const RELEASE_DIR = join(DIST_DIR, 'release');
const RELEASE_TARGETS = [
  'darwin-arm64',
  'darwin-x64',
  'linux-arm64',
  'linux-x64',
];

async function compile({
  outFile,
  version,
  target,
}: {
  outFile: string;
  version: string;
  target?: string;
}): Promise<void> {
  // The define value must be a quoted JS expression, otherwise it is compiled
  // as a reference to an undeclared identifier.
  const define = `__MOTH_VERSION__=${JSON.stringify(version)}`;
  const targetArg = target ? [`--target=bun-${target}`] : [];

  await $`bun build --compile ${ENTRY_POINT} --define ${define} ${targetArg} --outfile ${outFile}`.quiet();
}

async function sha256(filePath: string): Promise<string> {
  return createHash('sha256')
    .update(await readFile(filePath))
    .digest('hex');
}

async function resolveReleaseVersion(): Promise<string> {
  const { version } = JSON.parse(await readFile('package.json', 'utf8')) as {
    version: string;
  };
  const tagVersion = process.env.MOTH_RELEASE_VERSION;

  if (tagVersion && tagVersion !== version) {
    throw new Error(
      `Release version mismatch: tag says ${tagVersion}, package.json says ${version}`,
    );
  }

  return version;
}

async function buildRelease(): Promise<void> {
  const version = await resolveReleaseVersion();

  await rm(RELEASE_DIR, { recursive: true, force: true });
  await mkdir(RELEASE_DIR, { recursive: true });

  const checksums: string[] = [];

  for (const target of RELEASE_TARGETS) {
    const targetDir = join(RELEASE_DIR, target);
    const archiveName = `moth-${target}.tar.gz`;
    const archivePath = join(RELEASE_DIR, archiveName);

    await compile({ outFile: join(targetDir, 'moth'), version, target });
    await $`tar -czf ${archivePath} -C ${targetDir} moth`;

    checksums.push(`${await sha256(archivePath)}  ${archiveName}`);
    console.log(`built ${archiveName}`);
  }

  await writeFile(
    join(RELEASE_DIR, 'checksums.txt'),
    `${checksums.join('\n')}\n`,
  );
  console.log(`moth ${version} release built in ${RELEASE_DIR}`);
}

async function buildHost(): Promise<void> {
  const outFile = join(DIST_DIR, 'moth');

  await compile({ outFile, version: 'dev' });
  console.log(`built ${outFile}`);
}

if (process.argv.includes('--release')) {
  await buildRelease();
} else {
  await buildHost();
}
