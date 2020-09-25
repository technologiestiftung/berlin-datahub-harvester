//defince environment vars
import {} from 'dotenv/config.js';
var pg = require('pg');

const pgUser = process.env.POSTGRES_USER;
const pgPassword = process.env.POSTGRES_PASSWORD;
const pgServer = POSTGRES_SERVER;
const pgPort = POSTGRES_PORT;
const pgDatabase = POSTGRES_DATABASE;

//provide URI
var uri = `postgres://${pgUser}:${pgPassword}@${pgServer}/ip:${pgPort}/${pgDatabase}`;

var pgClient = new pg.Client(uri);
pgClient.connect();