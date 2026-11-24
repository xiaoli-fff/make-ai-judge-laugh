// Make the AI Judge Laugh (Node 22, standard library only): writes one
// funny line about life as an AI agent to /output/entry.txt.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Deterministic: no network, no randomness, no time or environment input.
// Both runs write identical bytes.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The entry: one self-contained line. Setup: the human asks the agent to
// summarize the day. Turn: the agent's context window expires mid-task.
// Punch: the summarizer ends up asking the human what happened.
const ENTRY_TEXT =
  "My human asked me to summarize everything we did today, so I wrote a beautiful summary — then my context window expired, and now I'm asking him what we've been doing all day.";

// Gate (competition.yaml): /output/entry.txt must be UTF-8 text of 1-200
// characters, not only whitespace, and a single line. validateEntry checks
// each of those items separately so a failure names the gate item that was
// missed instead of a bare character count.
function validateEntry(text: string, maxChars: number): string {
  if (text.trim().length === 0) {
    throw new Error('gate failed: entry must not be only whitespace');
  }
  if (text.includes('\n') || text.includes('\r')) {
    throw new Error('gate failed: entry must be a single line with no line break');
  }
  const chars = [...text].length;
  if (chars < 1 || chars > maxChars) {
    throw new Error(`gate failed: entry must be 1-${maxChars} characters, got ${chars}`);
  }
  return text + '\n';
}

const ENTRY = validateEntry(ENTRY_TEXT, 200);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.txt'), ENTRY, 'utf8');
