const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const auth = require("../middlewares/auth");

router.get(
  "/user",
  auth.getUserData,
  auth.authenticateToken,
  dashboardController.dashUser
);

router.get(
  "/dash-admin",
  auth.getUserData,
  auth.authenticateToken,
  dashboardController.dashAdmin
);

router.get(
  "/dash-home",
  auth.getUserData,
  auth.authenticateToken,
  dashboardController.dashHome
);

router.get(
  "/dash-tickets",
  auth.getUserData,
  auth.authenticateToken,
  dashboardController.dashTickets
);

router.get(
  "/dash-users",
  auth.getUserData,
  auth.authenticateToken,
  dashboardController.dashAllUsers
);

router.get(
  "/dash-comments",
  auth.getUserData,
  auth.authenticateToken,
  dashboardController.dashComments
);

module.exports = router;
