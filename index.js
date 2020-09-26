// import dotenv functions to access environment vars
// import {} from 'dotenv/config.js';
// import * as ttn from 'ttn';
require('dotenv').config();
const ttn = require('ttn');

// import { insertDocument } from "./lib/mongo";

const ttnApp = process.env.TTN_APPID;
const accessKey = process.env.TTN_ACCESSKEY;

console.log("trying to connect to TTN console...");

ttn.data(ttnApp, accessKey)
  .then(function (client) {
    console.log("success!");
    console.log("waiting for data from nodes...");
    // as soon as ttn app receives uploads from
    client.on("uplink", function (devID, payload) {
        const messageObject = {
          device: payload["dev_id"],
          counter: payload["counter"],
          tod: new Date().toJSON().slice(0, 19).replace(/T/g, " "),
          fields: payload["payload_fields"],
          payload: payload["payload_raw"],
          metadata: payload["metadata"],
        };
        console.log("*** \n Received uplink from: ", devID, "\n*** ")
        // //will be defined in postgres.js
        // insertDocument(messageObject);
        console.log("data was susccessfully written into collection", "\nwaiting from data from nodes...")
      })
  })
  .catch(function (error) {
    console.error("Error - couldn`t connect to TTN console.", error);
    process.exit(1);
  });


//set up a quick and dirty express API
const express = require('express');
const router = express.Router();
const app = express()
const port = 3000

// as REST API communicates in JSON, just use json format
app.use(express.json())
app.get('/', (req, res) => res.json({ message: 'This my API talking' }))

//output for the terminal
app.listen(port, () => console.log(`Example app listening on port ${port}!`))