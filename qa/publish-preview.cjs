// Publishes the current build to the PREVIEW repository only: node qa/publish-preview.cjs "<commit message>"
// Target: github.com/SebastianBF1/pandonia-preview (GitHub Pages from main → https://sebastianbf1.github.io/pandonia-preview/).
// Refuses any other remote. Never touches Pandonia-ApS/pandoina-website-v2 or www.pandonia.com.
// Run node qa/run.cjs first; publish only when every check passed.
const fs = require('fs'); const os = require('os'); const path = require('path');
const { execFileSync } = require('child_process');
const PREVIEW_REPO = 'https://github.com/SebastianBF1/pandonia-preview.git';
const msg = process.argv[2];
if (!msg) { console.error('usage: node qa/publish-preview.cjs "<commit message>"'); process.exit(1); }
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();

const work = fs.mkdtempSync(path.join(fs.realpathSync.native(os.tmpdir()), 'pandonia-publish-'));
const repo = path.join(work, 'repo'), site = path.join(work, 'site');
execFileSync('git', ['clone', '-q', '--depth', '1', PREVIEW_REPO, repo]);
if (git(repo, 'remote', 'get-url', 'origin') !== PREVIEW_REPO) throw new Error('not the preview repository; refusing');
execFileSync(process.execPath, [path.join(__dirname, 'build-preview.cjs'), site], { stdio: 'inherit' });
// replace everything but the repository's own README and git data
const readme = fs.existsSync(path.join(repo, 'README.md')) ? fs.readFileSync(path.join(repo, 'README.md')) : null;
for (const e of fs.readdirSync(repo)) if (e !== '.git') fs.rmSync(path.join(repo, e), { recursive: true, force: true });
fs.cpSync(site, repo, { recursive: true });
if (readme) fs.writeFileSync(path.join(repo, 'README.md'), readme);
git(repo, 'add', '-A');
if (!git(repo, 'status', '--porcelain')) { console.log('preview already up to date'); process.exit(0); }
const source = execFileSync('git', ['-C', path.join(__dirname, '..'), 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
git(repo, 'commit', '-q', '-m', msg, '-m', `Built from pandoina-website-v2 ${source} (working tree) with qa/build-preview.cjs.`, '-m', 'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>');
git(repo, 'push', '-q', 'origin', 'HEAD:main');
console.log('published', git(repo, 'log', '--oneline', '-1'), '→ https://sebastianbf1.github.io/pandonia-preview/');
