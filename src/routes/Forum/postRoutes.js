const express = require('express');
const forumPostController = require('../../controllers/Forum/postController');
const authenticateToken = require('../../middleware/authMiddleware');
const replyRoutes = require('./replyRoutes');
const voteRoutes = require('./voteRoutes');

const router = express.Router();

router.get('/', forumPostController.getAllPosts);
router.get('/:id', forumPostController.getPostById);
router.post('/', authenticateToken, forumPostController.createPost);
router.put('/:id', authenticateToken, forumPostController.updatePost);
router.delete('/:id', authenticateToken, forumPostController.deletePost);

router.use('/:id_post', replyRoutes);
router.use('/:id_post', voteRoutes);

module.exports = router;