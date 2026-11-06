// TextKit — pure, framework-free logic for every tool.
// No DOM access here: every function takes plain values and returns plain
// values, so this module can be imported by Node for unit tests as well as
// bundled into the browser by Astro.

// ---------------------------------------------------------------- JSON ----

export function jsonErrorPosition(text, err) {
  // V8-style messages carry "at position N"; fall back to end of input.
  const m = /position (\d+)/i.exec(err?.message || '');
  const pos = m ? parseInt(m[1], 10) : text.length;
  const before = text.slice(0, pos);
  const line = before.split('\n').length;
  const column = pos - before.lastIndexOf('\n');
  return { position: pos, line, column };
}

export function jsonValidate(text) {
  try {
    JSON.parse(text);
    return { valid: true, error: null, line: null, column: null };
  } catch (err) {
    const p = jsonErrorPosition(text, err);
    return { valid: false, error: err.message, line: p.line, column: p.column, position: p.position };
  }
}

export function jsonFormat(text, indent = 2) {
  const value = JSON.parse(text);
  const space = indent === 'tab' ? '\t' : Number(indent) || 2;
  return JSON.stringify(value, null, space);
}

export function jsonMinify(text) {
  return JSON.stringify(JSON.parse(text));
}

// ------------------------------------------------------------ JSON → CSV ---

function csvCell(v) {
  if (v === null || v === undefined) return '';
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

export function jsonToCsv(input) {
  const data = typeof input === 'string' ? JSON.parse(input) : input;
  const rows = Array.isArray(data) ? data : [data];
  if (rows.length === 0) return '';
  const headers = [];
  for (const row of rows) {
    if (row && typeof row === 'object') {
      for (const k of Object.keys(row)) if (!headers.includes(k)) headers.push(k);
    }
  }
  if (headers.length === 0) throw new Error('JSON must be an object or an array of objects.');
  const lines = [headers.map(csvCell).join(',')];
  for (const row of rows) lines.push(headers.map((h) => csvCell(row?.[h])).join(','));
  return lines.join('\n');
}

// -------------------------------------------------------------- Encoding ---

export function base64Encode(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

export function base64Decode(b64) {
  const clean = String(b64).replace(/\s+/g, '');
  let bin;
  try {
    bin = atob(clean);
  } catch {
    throw new Error('Input is not valid Base64.');
  }
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error('Decoded bytes are not valid UTF-8 text.');
  }
}

export function urlEncode(text, component = true) {
  return component ? encodeURIComponent(text) : encodeURI(text);
}

export function urlDecode(text, component = true) {
  try {
    return component ? decodeURIComponent(text) : decodeURI(text);
  } catch {
    throw new Error('Input contains malformed percent-encoding.');
  }
}

export async function hashText(text, algo = 'SHA-256') {
  const data = new TextEncoder().encode(text);
  const digest = await globalThis.crypto.subtle.digest(algo, data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ------------------------------------------------------------ Word count ---

export function wordCount(text) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  const sentences = trimmed ? (trimmed.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) || []).filter((s) => s.trim()) : [];
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()) : [];
  const readingMinutes = words.length / 200;
  return {
    words: words.length,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    uniqueWords: new Set(words.map((w) => w.toLowerCase())).size,
    longestWord: words.reduce((a, w) => (w.length > a.length ? w : a), ''),
    readingTimeSeconds: Math.round(readingMinutes * 60),
    speakingTimeSeconds: Math.round((words.length / 150) * 60),
  };
}

// ---------------------------------------------------------- Case convert ---

function splitWords(text) {
  return String(text)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[\s_\-]+/)
    .map((w) => w.trim())
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

const cap = (w) => (w ? w[0].toUpperCase() + w.slice(1) : w);

export function caseConvert(text, type) {
  const words = splitWords(text);
  switch (type) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'title': return words.map(cap).join(' ');
    case 'sentence': {
      const lower = text.toLowerCase();
      return lower.replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (s) => s.toUpperCase());
    }
    case 'camel': return words.map((w, i) => (i === 0 ? w : cap(w))).join('');
    case 'pascal': return words.map(cap).join('');
    case 'snake': return words.join('_');
    case 'kebab': return words.join('-');
    case 'constant': return words.join('_').toUpperCase();
    default: throw new Error('Unknown case type: ' + type);
  }
}

// -------------------------------------------------------------- Generators -

export function uuidV4() {
  const b = new Uint8Array(16);
  globalThis.crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

const PW_SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?',
};
const AMBIGUOUS = /[Il1O0`'"|\\]/g;

export function passwordGen(opts = {}) {
  const { length = 16, lower = true, upper = true, digits = true, symbols = true, excludeAmbiguous = false } = opts;
  let pool = '';
  if (lower) pool += PW_SETS.lower;
  if (upper) pool += PW_SETS.upper;
  if (digits) pool += PW_SETS.digits;
  if (symbols) pool += PW_SETS.symbols;
  if (excludeAmbiguous) pool = pool.replace(AMBIGUOUS, '');
  if (!pool) throw new Error('Select at least one character set.');
  if (length < 1) throw new Error('Length must be at least 1.');
  const out = [];
  const max = Math.floor(256 / pool.length) * pool.length; // rejection sampling: no modulo bias
  while (out.length < length) {
    const buf = new Uint8Array(length * 2);
    globalThis.crypto.getRandomValues(buf);
    for (const byte of buf) {
      if (byte < max && out.length < length) out.push(pool[byte % pool.length]);
    }
  }
  return out.join('');
}

export function passwordEntropy(opts = {}) {
  const { length = 16, lower = true, upper = true, digits = true, symbols = true, excludeAmbiguous = false } = opts;
  let pool = '';
  if (lower) pool += PW_SETS.lower;
  if (upper) pool += PW_SETS.upper;
  if (digits) pool += PW_SETS.digits;
  if (symbols) pool += PW_SETS.symbols;
  if (excludeAmbiguous) pool = pool.replace(AMBIGUOUS, '');
  if (!pool) return 0;
  return Math.round(length * Math.log2(pool.length));
}

// ------------------------------------------------------------- Timestamp ---

export function timestampToDate(value, unit = 'auto') {
  let v = Number(value);
  if (!Number.isFinite(v)) throw new Error('Timestamp must be a number.');
  let u = unit;
  if (u === 'auto') u = Math.abs(v) >= 1e12 ? 'ms' : 's';
  const ms = u === 'ms' ? v : v * 1000;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) throw new Error('Timestamp is out of range.');
  return { date, iso: date.toISOString(), seconds: Math.floor(ms / 1000), millis: ms, unitUsed: u };
}

export function dateToTimestamp(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) throw new Error('Invalid date.');
  return { seconds: Math.floor(d.getTime() / 1000), millis: d.getTime(), iso: d.toISOString() };
}

// ------------------------------------------------------------------ Diff ---

// Simple LCS-based line diff. Returns [{type: 'same'|'add'|'remove', text}].
export function diffLines(aText, bText) {
  const a = String(aText).split('\n');
  const b = String(bText).split('\n');
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Uint32Array(n + 1));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) { out.push({ type: 'same', text: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ type: 'remove', text: a[i] }); i++; }
    else { out.push({ type: 'add', text: b[j] }); j++; }
  }
  while (i < m) out.push({ type: 'remove', text: a[i++] });
  while (j < n) out.push({ type: 'add', text: b[j++] });
  return out;
}

// ----------------------------------------------------------------- Lorem ---

const LOREM_WORDS = ('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum perspiciatis unde omnis iste natus error voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis quasi architecto beatae vitae dicta explicabo nemo enim ipsam voluptatem quia voluptas aspernatur odit aut fugit consequuntur magni dolores eos ratione sequi nesciunt neque porro quisquam numquam eius modi tempora incidunt magnam quaerat').split(' ');

function loremSentence(rand) {
  const len = 6 + Math.floor(rand() * 9);
  const words = [];
  for (let i = 0; i < len; i++) words.push(LOREM_WORDS[Math.floor(rand() * LOREM_WORDS.length)]);
  const s = words.join(' ');
  return s[0].toUpperCase() + s.slice(1) + '.';
}

export function loremGen({ type = 'paragraphs', count = 3, startClassic = true } = {}) {
  // Deterministic rotation instead of Math.random keeps tests stable;
  // the browser page reshuffles the seed per click via loremGenSeeded too.
  let seed = 42;
  const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  return loremGenSeeded({ type, count, startClassic }, rand);
}

export function loremGenSeeded({ type = 'paragraphs', count = 3, startClassic = true } = {}, rand = Math.random) {
  const classic = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  if (type === 'words') {
    const words = [];
    if (startClassic) words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
    while (words.length < count) words.push(LOREM_WORDS[Math.floor(rand() * LOREM_WORDS.length)]);
    return words.slice(0, count).join(' ');
  }
  if (type === 'sentences') {
    const out = [];
    if (startClassic && count >= 1) out.push(classic);
    while (out.length < count) out.push(loremSentence(rand));
    return out.slice(0, count).join(' ');
  }
  const paras = [];
  for (let p = 0; p < count; p++) {
    const sentences = [];
    if (p === 0 && startClassic) sentences.push(classic);
    const target = 4 + Math.floor(rand() * 3);
    while (sentences.length < target) sentences.push(loremSentence(rand));
    paras.push(sentences.join(' '));
  }
  return paras.join('\n\n');
}
