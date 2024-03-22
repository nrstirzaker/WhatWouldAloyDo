import express from 'express'
import cors from 'cors'
import Client from 'pg'
import { v4 as uuidv4 } from 'uuid';


const app = express()
const port = 3000
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

let token = ""

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(cors())

app.post('/api/save', async (request, response) => {  
  console.log("post")
  const sql = 'INSERT INTO tasks(id, name, task,when,ip_address_author,position) VALUES($1, $2, $3, $4, $5, $6) RETURNING *'
  const values = [uuidv4(), 'nrstirzaker',"be nice",new Date(), "192.168.0.1",0]
  let data = req.body
  const res = await client.query(sql, values)
  response.sendStatus(200);
})

app.get('/next:from', async (req, res) => {
  console.log("get")
  res.sendStatus(200);
})

app.put('/review:id', (req, res) => {
  console.log("put")
  res.sendStatus(200);
})



await init()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function init(){

  pb = new PocketBase('https:'+ process.env.DB_URL);

  if (pb.authStore.model) {
    pb.authStore.clear();
    token=""
  }

  //get admin token
  if (!pb.authStore || !pb.authStore.token) {
      await pb.admins.authWithPassword(process.env.DB_USERNAME, process.env.DB_PASSWORD);
      console.log("main:connect to pocketbase")
  }

  //store admin toekn in session for use in other calls
  if (token ==""){
      token = pb.authStore.token
      console.log("main:set token")
  }

}


