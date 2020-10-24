/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');
const responseTime = require('response-time');
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
const expressStaticGzip = require('express-static-gzip');
const cors = require('cors');

const HostProfile = require('./db/models/hostProfile');

const app = express();

app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(responseTime());

app.get('*.js', (req, res, next) => {
  req.url += '.gz';
  res.set('Content-Encoding', 'gzip');
  res.set('Content-Type', 'text/javascript');
  next();
});

app.use(expressStaticGzip(path.join(__dirname, '/../client/dist')));

app.use(express.static(`${__dirname}/../client/dist`));

app.get('/hostInfo', (req, res) => {
  HostProfile.find({})
    .then((data) => {
      console.log('Successfully got all data from Host profile DB');
      res.send(data);
    })
    .catch((err) => {
      console.log('Error retrieving data from DB: ', err);
      res.status(500).send({ message: err.message });
    });
});

// CRUD - Create
app.post('/hostInfo', (req, res) => {
  console.log('Req.body with hostinfo: ', req.body);
  HostProfile.create(req.body)
    .then((resp) => {
      console.log('Successfully created new host');
      res.send('Successfully created new host');
    })
    .catch((err) => {
      console.log('Error creating host: ', err);
      res.status(500).send({ message: err.message });
    });
});

// CRUD - Read
app.get('/hostInfo/:hostId', (req, res) => {
  console.log('Parameter send by id in the req: ', req.params);
  HostProfile.findOne({ id: req.params.hostId })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: 'Unable to find the Host profile by id' });
      } else {
        console.log('Host profile by id Data: ', req.url);
        res.send(data);
      }
    })
    .catch((err) => {
      console.log('Error retrieving id from DB: ', err);
      res.status(500).send({ message: 'Error retrieving host id from DB' });
    });
});

// CRUD - Update
app.put('/hostInfo/:hostId', (req, res) => {
  console.log('Parameter send by id in the req: ', req.params);
  const id = req.params.hostId;
  const toUpdate = req.body;
  // HostProfile.findOneAndUpdate(id, update, { useFindAndModify: false, new: true })
  HostProfile.findOneAndUpdate({ id }, {$set: toUpdate}, {upsert: true})
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Unable to update host by id=${id}!`,
        });
      } else {
        res.send({
          message: 'Host updated successfully!',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating the host by id',
      });
    });
});

// CRUD - Delete
app.delete('/hostInfo/:hostId', (req, res) => {
  console.log('Parameter send by id in the req: ', req.params);
  const id = req.params.hostId;
  HostProfile.findOneAndDelete({ id })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `No record with id ${id} was found!`,
        });
      } else {
        res.send({
          message: 'Host was deleted successfully!',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error deleting the host by id',
      });
    });
});

module.exports = app;
