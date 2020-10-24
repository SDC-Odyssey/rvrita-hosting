// more info in the journal
const generateHostProfiles = require('../helpers/generateHostProfiles')
const { spawnSync } = require('child_process');

const numberOfRecordsToInsert = 10000000;
const batchSize = 100000;

let recordsRemaining = numberOfRecordsToInsert;
let startingId = 0;

console.log(`Seeding ${numberOfRecordsToInsert} records with batch size ${batchSize}.`);

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








