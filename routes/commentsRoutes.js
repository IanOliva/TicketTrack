const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comentController');


router.get('/about-us', commentController.getLastComments);

router.post('/create', commentController.createComment);

module.exports = router;