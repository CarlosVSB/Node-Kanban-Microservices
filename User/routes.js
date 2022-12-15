require("dotenv").config();
// const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

const User = require("./models/User");
const UserController = require("./Controllers/UserController");

//Rota pública
router.get("/", (req, res) => {
  res.status(200).json({ msg: "Esta é a API do usuário" });
});

//Rotas privadas
router.get("/user/:id", checkToken, UserController.getUserByID);

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "acesso negado" });
  }
  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (error) {
    return res.status(400).json({ msg: "Token inválido" });
  }
}

//criar usuário
router.post("/auth/register", UserController.createUser);

//Autenticar/Login
router.post("/auth/login", UserController.login);

//Checa se o usuário existe
router.get("/auth/user/:id", UserController.checkIfExists);

module.exports = router;
