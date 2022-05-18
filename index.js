const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { status } = require("express/lib/response");
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();

const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.MONGOBD_USER_NAME}:${process.env.MONGOBD_USER_PASS}@todo.0ampi.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function todoServer() {
  try {
    await client.connect();
    const todoCollection = client.db("toDo").collection("todo_tasks");

      app.get("/todo-task/:email", async (req, res) => {
          const email = req.params.email;
          // const status = 0;
        const query = { email};
          const cursor = todoCollection.find(query);
          const todoTask = await cursor.toArray();
        res.send(todoTask);
      });
    app.put("/todo-complete/:id", async (req, res) => {
      const id = req.params.id;
      const todoComplete = req.headers.status;
      const filterQuery = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateTodo = { $set: { status: todoComplete } };
      const completedTodo = await todoCollection.updateOne(
        filterQuery,
        updateTodo,
        options
      );
      res.send({ massage: completedTodo });
    });
      app.delete("/todo-delete/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await todoCollection.deleteOne(query);
        res.send(result);
      });
      app.post('/add-task', async (req, res) => {
          const todoTask = req.body;
          const result = await todoCollection.insertOne(todoTask);
          res.send({ massage: "Task added successfully" , todoTask});
      })


  } finally {
    // await client.close();
  }
}
todoServer().catch(console.dir);




app.get("/", (req, res) => {
  res.send("Running Server");
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});