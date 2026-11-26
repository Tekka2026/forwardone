// Password protection for the work-in-progress site (owner, 2026-11-17: the
// address is known to people who should not see it yet).
//
// Runs after `astro build`, in the deploy workflow only. Every HTML page in
// dist/ except the open ones below is replaced:
// - with SITE_PASSWORD set (a GitHub Actions secret): encrypted with
//   StatiCrypt. The page opens after entering the password; "Remember me"
//   keeps it for 30 days on that device, and as all pages share one salt,
//   one entry unlocks the whole site.
// - without it: a plain "work in progress" page, so nothing shows until a
//   password is set.
// Open, as before: /the-pitch (also live on Webflow) and /brand (the brand
// guidelines). Images, video, fonts, CSS and scripts are not HTML and stay
// reachable by their direct address; the page text and layout do not.
//
// Run: SITE_PASSWORD=… node scripts/protect.mjs [dist]

import { readdirSync, statSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, dirname, sep } from 'node:path';
import { execFileSync } from 'node:child_process';

const DIST = process.argv[2] ?? 'dist';
const OPEN = ['the-pitch', 'brand']; // top-level folders that stay open
// One salt for every page, so the remembered password unlocks them all.
// Public by design: the salt is not a secret, the password is.
const SALT = '7f3c9a1e5b2d4c8f0a6e1b9d3c5f7a2e';
const password = process.env.SITE_PASSWORD?.trim() ?? '';

function pages(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...pages(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}
const isOpen = (file) => OPEN.includes(relative(DIST, file).split(sep)[0]);
const files = pages(DIST).filter((f) => !isOpen(f));

const WIP = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>FORWARD.one</title>
<style>html,body{height:100%;margin:0}body{display:grid;place-items:center;background:#0f121a;color:#fff;font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}p{margin:0;opacity:.7}</style>
</head><body><p>Work in progress.</p></body></html>
`;

if (!password) {
  for (const f of files) writeFileSync(f, WIP);
  console.log(`protect: no SITE_PASSWORD set, ${files.length} pages replaced by a work-in-progress page`);
} else {
  const bin = join('node_modules', '.bin', 'staticrypt');
  // StatiCrypt's own template, with two changes (owner, 2026-11-25: a white
  // flash on reload): the page behind the password takes the background of
  // the page it unlocks (the secondary colour, set per page below), and the
  // loading spinner is not shown, so a remembered password goes straight
  // from that colour to the page.
  const template = join(tmpdir(), 'forwardone-staticrypt-template.html');
  writeFileSync(
    template,
    readFileSync(join('node_modules', 'staticrypt', 'lib', 'password_template.html'), 'utf8').replace(
      '</head>',
      '<style>html,body{background:/*[|template_color_secondary|]*/0}.staticrypt-spinner{visibility:hidden}</style></head>',
    ),
  );
  for (const f of files) {
    // Pages that open dark (the homepage and others with a dark header).
    const dark = /site-top--dark/.test(readFileSync(f, 'utf8'));
    execFileSync(bin, [
      f,
      '-d', dirname(f),
      '-s', SALT,
      '-c', 'false',
      '--short',
      '--remember', '30',
      '--template-title', 'FORWARD.one',
      '--template-instructions', 'Work in progress. Enter the password to continue.',
      '--template-button', 'Open',
      '--template-placeholder', 'Password',
      '--template-remember', 'Remember me on this device',
      '--template-error', 'That is not the password.',
      '--template-color-primary', '#0f121a',
      '--template-color-secondary', dark ? '#0f121a' : '#f5f5f5',
      '-t', template,
    ], { env: { ...process.env, STATICRYPT_PASSWORD: password }, stdio: 'ignore' });
  }
  console.log(`protect: ${files.length} pages encrypted (open: ${OPEN.map((o) => '/' + o).join(', ')})`);
}
