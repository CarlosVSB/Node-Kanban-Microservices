require("dotenv").config();
const mongoose = require("mongoose");

const router = require("express").Router();

const ProfessionalCardController = require("./Controllers/ProfessionalCardController");

//Rota pública
router.get("/", (req, res) => {
  res.status(200).json({ msg: "Ola mundo" });
});

// criar card profissional
router.post("/card/pro", ProfessionalCardController.createCard);

// ver cards profissionais de um usuário
router.get("/card/pro/:userId", ProfessionalCardController.getUserCards);

// mudar infos de um card profissional
router.patch("/card/pro/:cardId", ProfessionalCardController.changeInfo);

// muda a data de um card profissional
router.patch("/card/pro/date/:cardId", ProfessionalCardController.updateDate);

module.exports = router;
