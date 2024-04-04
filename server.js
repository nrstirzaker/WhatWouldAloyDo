import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import pg from 'pg';
const { Pool } = pg;
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon'
import ESAPI from 'node-esapi'

import favicon from 'serve-favicon';
import path from 'path';


import dotenv from 'dotenv';
dotenv.config();


const app = express()
const port = process.env.PORT || 3000

const pool = new Pool({
  user: process.env.DATABASE_USERNAME,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(cors())
app.use(bodyParser.json())
app.use(favicon(path.join('public','favicon.ico')));


app.post('/api/save', (request, response) => {
  console.log(DateTime.utc().toISO() + ":/api/save")

  const name = request.body.name;
  const task = request.body.task;
  const date_of_task = request.body.date_of_task;
  const ip_address_author = request.body.ip_address_author;

  const sql = 'INSERT INTO tasks(id, name, task, date_of_task, ip_address_author, position, removed, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *'
  const values = [uuidv4(), name, task, date_of_task, ip_address_author, Date.now(), false, getUTCNow()]
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.error(DateTime.utc().toISO() + ":Saving SQL Error: " + error)
    } else {
      response.status(201).send(`User added with ID: ${results.rows[0].id}`)
    }

  })
})

app.get('/api/validate', (request, response) => {
  const ip_address_author = request.query.ip_address_author;
  console.log(DateTime.utc().toISO() + ":.api.validate")
  const sql = "SELECT distinct COUNT(*) FROM  tasks WHERE ip_address_author = $1 AND created_at = '" + getUTCNow() + "'"
  const values = [ip_address_author]
  console.log(DateTime.utc().toISO() + ":Validate Values Recieved " + values)
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.error(DateTime.utc().toISO() + ":Validation Error" + error)
    } else {
      console.log(DateTime.utc().toISO() + ":Posting:rows found: " + JSON.stringify(results.rows[0]))
      //response.status(200).json({ "validToday": results.rows[0].count == '0' })      
      response.status(200).json({ "validToday": true })      
    }
  })
})

function getUTCNow() {
  return DateTime.now().toUTC().toFormat('yyyy-MM-dd').toString();
}

app.get('/api/tasks/:direction/:from', (request, response) => {

  const sqlForward = "SELECT id, name, task, date_of_task, position FROM TASKS WHERE removed = false AND position > $1 ORDER BY position ASC LIMIT 10"
  const sqlBackward = "SELECT id, name, task, date_of_task, position FROM TASKS WHERE removed = false AND position < $1 ORDER BY position ASC LIMIT 10"
  
  let sql = ''
  if (request.params.direction == 'forward'){
    console.log(DateTime.utc().toISO() + "set forward")
    sql = sqlForward
  }

  if (request.params.direction == 'backward'){
    console.log(DateTime.utc().toISO() + "set backward")
    sql = sqlBackward
  }

  const value = [request.params.from]
  
  console.error(DateTime.utc().toISO() + ":Get Tasks Page Start From: " + request.params.from)
  console.error(DateTime.utc().toISO() + ":Get Tasks SQL: " + sql)
  pool.query(sql, value, (error, results) => {
    if (error) {
      console.error(DateTime.utc().toISO() + ":Get Tasks Error" + error)
    } else {
      console.log(DateTime.utc().toISO() + ":Retreiving " + JSON.stringify(results.rows.length) + " tasks")
      response.status(200).json({ "tasks": results.rows })
    }
  })
})

app.post('/api/task/review', (request, response) => {
  console.log(DateTime.utc().toISO() + ":/api/task/review")
  const taskId = request.body.id;
  const ipAddressOfReviewer = request.body.ip_address;
  
//same ip address cant review task more than once ( add index?)
  const sql = "INSERT INTO log_remove (id, task_id, ip_address_reviewer, created_at) values ($1. $2, $3, $4)"
  const values = [uuidv4(), taskId, ipAddressOfReviewer, getUTCNow()]
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.error(DateTime.utc().toISO() + ":Task Review Error" + error)
    } else {
      console.log(DateTime.utc().toISO() + ":Logged Reivew against" + taskId)
      response.status(200)
    }
  })

  response.sendStatus(200);
})





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// async function init(){

//   pb = new PocketBase('https:'+ process.env.DB_URL);

//   if (pb.authStore.model) {
//     pb.authStore.clear();
//     token=""
//   }

//   //get admin token
//   if (!pb.authStore || !pb.authStore.token) {
//       await pb.admins.authWithPassword(process.env.DB_USERNAME, process.env.DB_PASSWORD);
//       console.log("main:connect to pocketbase")
//   }

//   //store admin toekn in session for use in other calls
//   if (token ==""){
//       token = pb.authStore.token
//       console.log("main:set token")
//   }

// }


