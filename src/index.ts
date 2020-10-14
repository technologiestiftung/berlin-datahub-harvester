/* eslint-disable @typescript-eslint/no-non-null-assertion */
// import dotenv functions to access environment vars
// import {} from 'dotenv/config.js';
// import * as ttn from 'ttn';
// require('dotenv').config();
import ttn = require("ttn");
import express from "express";
import fetch from "node-fetch";
// import ttn from "ttn";
const app = express();
const PORT = process.env.PORT || 5000;
// import { insertDocument } from "./lib/mongo";

const TTN_APP_1 = process.env.TTN_APPID_1;
const TTN_ACCESSKEY_1 = process.env.TTN_ACCESSKEY_1;

const TTN_APP_2 = process.env.TTN_APPID_2;
const TTN_ACCESSKEY_2 = process.env.TTN_ACCESSKEY_2;

const API_URL = process.env.API_URL || "http://localhost:4000";

interface TTNApp {
  appId: string;
  accessKey: string;
}

const ttnApps: TTNApp[] = [
  {
    appId: TTN_APP_1!,
    accessKey: TTN_ACCESSKEY_1!,
  },
  {
    appId: TTN_APP_2!,
    accessKey: TTN_ACCESSKEY_2!,
  },
];

console.log("trying to connect to TTN console...");

// ttn
//   .data(TTN_APP_1, TTN_ACCESSKEY_1)
//   .then(function (client: any) {
//     console.log("success!");
//     console.log("waiting for data from nodes...");
//     // as soon as ttn app receives uploads from
//     client.on("uplink");
//   })
//   .catch(function (error: Error) {
//     console.error("Error - couldn`t connect to TTN console.", error);
//     process.exit(1);
//   });

function uplinkHandler(devID: any, payload: any) {
  const messageObject = {
    appId: payload["app_id"],
    device: payload["dev_id"],
    counter: payload["counter"],
    tod: new Date().toJSON().slice(0, 19).replace(/T/g, " "),
    fields: payload["payload_fields"],
    payload: payload["payload_raw"],
    metadata: payload["metadata"],
  };
  console.log("*** \n Received uplink from: ", devID, "\n*** ");
  console.log(messageObject);
  // //will be defined in postgres.js
  // insertDocument(messageObject);
  const body = {
    ttnDeviceId: messageObject.device,
    value: Buffer.from(messageObject.payload, "base64").toString("utf8"),
    recordedAt: messageObject.metadata.time,
  };
  console.log("body", body);
  fetch(`${API_URL}/api/devices/insert-record-by-ttn-device-id`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      console.log(json);
    })
    .catch(console.error);
}

async function ttnWatcher() {
  console.log("ttn watcher is running");
  for (const ttnApp of ttnApps) {
    const client = await ttn.data(ttnApp.appId, ttnApp.accessKey);
    client.on("uplink", uplinkHandler);
  }
}

ttnWatcher().catch(console.error);
// as REST API communicates in JSON, just use json format
app.use(express.json());

app.get("/harvester/healthcheck", (req, res) =>
  res.json({ message: "This my API talking" }),
);

//output for the terminal
app.listen(PORT, () =>
  console.log(`Harvester listening on http://localhost:${PORT}`),
);
