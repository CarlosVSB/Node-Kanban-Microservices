require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("./routes");
const cors = require("cors");

const app = express();

app.use(cors());
//config jason response
app.use(express.json());

app.use(router);
const port = process.env.PORT || 3001;

//credenciais
const dbuser = process.env.DB_USER;
const dbpass = process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbuser}:${dbpass}@cluster0.rchqwmh.mongodb.net/professionalCards?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(port);
    console.log(`Running on localhost:${port}`);
  })
  .catch((err) => console.log(err));
