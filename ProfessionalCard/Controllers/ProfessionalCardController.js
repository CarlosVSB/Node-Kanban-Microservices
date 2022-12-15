require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const request = require("request");

const ProfessionalCard = require("../models/ProfessionalCard");

module.exports = {
  async getUserCards(req, res) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const id = req.params.userId;
    const objId = new mongoose.Types.ObjectId(id);
    //Ver se o usuário existe
    var options = {
      method: "GET",
      url: `https://kanban-login.azurewebsites.net/user/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    request(options, async (err, response) => {
      if (response.statusCode == 404) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }
      const cards = await ProfessionalCard.find({ userId: objId });
      return res.status(200).json({ cards });
    });
  },

  async createCard(req, res) {
    try {
      const { title, date, activity, project, description, userId } = req.body;
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      var options = {
        method: "GET",
        url: `https://kanban-login.azurewebsites.net/user/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      //validação
      if (!title) {
        return res.status(422).json({ msg: "O titulo é obrigatório" });
      }
      if (!date) {
        return res.status(422).json({ msg: "A data é obrigatória" });
      }
      const conflict = await ProfessionalCard.find({ date: new Date(date) });
      // console.log(conflict.length);
      if (conflict.length) {
        return res
          .status(422)
          .json({ msg: "Já existe outro compromisso nessa data e hora" });
      }
      if (!activity) {
        return res.status(422).json({ msg: "A atividade é obrigatória" });
      }
      if (!project) {
        return res.status(422).json({ msg: "O projeto é obrigatório" });
      }
      if (!description) {
        return res.status(422).json({ msg: "A descrição é obrigatória" });
      }
      if (!userId) {
        return res.status(422).json({ msg: "Nenhum usuário foi encontrado" });
      }

      //verificar se o usuário já existe
      const objId = new mongoose.Types.ObjectId(userId);
      request(options, async (err, response, body) => {
        // console.log(response.statusCode);
        if (response.statusCode == 404) {
          return res.status(404).json({ msg: "Usuário não encontrado" });
        } else {
          // criar a nota
          const card = new ProfessionalCard({
            title,
            date: new Date(date),
            activity,
            project,
            description,
            userId,
          });
          await card.save();
          res.status(201).json({ msg: "card criado com sucesso" });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Ops um erro inesperado aconteceu" });
    }
  },

  async changeInfo(req, res) {
    try {
      const { cardId } = req.params;

      if (
        req.body.status &&
        !["WAITING", "IN_PROGRESS", "PENDING", "FINISHED", "OTHER"].includes(
          req.body.status
        )
      ) {
        return res.status(400).json({
          error:
            "Status must be one of these: WAITING, IN_PROGRESS, PENDING, FINISHED, OTHER",
        });
      }
      if (req.body.date) {
        return res.status(400).json({
          error: "Please use the proper route to change the date",
        });
      }

      await ProfessionalCard.findByIdAndUpdate(cardId, req.body);

      return res.sendStatus(204);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  },

  async updateDate(req, res) {
    try {
      const { cardId } = req.params;
      const { date } = req.body;

      if (!date) {
        return res.status(400).json({
          error: "Date must be informed",
        });
      }

      await ProfessionalCard.findByIdAndUpdate(cardId, {
        date: new Date(date),
      });

      return res.sendStatus(204);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  },
};
