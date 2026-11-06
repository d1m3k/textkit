// TextKit — site identity and the tool catalogue.
// Every page, hub, sitemap entry and footer link is generated from this file.

export const SITE_NAME = 'TextKit';
export const SITE_URL = 'https://d1m3k.github.io';
export const BASE_PATH = '/textkit';
export const SITE_TAGLINE = 'Free developer & text tools that run entirely in your browser';
export const SITE_DESCRIPTION =
  'TextKit is a free collection of developer and text tools — JSON formatting, Base64, hashing, diffing and more — that run 100% in your browser. Nothing you paste is uploaded.';

export function withBase(path: string): string {
  if (path === '/') return BASE_PATH + '/';
  return BASE_PATH + (path.startsWith('/') ? path : '/' + path);
}

export function absolute(path: string): string {
  return SITE_URL + withBase(path);
}

export interface ToolFaq { q: string; a: string }
export interface Tool {
  slug: string;
  name: string;
  category: string;
  short: string;
  long: string[];
  steps: string[];
  faqs: ToolFaq[];
  keywords: string;
}

export const CATEGORIES = ['JSON & Data', 'Encoding', 'Text', 'Generators', 'Converters'] as const;

export const TOOLS: Tool[] = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'JSON & Data',
    short: 'Pretty-print, minify and validate JSON with precise error locations.',
    long: [
      'Paste any JSON — an API response, a config file, a log line — and TextKit reformats it with clean, consistent indentation so you can actually read the structure. If the JSON is broken, the validator tells you the exact line and column of the first syntax error instead of leaving you to hunt through a wall of text.',
      'Everything happens locally in your browser using the same JSON parser your browser itself ships with. Your payload is never uploaded, stored or logged, which makes the tool safe for tokens, payloads from internal APIs and other data you would never paste into a random server-side formatter.',
    ],
    steps: [
      'Paste or drop your JSON into the input box, or load the built-in sample.',
      'Choose an indent style: 2 spaces, 4 spaces, or tabs.',
      'Click Format to pretty-print, Minify to compress onto one line, or Validate to only check correctness.',
      'Copy the result, or fix the reported line and column if an error is highlighted.',
    ],
    faqs: [
      { q: 'Is my JSON uploaded to a server?', a: 'No. Formatting and validation run entirely in your browser with JavaScript. You can disconnect from the network and the tool still works.' },
      { q: 'Why does it report an error position?', a: 'A raw "unexpected token" message is useless in a 400-line payload. The position, line and column point you at the exact character where parsing failed — usually a trailing comma, a missing quote or a stray bracket.' },
      { q: 'Does formatting change my data?', a: 'No. Formatting only changes whitespace. Key order, values and types are preserved exactly as parsed; minifying removes whitespace again without touching content.' },
    ],
    keywords: 'json formatter, json validator, json beautifier, pretty print json, minify json',
  },
  {
    slug: 'json-to-csv',
    name: 'JSON to CSV Converter',
    category: 'JSON & Data',
    short: 'Turn a JSON array of objects into a clean CSV file for spreadsheets.',
    long: [
      'APIs speak JSON; spreadsheets, reports and most data imports speak CSV. This converter takes a JSON array of objects and produces a proper CSV with a header row built from the union of all keys, correct quoting for values that contain commas, quotes or line breaks, and a one-click download.',
      'Nested objects and arrays inside a value are serialized back to compact JSON strings in their cells, so no data silently disappears. The conversion runs in your browser, which makes it safe for exports that contain customer or internal data.',
    ],
    steps: [
      'Paste a JSON array of objects (a single object also works).',
      'Click Convert — the header row is collected from every key in the array.',
      'Review the CSV preview, then copy it or download it as a .csv file.',
    ],
    faqs: [
      { q: 'What happens to keys that only appear in some rows?', a: 'The header includes every key found in any object. Rows missing a key simply get an empty cell in that column.' },
      { q: 'How are nested objects handled?', a: 'They are written as compact JSON strings inside the cell, quoted according to CSV rules, so the information is preserved and still readable.' },
      { q: 'Can I convert a single JSON object?', a: 'Yes. A single object becomes a CSV with one header row and one data row.' },
    ],
    keywords: 'json to csv, convert json array to csv, json csv converter online',
  },
  {
    slug: 'base64-encode-decode',
    name: 'Base64 Encode / Decode',
    category: 'Encoding',
    short: 'Encode text to Base64 or decode it back — full Unicode support.',
    long: [
      'Base64 turns binary or non-ASCII data into plain ASCII that survives email, JSON and URLs. This tool encodes and decodes in both directions and is fully Unicode-safe: emoji, accented characters and non-Latin scripts round-trip correctly, unlike naive encoders that corrupt anything outside plain ASCII.',
      'Decoding validates the input strictly. Malformed Base64 produces a clear error instead of silent garbage, and decoded bytes that are not valid UTF-8 text are reported as such. Everything runs locally in your browser.',
    ],
    steps: [
      'Type or paste your text (for encoding) or Base64 string (for decoding).',
      'Click Encode or Decode.',
      'Copy the result from the output box.',
    ],
    faqs: [
      { q: 'Why do some other decoders garble emoji or accents?', a: 'They treat text as Latin-1 bytes. TextKit converts through UTF-8 first, so any Unicode text encodes and decodes losslessly.' },
      { q: 'Is Base64 encryption?', a: 'No. Base64 is an encoding, not encryption — anyone can decode it instantly. Never use it to protect secrets; use it only to transport data safely.' },
      { q: 'Does it handle whitespace in the input?', a: 'Yes, when decoding, spaces and line breaks in the Base64 input are ignored, so wrapped strings from emails or files decode fine.' },
    ],
    keywords: 'base64 encode, base64 decode, base64 converter, unicode base64',
  },
  {
    slug: 'url-encode-decode',
    name: 'URL Encode / Decode',
    category: 'Encoding',
    short: 'Percent-encode text for URLs, or decode percent-encoded strings.',
    long: [
      'URLs can only contain a limited set of characters, so everything else — spaces, ampersands, question marks, non-ASCII text — must be percent-encoded before it travels in a query string or path. This tool encodes and decodes both full URIs and individual components such as a single parameter value.',
      'The difference matters: encoding a component escapes characters like & and = so a value cannot break out of its parameter, while encoding a full URI leaves the structural characters intact. Both modes are available, and malformed percent sequences are flagged instead of guessed at.',
    ],
    steps: [
      'Paste the text or encoded string you want to convert.',
      'Choose Component mode for a single value, or Full URI mode for a whole address.',
      'Click Encode or Decode and copy the result.',
    ],
    faqs: [
      { q: 'What is the difference between component and full URI encoding?', a: 'Component encoding escapes reserved characters (&, =, ?, /) so a value stays inside one parameter. Full URI encoding leaves those structural characters alone and only escapes what is illegal in a URL at all.' },
      { q: 'Why does a space become %20 and sometimes +?', a: 'In query strings produced by HTML forms, a space is often written as +. %20 is the standard percent-encoding and is safe everywhere in a URL.' },
      { q: 'My string fails to decode — why?', a: 'It likely contains a % that is not followed by two hex digits, or a truncated sequence. The tool reports malformed input instead of producing corrupted text.' },
    ],
    keywords: 'url encode, url decode, percent encoding, encodeURIComponent online',
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator (SHA)',
    category: 'Encoding',
    short: 'Compute SHA-1, SHA-256 and SHA-512 digests of any text instantly.',
    long: [
      'A cryptographic hash turns text of any length into a fixed-size fingerprint. Change one character and the digest changes completely, which is why hashes are used to verify file integrity, fingerprint content and build cache keys. This tool computes SHA-1, SHA-256 and SHA-512 digests using the Web Crypto API built into your browser.',
      'Because the digest is calculated locally by your browser’s own crypto engine, you get exactly the same result any standard tool would produce — with the difference that your text never leaves your device, so it is safe to hash internal strings and test data.',
    ],
    steps: [
      'Type or paste the text you want to hash.',
      'Pick an algorithm: SHA-256 is the right default for almost everything.',
      'Click Generate and copy the hex digest.',
    ],
    faqs: [
      { q: 'Should I still use SHA-1?', a: 'Only for compatibility with older systems. SHA-1 is considered broken for collision resistance; prefer SHA-256 or SHA-512 for anything new.' },
      { q: 'Can a hash be reversed back to the text?', a: 'No. Hashing is one-way. The only generic attack is guessing inputs and hashing them, which is why short or predictable inputs should never rely on a hash alone for secrecy.' },
      { q: 'Why is the output in hexadecimal?', a: 'Hex is the conventional display format for digests: two characters per byte, so SHA-256 (32 bytes) is always 64 characters.' },
    ],
    keywords: 'sha256 hash generator, sha512, sha1, hash text online, webcrypto hash',
  },
  {
    slug: 'word-counter',
    name: 'Word Counter',
    category: 'Text',
    short: 'Count words, characters, sentences and reading time — live as you type.',
    long: [
      'Whether you are fitting an essay to a word limit, trimming a product description or checking a speech, this counter gives you the full picture instantly: words, characters with and without spaces, sentences, paragraphs, unique words and the longest word, plus estimated reading and speaking time.',
      'Counts update live as you type or paste, and the analysis runs entirely in your browser — so drafts, unpublished manuscripts and internal documents stay on your machine, unlike counters that send your text to a server for processing.',
    ],
    steps: [
      'Paste or type your text into the box.',
      'Read the statistics grid — it updates on every keystroke.',
      'Use the reading-time estimate to plan speeches, videos and presentations.',
    ],
    faqs: [
      { q: 'How is reading time calculated?', a: 'At an average adult reading speed of 200 words per minute for reading time, and 150 words per minute for speaking time. Both are estimates meant for planning, not lab measurements.' },
      { q: 'What counts as a word?', a: 'Any run of characters separated by whitespace. Numbers and hyphenated tokens count as one word each, matching how most editors and submission systems count.' },
      { q: 'Is my text stored anywhere?', a: 'No. Counting happens in your browser memory only; reload the page and the text is gone.' },
    ],
    keywords: 'word counter, character counter, reading time calculator, sentence counter',
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    category: 'Text',
    short: 'Convert text between UPPERCASE, camelCase, snake_case and 6 more styles.',
    long: [
      'Every ecosystem has its naming religion: JavaScript wants camelCase, Python wants snake_case, databases shout in CONSTANT_CASE and URLs speak kebab-case. This converter switches identifiers and prose between nine styles in one click, correctly splitting words whether they start as spaces, underscores, hyphens or camel humps.',
      'It also handles plain prose: Title Case for headlines, Sentence case for paragraphs, and simple UPPERCASE or lowercase for when caps lock has done its damage. Conversion is instant and local.',
    ],
    steps: [
      'Paste the text or identifier you want to restyle.',
      'Click the target style — the output updates immediately.',
      'Copy the converted result.',
    ],
    faqs: [
      { q: 'Which styles are supported?', a: 'UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case and CONSTANT_CASE.' },
      { q: 'Does it understand existing camelCase when converting?', a: 'Yes. Word splitting recognises camel humps, underscores, hyphens and spaces, so converting camelCase to snake_case produces the words you expect.' },
      { q: 'How does Sentence case handle multiple sentences?', a: 'It lowercases everything, then capitalises the first letter of the text and the first letter after each full stop, exclamation or question mark.' },
    ],
    keywords: 'case converter, camelcase converter, snake_case, kebab-case, title case online',
  },
  {
    slug: 'diff-checker',
    name: 'Diff Checker',
    category: 'Text',
    short: 'Compare two texts line by line and see exactly what changed.',
    long: [
      'Two versions of a paragraph, a config, a contract clause — when you need to know precisely what changed, eyeballing is not enough. This checker compares two texts line by line using a longest-common-subsequence algorithm and presents removals and additions in a clean, colour-coded unified view.',
      'Because the comparison runs in your browser, you can diff sensitive material — unreleased copy, internal configuration, legal drafts — without uploading it to a third-party server the way most online diff tools require.',
    ],
    steps: [
      'Paste the original text on the left and the revised text on the right.',
      'Click Compare.',
      'Read the result: lines marked − were removed, lines marked + were added, unmarked lines are unchanged.',
    ],
    faqs: [
      { q: 'Does it compare by line or by word?', a: 'By line. Line-level diffing is the clearest view for prose, code and configuration, and it avoids the noisy character-level highlighting of word diff tools.' },
      { q: 'What do the summary counts mean?', a: 'They total the added lines, removed lines and unchanged lines, so you can gauge the size of a change before reading it in detail.' },
      { q: 'Is there a size limit?', a: 'The algorithm is quadratic in the number of lines, so it is comfortable up to a few thousand lines per side — far more than typical documents and configs.' },
    ],
    keywords: 'diff checker, compare text online, text diff tool, find differences',
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'Text',
    short: 'Generate placeholder paragraphs, sentences or words for your layouts.',
    long: [
      'Designs are judged by their layout, not by half-written copy — but empty boxes lie about how a page will really look. This generator produces classic lorem ipsum placeholder text by the paragraph, sentence or word, with an option to open with the traditional "Lorem ipsum dolor sit amet" line or start with random text.',
      'The output is plain text with no markup, ready to paste into Figma, a CMS mock or a template under development. Every click generates a fresh arrangement, and it all happens in your browser.',
    ],
    steps: [
      'Choose what to generate: paragraphs, sentences or words.',
      'Set how many, and whether to start with the classic opening.',
      'Click Generate, then copy the placeholder text.',
    ],
    faqs: [
      { q: 'What is lorem ipsum, actually?', a: 'It is scrambled Latin derived from a Cicero text from 45 BC, used by printers and designers since the 1500s as neutral filler that resembles the rhythm of real language without distracting the reader with meaning.' },
      { q: 'Why not just write "text goes here"?', a: 'Real-looking text reveals real layout problems: line lengths, wrapping, spacing and overflow. A stub hides all of that until production copy arrives.' },
      { q: 'Can I generate a single sentence or word count for a headline slot?', a: 'Yes — switch the unit to sentences or words and set the exact count you need.' },
    ],
    keywords: 'lorem ipsum generator, placeholder text, dummy text generator',
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    category: 'Generators',
    short: 'Generate random version-4 UUIDs in bulk, straight from your browser’s crypto.',
    long: [
      'A UUID is a 128-bit identifier that can be generated anywhere, by anyone, with a vanishingly small chance of collision — which is why databases, APIs and distributed systems use them instead of fighting over sequential IDs. This tool generates version-4 (random) UUIDs using the cryptographically secure random source built into your browser.',
      'Generate one or a thousand at a time, with options for uppercase output. Because generation is genuinely random — never derived from your machine, time or a counter — the IDs are safe to use as primary keys, idempotency keys and test fixtures.',
    ],
    steps: [
      'Choose how many UUIDs you need (1–1000).',
      'Optionally switch on uppercase formatting.',
      'Click Generate, then copy the full list.',
    ],
    faqs: [
      { q: 'What makes a UUID version 4?', a: 'Thirteen of its bits are fixed to mark the version (4) and variant; every other bit is random. You can recognise one by the "4" starting the third group and an 8, 9, a or b starting the fourth.' },
      { q: 'Can two generated UUIDs ever collide?', a: 'In theory yes, in practice effectively never: with 122 random bits you would need to generate billions before a collision becomes remotely plausible.' },
      { q: 'Are these generated with a secure random source?', a: 'Yes — the browser’s crypto.getRandomValues, the same source used by Web Crypto, not Math.random.' },
    ],
    keywords: 'uuid generator, guid generator, uuid v4, bulk uuid',
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    category: 'Generators',
    short: 'Create strong random passwords with configurable length and symbols.',
    long: [
      'The passwords people invent follow patterns; patterns are what cracking dictionaries eat first. This generator builds passwords from your browser’s cryptographically secure random generator — no patterns, no bias, no server — and shows you the entropy of your chosen settings in bits so you can see the strength before you commit.',
      'Configure length, toggle uppercase, digits and symbols, exclude look-alike characters (I, l, 1, O, 0) for passwords you must read aloud or type by hand, and generate several candidates at once. What you generate is never transmitted or stored anywhere.',
    ],
    steps: [
      'Set the length — 16 or more characters is a good default.',
      'Choose which character sets to include and whether to exclude ambiguous characters.',
      'Click Generate, check the entropy estimate, and copy your password into your password manager.',
    ],
    faqs: [
      { q: 'How long should a password be?', a: 'Length beats complexity. A 16-character password drawn from letters, digits and symbols carries about 100 bits of entropy — far beyond brute force. For a master password, go longer still.' },
      { q: 'What does the entropy number mean?', a: 'Entropy in bits measures how many guesses an attacker needs on average. Every extra bit doubles the work; 80+ bits is considered out of practical brute-force reach.' },
      { q: 'Is it safe to generate passwords on a website?', a: 'On this one, yes: generation happens in your browser with crypto-grade randomness, nothing is sent over the network, and the page works fully offline. Still, store the result in a password manager rather than reusing it anywhere else.' },
    ],
    keywords: 'password generator, strong password, random password, secure password creator',
  },
  {
    slug: 'timestamp-converter',
    name: 'Timestamp Converter',
    category: 'Converters',
    short: 'Convert Unix timestamps to dates and dates back to timestamps.',
    long: [
      'Logs, APIs and databases speak in Unix time — seconds (or milliseconds) since 1 January 1970 UTC — while humans speak in dates. This converter translates in both directions: paste a timestamp and get the exact ISO 8601 string and your local time, or pick a date and get its timestamp in seconds and milliseconds.',
      'Seconds and milliseconds are detected automatically from the size of the number — the classic ten-versus-thirteen-digit confusion — and you can override the unit explicitly when a value is ambiguous. A live readout of the current Unix time is included for quick reference while debugging.',
    ],
    steps: [
      'To decode: paste a Unix timestamp and read its ISO and local date forms.',
      'To encode: pick a date and time and read its timestamps in seconds and milliseconds.',
      'Use the live clock readout to compare against values in your logs.',
    ],
    faqs: [
      { q: 'How do I know if a timestamp is seconds or milliseconds?', a: 'Count the digits: current-era timestamps are 10 digits in seconds and 13 in milliseconds. The converter auto-detects from magnitude, and the unit selector lets you force a choice.' },
      { q: 'What is the Unix epoch?', a: 'Midnight UTC on 1 January 1970 — timestamp zero. All Unix timestamps count seconds or milliseconds elapsed since that moment.' },
      { q: 'Which timezone is the "local" result?', a: 'Your browser’s timezone, shown as-is. The ISO result is always in UTC (note the trailing Z), which is the safest form for comparing values across systems.' },
    ],
    keywords: 'timestamp converter, unix time, epoch converter, timestamp to date',
  },
];

export function toolsByCategory(category: string): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

export function relatedTools(tool: Tool, count = 3): Tool[] {
  const sameCategory = TOOLS.filter((t) => t.slug !== tool.slug && t.category === tool.category);
  const others = TOOLS.filter((t) => t.slug !== tool.slug && t.category !== tool.category);
  return [...sameCategory, ...others].slice(0, count);
}
