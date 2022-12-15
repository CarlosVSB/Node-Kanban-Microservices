require("dotenv").config();
const mongoose = require("mongoose");

const router = require("express").Router();

const NormalCardController = require("./Controllers/NormalCardController");

//Rota pública
router.get("/", (req, res) => {
  res.status(200).json({ msg: "Ola mundo" });
});

// criar card comum
router.post("/card", NormalCardController.createCard);

// ver cards comunss de um usuário
router.get("/card/:userId", NormalCardController.getUserCards);

// mudar infos de um card comum
router.patch("/card/:cardId", NormalCardController.changeInfo);

// checar choque de horário
router.post("card/date/check", NormalCardController.checkConflict);

// muda a data de um card comum
router.patch("/card/date/:cardId", NormalCardController.updateDate);

module.exports = router;
