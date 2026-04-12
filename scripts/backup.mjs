#!/usr/bin/env node
/**
 * Supabase Full Backup Script
 *
 * Usage:
 *   node scripts/backup.mjs
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...
 *
 * Creates a timestamped backup folder under /backups with JSON files for each table.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

// ── Load .env.local ──
function loadEnv() {
  try {
    const envFile = readFileSync(resolve(rootDir, '.env.local'), 'utf8')
    for (const line of envFile.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim()
      if (!process.env[key]) process.env[key] = val
    }
  } catch {
    console.error('Could not read .env.local — make sure it exists in the project root.')
    process.exit(1)
  }
}

loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// ── Tables to backup ──
const TABLES = [
  'profiles',
  'analyses',
  'ip_usage',
  'transactions',
  'contact_requests',
  'blog_posts',
  'blog_comments',
  'saved_articles',
]

// ── Storage buckets to list ──
const BUCKETS = ['avatars', 'images']

async function backupTable(table, backupDir) {
  try {
    const query = supabase.from(table).select('*', { count: 'exact' }).limit(10000)
    // ip_usage uses ip_address as PK, not id
    if (table === 'ip_usage') query.order('ip_address', { ascending: true })
    else query.order('id', { ascending: true })
    const { data, error, count } = await query

    if (error) {
      console.log(`  [SKIP] ${table} — ${error.message}`)
      return 0
    }

    const rows = data || []
    writeFileSync(
      resolve(backupDir, `${table}.json`),
      JSON.stringify(rows, null, 2),
      'utf8'
    )
    console.log(`  [OK]   ${table} — ${rows.length} rows`)
    return rows.length
  } catch (err) {
    console.log(`  [ERR]  ${table} — ${err.message}`)
    return 0
  }
}

async function backupBucketList(bucket, backupDir) {
  try {
    const { data, error } = await supabase.storage.from(bucket).list('', {
      limit: 1000,
      sortBy: { column: 'created_at', order: 'desc' },
    })

    if (error) {
      console.log(`  [SKIP] storage/${bucket} — ${error.message}`)
      return
    }

    const files = (data || []).map(f => ({
      name: f.name,
      size: f.metadata?.size,
      type: f.metadata?.mimetype,
      created: f.created_at,
      url: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${f.name}`,
    }))

    writeFileSync(
      resolve(backupDir, `storage_${bucket}.json`),
      JSON.stringify(files, null, 2),
      'utf8'
    )
    console.log(`  [OK]   storage/${bucket} — ${files.length} files listed`)
  } catch (err) {
    console.log(`  [ERR]  storage/${bucket} — ${err.message}`)
  }
}

async function main() {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')
  const backupDir = resolve(rootDir, 'backups', timestamp)
  mkdirSync(backupDir, { recursive: true })

  console.log(`\nSupabase Backup — ${SUPABASE_URL}`)
  console.log(`Saving to: backups/${timestamp}/\n`)

  // Backup tables
  console.log('Tables:')
  let totalRows = 0
  for (const table of TABLES) {
    totalRows += await backupTable(table, backupDir)
  }

  // List storage files (URLs only — download separately if needed)
  console.log('\nStorage buckets:')
  for (const bucket of BUCKETS) {
    await backupBucketList(bucket, backupDir)
  }

  // Save metadata
  const meta = {
    timestamp: new Date().toISOString(),
    supabaseUrl: SUPABASE_URL,
    tables: TABLES,
    buckets: BUCKETS,
    totalRows,
  }
  writeFileSync(resolve(backupDir, '_meta.json'), JSON.stringify(meta, null, 2), 'utf8')

  console.log(`\nDone! ${totalRows} total rows backed up.`)
  console.log(`Backup location: backups/${timestamp}/`)
}

main().catch(err => {
  console.error('Backup failed:', err)
  process.exit(1)
})
