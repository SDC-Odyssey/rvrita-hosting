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
// const queries = schema.split(';\n');

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
// const sampleHostProfiles = generateHostProfiles(1000000);
// console.log(sampleHostProfiles);
// db.task(async t => {
//   for (let i = 0; i < queries.length; i++) {
//     console.log('!!!',queries[i]);
//     await t.one(queries[i]);
//   }
// })

// ------ pg promise massive insert
db.task(async t => {
  await t.oneOrNone(schema);
})
//   .then(events => {
//     console.log('schema created');

//     const cs = new pgp.helpers.ColumnSet([
//       'id',
//       'host_url',
//       'host_name',
//       'cohost_name',
//       'host_about',
//       'host_messages',
//       'host_identity_verified',
//       'host_is_superhost',
//       'host_has_profile_pic',
//       'host_has_cohost',
//       'host_response_time',
//       'host_listings_count',
//       'host_verifications',
//       'host_languages',
//       { name: 'created_at', mod: '^', def: 'CURRENT_TIMESTAMP' },
//       { name: 'modified_at', mod: '^', def: 'CURRENT_TIMESTAMP' }
//     ], { table: 'hostinfo' });

//     function getNextData(t, pageIndex) {
//       const batchSize = 10000;
//       let data = null;
//       if (pageIndex < 1000) {
//         data = generateHostProfiles(batchSize, batchSize * pageIndex + 1);
//       }
//       return Promise.resolve(data);
//     }

//     db.tx('massive-insert', t => {
//       const processData = data => {
//         if (data) {
//           console.log('Importing records to postgres...');
//           const insert = pgp.helpers.insert(data, cs);
//           return t.none(insert);
//         }
//       };
//       return t.sequence(index => getNextData(t, index).then(processData));
//     })
//       .then(data => {
//         console.log('Total batches:', data.total, ', Duration:', data.duration);
//       })
//       .catch(error => {
//         console.log(error);
//       });





    // Creating a reusable/static ColumnSet for generating INSERT queries:    
    // const cs = new pgp.helpers.ColumnSet([
    //   'id',
    //   'host_url',
    //   'host_name',
    //   'cohost_name',
    //   'host_about',
    //   'host_messages',
    //   'host_identity_verified',
    //   'host_is_superhost',
    //   'host_has_profile_pic',
    //   'host_has_cohost',
    //   'host_response_time',
    //   'host_listings_count',
    //   'host_verifications',
    //   'host_languages',
    //   {name: 'created_at', mod: '^', def: 'CURRENT_TIMESTAMP'},
    //   {name: 'modified_at', mod: '^', def: 'CURRENT_TIMESTAMP'}
    // ], {table: 'hostinfo'});

    // const insert = pgp.helpers.insert(sampleHostProfiles, cs);
    // //=> INSERT INTO "products"("title","price","units")
    // //   VALUES('red apples',2.35,1000),('large oranges',4.5,1)

    // db.none(insert)
    //     .then(() => {
    //       console.log('records inserted');
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });

  // })
  // .catch(error => {
  //   console.log('ERROR:', error);
  // });