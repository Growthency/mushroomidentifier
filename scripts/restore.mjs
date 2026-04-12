#!/usr/bin/env node
/**
 * Supabase Restore Script
 *
 * Usage:
 *   node scripts/restore.mjs <backup-folder>
 *
 * Example:
 *   node scripts/restore.mjs backups/2026-04-12-10-30-00
 *
 * Before running:
 *   1. Create a new Supabase project
 *   2. Run the same migrations (supabase/migrations/*.sql) on the new project
 *   3. Update .env.local with the NEW project's URL and service role key
 *   4. Run this script to upload all backed-up data
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync, readdirSync } from 'fs'
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
    console.error('Could not read .env.local — make sure it has the NEW Supabase credentials.')
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

// Tables in the order they should be restored (respecting foreign keys)
// profiles first (referenced by others), then the rest
const TABLE_ORDER = [
  'profiles',
  'analyses',
  'ip_usage',
  'transactions',
  'contact_requests',
  'blog_posts',
  'blog_comments',
  'saved_articles',
]

const BATCH_SIZE = 500

async function restoreTable(table, backupDir) {
  const filePath = resolve(backupDir, `${table}.json`)
  if (!existsSync(filePath)) {
    console.log(`  [SKIP] ${table} — no backup file found`)
    return 0
  }

  try {
    const rows = JSON.parse(readFileSync(filePath, 'utf8'))
    if (!rows.length) {
      console.log(`  [SKIP] ${table} — 0 rows`)
      return 0
    }

    let inserted = 0
    // Insert in batches to avoid payload size limits
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE)
      const { error } = await supabase
        .from(table)
        .upsert(batch, { onConflict: 'id', ignoreDuplicates: true })

      if (error) {
        console.log(`  [ERR]  ${table} batch ${i}-${i + batch.length}: ${error.message}`)
      } else {
        inserted += batch.length
      }
    }

    console.log(`  [OK]   ${table} — ${inserted}/${rows.length} rows restored`)
    return inserted
  } catch (err) {
    console.log(`  [ERR]  ${table} — ${err.message}`)
    return 0
  }
}

async function main() {
  const backupFolder = process.argv[2]
  if (!backupFolder) {
    console.error('Usage: node scripts/restore.mjs <backup-folder>')
    console.error('Example: node scripts/restore.mjs backups/2026-04-12-10-30-00')
    process.exit(1)
  }

  const backupDir = resolve(rootDir, backupFolder)
  if (!existsSync(backupDir)) {
    console.error(`Backup folder not found: ${backupDir}`)
    process.exit(1)
  }

  // Show what we're restoring to
  console.log(`\nSupabase Restore`)
  console.log(`From:   ${backupFolder}`)
  console.log(`To:     ${SUPABASE_URL}`)
  console.log(`\nWARNING: This will INSERT/UPSERT data into the target database.`)
  console.log(`Make sure .env.local points to the CORRECT (new) Supabase project!\n`)

  // Show available backup files
  const files = readdirSync(backupDir).filter(f => f.endsWith('.json') && !f.startsWith('_'))
  console.log(`Backup files found: ${files.join(', ')}\n`)

  // Restore tables in order
  console.log('Restoring tables:')
  let totalRows = 0
  for (const table of TABLE_ORDER) {
    totalRows += await restoreTable(table, backupDir)
  }

  console.log(`\nDone! ${totalRows} total rows restored.`)
  console.log('\nNext steps:')
  console.log('  1. Verify data in the new Supabase dashboard')
  console.log('  2. Re-upload storage files (images) manually or via the dashboard')
  console.log('  3. Update .env.local, analytics IDs, and search console verification')
}

main().catch(err => {
  console.error('Restore failed:', err)
  process.exit(1)
})
