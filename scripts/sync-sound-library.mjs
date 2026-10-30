#!/usr/bin/env node

/**
 * Vendors the official hello pc OGG library and derives duration/waveform data.
 * Re-run `npm run sync:sounds` when the upstream repository changes.
 * The production site never fetches GitHub or decodes audio at runtime.
 *
 * Requires curl, tar, ffmpeg, and ffprobe in the development environment.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { cp, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_DIR = path.join(ROOT, 'public', 'sounds');
const CATALOG_FILE = path.join(ROOT, 'src', 'data', 'sound-library.generated.json');
const ARCHIVE_URL =
  'https://codeload.github.com/cake-admin/cake-sound-library/tar.gz/refs/heads/main';
const PEAK_COUNT = 96;

const slugify = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/tranistion/g, 'transition')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const deriveIdentity = (sourceName) => {
  const normalized = sourceName
    .replace(/\.ogg$/i, '')
    .trim()
    .replace(/^tranistion right 2$/i, 'transition right 2');
  const match = normalized.match(/^(.*?)(?:\s+(\d+))?$/);
  return {
    familyId: slugify(match?.[1] ?? normalized),
    variant: match?.[2] ? Number(match[2]) : 0,
  };
};

const probeDuration = (file) => {
  const seconds = execFileSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file],
    { encoding: 'utf8' },
  ).trim();
  return Math.round(Number(seconds) * 1000);
};

const derivePeaks = (file) => {
  const pcm = execFileSync(
    'ffmpeg',
    ['-v', 'error', '-i', file, '-ac', '1', '-ar', '8000', '-f', 'f32le', 'pipe:1'],
    { encoding: 'buffer', maxBuffer: 32 * 1024 * 1024 },
  );
  const samples = new Float32Array(
    pcm.buffer,
    pcm.byteOffset,
    Math.floor(pcm.byteLength / Float32Array.BYTES_PER_ELEMENT),
  );
  const bucketSize = Math.max(1, Math.floor(samples.length / PEAK_COUNT));
  const peaks = [];

  for (let bucket = 0; bucket < PEAK_COUNT; bucket += 1) {
    const start = bucket * bucketSize;
    const end = bucket === PEAK_COUNT - 1
      ? samples.length
      : Math.min(samples.length, start + bucketSize);
    let peak = 0;
    for (let index = start; index < end; index += 1) {
      peak = Math.max(peak, Math.abs(samples[index]));
    }
    peaks.push(peak);
  }

  const maxPeak = Math.max(...peaks, 0.0001);
  return peaks.map((peak) => Number((peak / maxPeak).toFixed(3)));
};

const main = async () => {
  const temp = mkdtempSync(path.join(tmpdir(), 'cake-sounds-'));
  const archive = path.join(temp, 'sounds.tgz');
  try {
    execFileSync('curl', ['--fail', '--location', '--silent', '--show-error', ARCHIVE_URL, '-o', archive]);
    execFileSync('tar', ['-xzf', archive, '-C', temp]);
    const sourceDir = readdirSync(temp, { withFileTypes: true })
      .find((entry) => entry.isDirectory() && entry.name.startsWith('cake-sound-library-'));
    if (!sourceDir) throw new Error('Could not locate extracted sound library');

    const sourcePath = path.join(temp, sourceDir.name);
    const sources = readdirSync(sourcePath)
      .filter((name) => /\.ogg$/i.test(name) && name.trim().toLowerCase() !== 'test.ogg')
      .sort((a, b) => a.localeCompare(b));

    await rm(OUTPUT_DIR, { recursive: true, force: true });
    await mkdir(OUTPUT_DIR, { recursive: true });

    const catalog = [];
    for (const sourceName of sources) {
      const sourceFile = path.join(sourcePath, sourceName);
      const { familyId, variant } = deriveIdentity(sourceName);
      const fileName = `${familyId}${variant ? `-${variant}` : ''}.ogg`;
      await cp(sourceFile, path.join(OUTPUT_DIR, fileName));
      catalog.push({
        id: `${familyId}${variant ? `-${variant}` : '-primary'}`,
        familyId,
        sourceName,
        file: fileName,
        variant,
        durationMs: probeDuration(sourceFile),
        peaks: derivePeaks(sourceFile),
      });
    }

    writeFileSync(
      CATALOG_FILE,
      `${JSON.stringify(
        {
          source: 'https://github.com/cake-admin/cake-sound-library',
          generatedAt: new Date().toISOString(),
          peakCount: PEAK_COUNT,
          sounds: catalog,
        },
        null,
        2,
      )}\n`,
    );
    console.log(`Synced ${catalog.length} sounds to ${path.relative(ROOT, OUTPUT_DIR)}`);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
