const express = require("express");
const userController = require("../controllers/userController");
const commentController = require("../controllers/commentController");
 
const router = express.Router();
 
router.get("/populate", userController.populate);
router.get("/users", userController.listUsers);
router.post("/user", userController.getUser);
 
router.post("/comment", commentController.addComment);
router.get("/comments", commentController.getComments);
 
module.exports = router;