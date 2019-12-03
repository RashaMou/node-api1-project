// implement your API here
const express = require("express");
const db = require("./data/db");

const server = express();
server.use(express.json());

server.get("/", (req, res) => {
  res.send({ api: "server up and running" });
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res
        .status(500)
        .json({ errorMessage: "error getting list of users from database" });
    });
});

server.post("/api/users");

server.get("/api/users/:id");

server.delete("/api/users/:id");

server.put("/api/users/:id");

const port = 4000;
server.listen(port, () => {
  console.log(`\n ** API running on port ${port} **\n`);
});
