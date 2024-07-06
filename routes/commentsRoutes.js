const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comentController");
const auth = require("../middlewares/auth");

router.get("/about-us", commentController.getLastComments);

router.post("/create", commentController.createComment);

router.get(
  "/borrar/:comment_id",
  auth.getUserData,
  auth.authenticateToken,
  commentController.borrar
);

module.exports = router;
