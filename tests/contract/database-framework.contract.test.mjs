#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateDatabaseFramework } from '../../../sdkwork-specs/tools/check-database-framework-standard.mjs';

const result = validateDatabaseFramework(process.cwd());
assert.equal(result.skipped, false, 'application must own database/');
assert.equal(result.ok, true, `database framework validation failed: ${result.failures.join('; ')}`);

const schemaContract = readFileSync('database/contract/schema.yaml', 'utf8');
const schemaTables = [...schemaContract.matchAll(/^  - name:\s*([a-z0-9_]+)\s*$/gm)]
  .map((match) => match[1])
  .sort();
const tableRegistry = JSON.parse(readFileSync('database/contract/table-registry.json', 'utf8'));
const registryTables = tableRegistry.tables.map((table) => table.table_name).sort();

assert.deepEqual(
  registryTables,
  schemaTables,
  'database table registry must exactly match the canonical schema table inventory',
);
assert.equal(
  new Set(registryTables).size,
  registryTables.length,
  'database table registry must not contain duplicate table names',
);

process.stdout.write('database-framework.contract.test.mjs passed\n');
