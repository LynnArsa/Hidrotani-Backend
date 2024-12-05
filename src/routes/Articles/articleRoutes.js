const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/authMiddleware');
const articleController = require('../../controllers/Articles/articleController');

router.get('/', articleController.getAllArticles);

router.get('/:id', articleController.getArticleById);

module.exports = router;
