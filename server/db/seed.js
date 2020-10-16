// more info in the journal
// const generateHostProfiles = require('../helpers/generateHostProfiles')
// const { spawnSync } = require('child_process');

// const numberOfRecordsToInsert = 10000000;
// const batchSize = 1000000;
// let recordsRemaining = numberOfRecordsToInsert;
// let startingId = 0;

// console.log('Seeding %d records with batch size %d.', numberOfRecordsToInsert, batchSize);

// while (recordsRemaining > 0) {
//   const currentBatchSize = Math.min(recordsRemaining, batchSize);

//   console.log(`Generating ${currentBatchSize} records...`);
//   const sampleHostProfiles = generateHostProfiles(currentBatchSize, startingId);
//   console.log('Importing records to mongo...');
//   const output = spawnSync(
//     'mongoimport',
//     [ startingId === 0 ? '--drop' : '', '--jsonArray', '--collection=hostprofiles',
//       '--uri="mongodb://localhost/hostInfo"', '--numInsertionWorkers=8'],
//     { input: JSON.stringify(sampleHostProfiles) }
//   );
//   console.log(output.stderr.toString());

//   recordsRemaining -= currentBatchSize;
//   startingId += currentBatchSize;
// }


const generateHostProfiles = require('../helpers/generateHostProfiles');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const schema = fs.readFileSync(path.resolve(__dirname, './models/schema.sql')).toString();
const queries = schema.split(';\n');

// ------------------ pg-promise

const pgp = require('pg-promise')();
const cn = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  max: 30 // use up to 30 connections
};
const db = pgp(cn);
// console.log('query:',schema);
db.task(async t => {
  for (let i = 0; i < queries.length; i++) {
    console.log('!!!',queries[i]);
    await t.one(queries[i]);
  }
})
.then(events => {
  console.log('Events:', events);
})
.catch(error => {
  console.log('ERROR:', error);
});

// db.multi(schema)
//     .then(data => {
//         console.log(data.id); // print new user id;
//     })
//     .catch(error => {
//         console.log('ERROR:', error); // print error;
//     });

db.one('INSERT INTO hostinfo(host_name, cohost_name) VALUES($1, $2)', ['John', 'Hi'])
    .then(data => {
        console.log(data); // print new user id;
    })
    .catch(error => {
        console.log('ERROR:', error); // print error;
    });


// ---------------- node-postgres

// const { Pool } = require('pg');
// const pool = new Pool();
// pool
//   .connect()
//   .then(client => {
//     return client
//       .query('DROP TABLE IF EXISTS hostinfo')
//       .then(res => {
//         client.release();
//         console.log(res.rows[0]);
//       })
//       .catch(err => {
//         client.release();
//         console.log(err.stack);
//       });
//   });