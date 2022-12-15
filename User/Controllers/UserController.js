require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

module.exports = {
  async getUserByID(req, res) {
    const id = req.params.id;

    //Ver se o usuário existe
    const user = await User.findById(id, "-password");

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }
    return res.status(200).json({ user });
  },

  async createUser(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    //validação
    if (!name) {
      return res.status(422).json({ msg: "O nome é obrigatório" });
    }
    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório" });
    }
    if (!password) {
      return res.status(422).json({ msg: "A senha é obrigatória" });
    }
    if (password !== confirmpassword) {
      return res.status(422).json({ msg: "As senhas diferem" });
    }

    //verificar se o usuário já existe
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(422).json({ msg: "Email já cadastrado" });
    }

    //criar senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //criar usuário
    const user = new User({
      name,
      email,
      password: passwordHash,
    });
    try {
      await user.save();
      res.status(201).json({ msg: "usuário criado com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Opss um erro inesperado aconteceu" });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    //validações
    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório" });
    }
    if (!password) {
      return res.status(422).json({ msg: "A senha é obrigatória" });
    }

    //verificar se o usuário já existe
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    //verificar se a senha bate com a do banco
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(422).json({ msg: "senha invalida" });
    }

    try {
      const secret = process.env.SECRET;
      const token = jwt.sign(
        {
          id: user._id,
        },
        secret
      );
      const id = user._id;
      res
        .status(200)
        .json({ msg: "autenticação realizada com sucesso", token, id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Opss um erro inesperado aconteceu" });
    }
  },
  async checkIfExists(req, res) {
    const id = req.params.id;
    const user = await User.findById(id, "-password");
    if (!user) {
      res.status(404).json({});
    } else {
      res.status(200).json({ msg: "Usuário existe" });
    }
  },
};
