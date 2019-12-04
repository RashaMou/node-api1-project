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
      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
    });
});

server.post("/api/users", (req, res) => {
  const userData = req.body;
  if (userData.name && userData.bio) {
    db.insert(userData)
      .then(user => {
        res.status(201).json({ ...user, ...userData });
      })
      .catch(error => {
        console.log("error on POST /users", error);
        res.status(500).json({
          errorMessage:
            "There was an error while saving the user to the database"
        });
      });
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide a name and bio for the user" });
  }
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(retrieved => {
      if (retrieved) {
        res.status(200).json({ message: "user added successfully", retrieved });
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(error => {
      console.log("error on GET /users/:id", error);
      res
        .status(500)
        .json({ errorMessage: "The user information could not be retrieved." });
    });
});

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(removed => {
      if (removed) {
        res.status(200).json({ message: "user removed successfully", removed });
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(error => {
      console.log("error on DELETE /users/:id", error);
      res.status(500).json({ errorMessage: "The user could not be removed" });
    });
});

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;

  db.findById(id)
    .then(user => {
      if (user && updatedUser.name && updatedUser.bio) {
        db.update(id, updatedUser).then(res => {
          res
            .status(200)
            .json({ message: "user successfully updated" }, editedUser);
        });
      } else if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
      } else if (!updatedUser.name || !updatedUser.bio) {
        res
          .status(400)
          .json({ errorMessage: "Please provide a name and bio for the user" });
      }
    })
    .catch(error => {
      console.log("error on PUT /users/:id", error);
      res.status(500).json({
        errorMessage: "The user's information could not be modified"
      });
    });
});

const port = 4000;
server.listen(port, () => {
  console.log(`\n ** API running on port ${port} **\n`);
});
