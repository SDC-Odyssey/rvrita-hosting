const generateHostProfiles = require('../helpers/generateHostProfiles')
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const Readable = require('stream').Readable;
require('dotenv').config();
// const schema = fs.readFileSync(path.resolve(__dirname, './models/schema.sql')).toString();

const psql = '/Library/PostgreSQL/13/bin/psql';
const numberOfRecordsToInsert = 1000000;
const batchSize = 10000;
let recordsRemaining = numberOfRecordsToInsert;
let startingId = 0;

console.log('Seeding %d records with batch size %d.', numberOfRecordsToInsert, batchSize);

spawnSync(psql, [
  '-f', path.resolve(__dirname, './models/schema.sql')
]);

const proc = spawn(psql, [
  // process.env.PGDATABASE,
  // '-h', process.env.PGHOST,
  // '-p', process.env.PGPORT,
  // '-U', process.env.PGUSER,
  // process.env.PGPASSWORD <-- psql will use this environment variable
  '-c', `COPY hostinfo (`+
            `id,`+
            `host_url,`+
            `host_name,`+
            `cohost_name,`+
            `host_about,`+
            `host_messages,`+
            `host_identity_verified,`+
            `host_is_superhost,`+
            `host_has_profile_pic,`+
            `host_has_cohost,`+
            `host_response_time,`+
            `host_listings_count,`+
            `host_verifications,`+
            `host_languages`+
          `) FROM STDIN`
]);
// Echo mongoimport activity to console
proc.stderr.on('data', (data) => {
  console.warn(data.toString());
});
const s = new Readable();
// pipe the JSON string stream to mongoimport
s.pipe(proc.stdin);

setTimeout(() => {
  console.log(`Current stream buffered bytes: ${s.readableLength} High water mark: ${s.readableHighWaterMark}`);
}, 1000);

while (recordsRemaining > 0) {
  const currentBatchSize = Math.min(recordsRemaining, batchSize);
  console.log(`Current stream buffered bytes: ${s.readableLength} High water mark: ${s.readableHighWaterMark}`);

  console.log(`Generating ${currentBatchSize} records...`);
  const sampleHostProfiles = generateHostProfiles(currentBatchSize, startingId);
  console.log('Importing records to postgres...');
  const text = toPsql(sampleHostProfiles);
  s.push(text);

  recordsRemaining -= currentBatchSize;
  startingId += currentBatchSize;
}

// explicit end of file marker 
// s.push('\\.');
// null to end stream (like EOF - end of file)
s.push(null);

// Postgres Text Format: https://www.postgresql.org/docs/13/sql-copy.html#id-1.9.3.55.9.2
function toPsql(rows) {
  return rows.map(toPsqlRow).join('\n') + '\n';
}

function toPsqlRow(row) {
  return [
    row.id,
    row.host_url,
    row.host_name,
    row.cohost_name,
    row.host_about,
    row.host_messages,
    row.host_identity_verified,
    row.host_is_superhost,
    row.host_has_profile_pic,
    row.host_has_cohost,
    row.host_response_time,
    row.host_listings_count,
    `{${row.host_verifications.join(',')}}`,
    `{${row.host_languages.join(',')}}`,
  ].join('\t');
}