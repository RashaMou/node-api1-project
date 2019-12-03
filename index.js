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
      console.log("error on GET /users", error);
      res
        .status(500)
        .json({ errorMessage: "error getting list of users from database" });
    });
});

server.post("/api/users", (req, res) => {
  const userData = req.body;

  db.insert(userData)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      console.log("error on POST /users", error);
      res.status(500).json({ errorMessage: "error adding user to database" });
    });
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(retrieved => {
      if (retrieved) {
        res.status(200).json({ message: "user added successfully", retrieved });
      } else {
        res.status(404).json({ message: "user not found" });
      }
    })
    .catch(error => {
      console.log("error on GET /users/:id", error);
      res.status(500).json({ errorMessage: "error retrieving user by id" });
    });
});

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(removed => {
      if (removed) {
        res.status(200).json({ message: "user removed successfully", removed });
      } else {
        res.status(404).json({ message: "user not found" });
      }
    })
    .catch(error => {
      console.log("error on GET /users/:id", error);
      res.status(500).json({ errorMessage: "error retrieving user by id" });
    });
});

server.put("/api/users/:id");

const port = 4000;
server.listen(port, () => {
  console.log(`\n ** API running on port ${port} **\n`);
});
