const generateHostProfiles = require('../helpers/generateHostProfiles')
const { spawnSync } = require('child_process');

const numberOfRecordsToInsert = 10000000;
const batchSize = 1000000;
let recordsRemaining = numberOfRecordsToInsert;
let startingId = 0;

console.log('Seeding %d records with batch size %d.', numberOfRecordsToInsert, batchSize);

while (recordsRemaining > 0) {
  const currentBatchSize = Math.min(recordsRemaining, batchSize);

  console.log(`Generating ${currentBatchSize} records...`);
  const sampleHostProfiles = generateHostProfiles(currentBatchSize, startingId);
  console.log('Importing records to mongo...');
  const output = spawnSync(
    'mongoimport',
    [ startingId === 0 ? '--drop' : '', '--jsonArray', '--collection=hostprofiles',
      '--uri="mongodb://localhost/hostInfo"', '--numInsertionWorkers=8'],
    { input: JSON.stringify(sampleHostProfiles) }
  );
  console.log(output.stderr.toString());

  recordsRemaining -= currentBatchSize;
  startingId += currentBatchSize;
}





/*

// const mongoose = require('mongoose');
// const HostProfile = require('./models/hostProfile');
const generateHostProfiles = require('../helpers/generateHostProfiles')
const { spawn } = require('child_process');
const fs = require('fs');
const Readable = require('stream').Readable;

// turns a plain string into a stream


const numberOfRecordsToInsert = 1000000;
const batchSize = 100000;
let recordsRemaining = numberOfRecordsToInsert;
let startingId = 0;

console.log('Seeding %d records with batch size %d.', numberOfRecordsToInsert, batchSize);
const proc = spawn('mongoimport', ['--drop', '--jsonArray', '--collection=hostprofiles', '--uri="mongodb://localhost/hostInfo"', '--numInsertionWorkers=8']);
// Echo mongoimport activity to console
proc.stderr.on('data', (data) => {
  console.warn(data.toString());
});
const s = new Readable();

while (recordsRemaining > 0) {
  const currentBatchSize = Math.min(recordsRemaining, batchSize);

  console.log('Generating %d records...', currentBatchSize);
  const sampleHostProfiles = generateHostProfiles(currentBatchSize, startingId);
  console.log('Importing records to mongo...');
  // proc.stdin.write(JSON.stringify(sampleHostProfiles));
  // fs.writeFileSync('hostProfiles.json', JSON.stringify(sampleHostProfiles));
  s.push(JSON.stringify(sampleHostProfiles));
  // pipe the JSON string stream to mongoimport
  s.pipe(proc.stdin);

  recordsRemaining -= currentBatchSize;
  startingId += currentBatchSize;
}

// null to end stream (like EOF - end of file)
s.push(null);

*/