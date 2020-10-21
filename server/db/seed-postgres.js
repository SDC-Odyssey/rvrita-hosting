const generateHostProfiles = require('../helpers/generateHostProfiles')
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const Readable = require('stream').Readable;
require('dotenv').config();
const psql = '/Library/PostgreSQL/13/bin/psql';

const numberOfRecordsToInsert = 10000000;
const batchSize = 100000;


let recordsRemaining = numberOfRecordsToInsert;
let startingId = 0;

console.log(`Seeding ${numberOfRecordsToInsert} records with batch size ${batchSize}.`);

// loading the schema
spawnSync(psql, [
  '-f', path.resolve(__dirname, './models/schema.sql')
]);

// running psql from Node
const proc = spawn(psql, [
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

// To see psql activity in the console
proc.stdout.on('data', (data) => {
  console.log('Psql STDOUT: ' + data.toString());
});

const s = new Readable();

// using _read to make sure the stream data consumed and drained before the next batch will be pushed in
s._read = function noop(size) {
  let push = true;
  console.log(`writeable stream reading ${size} bytes from readable`);

  while (recordsRemaining > 0 && push === true) {
    const currentBatchSize = Math.min(recordsRemaining, batchSize);
    console.log(`readableLength: ${s.readableLength}, current batch size: ${currentBatchSize}`);
    const sampleHostProfiles = generateHostProfiles(currentBatchSize, startingId);
    console.log('Pushing records to stream...');
    const text = toPsql(sampleHostProfiles);
    push = s.push(text);
    // console.log('push: ', push);
    recordsRemaining -= currentBatchSize;
    startingId += currentBatchSize;
  }

  if (recordsRemaining === 0) s.push(null);
};

// pipe the string stream to psql
s.pipe(proc.stdin);


// ----------------- helper functions ----------------------

// Postgres text format for COPY: https://www.postgresql.org/docs/13/sql-copy.html#id-1.9.3.55.9.2
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