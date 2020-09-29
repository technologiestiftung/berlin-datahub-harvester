//defince environment vars
require('dotenv').config();
const pg = require('pg');
const pgp = require('pg-promise')({
  capSQL: true // generate capitalized SQL 
});

const pgUser = process.env.POSTGRES_USER;
const pgPW = process.env.POSTGRES_PASSWORD;
const pgServer = process.env.POSTGRES_SERVER;
const pgPort = process.env.POSTGRES_PORT;
const pgDB = process.env.POSTGRES_DATABASE;

//provide connection either as connection string
// var connection = `postgres://${pgUser}:${pgPW}@${pgServer}/ip:${pgPort}/${pgDB}`;

// or as connection object
const connection = new pg.Client({
  host: `${pgServer}` ,
  port: pgPort,
  database: `${pgDB}`,
  user: `${pgUser}`,
  password: `${pgPW}`,
  max: 1 // maximum size of the connection pool  
  })

const db = pgp(connection); // database instance;


// Creating a reusable/static ColumnSet for generating INSERT queries:    
const cs = new pgp.helpers.ColumnSet([
  'title',
  {name: 'price', prop: 'cost'},
  {name: 'units', def: 1}
], {table: 'products'});

// data = array of objects that represent the import data:
const data = [
  {title: 'red apples', cost: 2.35, units: 1000},
  {title: 'large oranges', cost: 4.50}
];

const insert = pgp.helpers.insert(data, cs);
//=> INSERT INTO "products"("title","price","units")
//   VALUES('red apples',2.35,1000),('large oranges',4.5,1)

db.none(insert)
.then(() => {
// success, all records inserted
console.log(db.total);
})
.catch(error => {
// error
});


// //run SQL query and create PostgreSQL table
// const query = client.query(
//     'CREATE TABLE items(id SERIAL PRIMARY KEY, device VARCHAR(40) not null, complete BOOLEAN)');
//   query.on('end', () => { client.end(); });
  

// const insertDocument = (request, response) => {  
//     const { name, email } = request.body
  
//     pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
//       if (error) {
//         throw error
//       }
//       response.status(201).send(`User added with ID: ${result.insertId}`)
//     })
//   }