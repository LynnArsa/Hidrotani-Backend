const express = require('express');
const articleController = require('../../controllers/Articles/articleController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, articleController.createArticle);
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.put('/:id', authenticateToken, articleController.updateArticle);
router.delete('/:id', authenticateToken, articleController.deleteArticle);

module.exports = router;