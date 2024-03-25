import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors' 
import * as pg from 'pg'
const { Pool } = pg
import { uuidv4 }  from 'uuid';


const app = express()
const port = 80
const pool = new Pool({
  user: process.env.DATABASE_USERNAME,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
})

// client.connect();

// let token = ""

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.post('/api/save', (request, response) => {  
  console.log("post")

  const sql = 'INSERT INTO tasks(id, name, task,when,ip_address_author,position) VALUES($1, $2, $3, $4, $5, $6) RETURNING *'
  const values = [uuidv4(), 'nrstirzaker',"be nice",new Date(), "192.168.0.1",0]
  pool.query(sql, values, (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.rows[0].id}`)
  })


  
  
  // let data = req.body
  // const res = await client.query(sql, values)
  // response.sendStatus(200);
})

app.get('/next:from',  (req, res) => {
  console.log("get")
  res.sendStatus(200);
})

app.put('/review:id', (req, res) => {
  console.log("put")
  res.sendStatus(200);
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


