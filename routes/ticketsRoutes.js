const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const auth = require("../middlewares/auth");

router.post("/create", auth.authenticateToken, ticketController.create);

router.get(
  "/borrar/:id_ticket",
  auth.getUserData,
  auth.authenticateToken,
  ticketController.borrar
);

module.exports = router;
