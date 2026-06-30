// Shared server-side Sanity write client + small helpers for the public
// engagement functions (comments, votes). The write token lives ONLY in the
// Netlify environment (SANITY_WRITE_TOKEN) and is never exposed to the browser.
import {createClient} from '@sanity/client'

export const writeClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '82x61wc7',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2021-10-21',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {'content-type': 'application/json; charset=utf-8'},
  })

// Control-char strippers (built from escaped strings so no raw control bytes
// live in this source file). CTRL = all C0 + DEL; CTRL_NL keeps newline (0x0a).
const CTRL = new RegExp('[\\u0000-\\u001f\\u007f]+', 'g')
const CTRL_NL = new RegExp('[\\u0000-\\u0009\\u000b-\\u001f\\u007f]+', 'g')

// Single-line field: strip all control chars, collapse whitespace, trim, cap.
export const oneLine = (s, max) =>
  String(s ?? '')
    .replace(CTRL, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)

// Multi-line field: keep newlines, strip other control chars, collapse runs of
// spaces/tabs and 3+ blank lines, trim, cap length.
export const multiLine = (s, max) =>
  String(s ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(CTRL_NL, ' ')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max)
