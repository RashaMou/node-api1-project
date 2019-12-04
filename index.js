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
  if (userData.name && userData.bio) {
    db.insert(userData)
      .then(user => {
        res.status(201).json({ ...user, ...userData });
      })
      .catch(error => {
        console.log("error on POST /users", error);
        res.status(500).json({ errorMessage: "error adding user to database" });
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

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;

  db.update(id, updatedUser)
    .then(user => {
      if (user) {
        res.status(200).json({ message: "user successfully updated" }, user);
      } else {
        res.status(404).json({ message: "user not found" });
      }
    })
    .catch(error => {
      console.log("error on UPDATE /users/:id", error);
      res.status(500).json({ errorMessage: "error updating user by id" });
    });
});

// server.put(URL + "/:id", (req, res) => {
// 	const id = req.params.id;
// 	const bod = req.body;
// 	db.update(id, bod)
// 		.then(upd => {
// 			(upd > 0)
// 				? res.status(200).json(returnGet(id, res))
// 				: res.status(404).json({ message: `ID NOT FOUND updated ${upd}` })
// 		})
// 		.catch(err => {
// 			console.log("PUT 'update user' error", err);
// 			res.status(500)
// 				.json({ msg: "PUT 'update user' error" });
// 		})
// });

const port = 4000;
server.listen(port, () => {
  console.log(`\n ** API running on port ${port} **\n`);
});
