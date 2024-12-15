const express = require('express');
const replyController = require('../../controllers/Forum/replyController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });


router.post('/replies', authenticateToken, replyController.createReply);
router.get('/replies', replyController.getRepliesByPostId);
router.delete('/replies/:id', authenticateToken, replyController.deleteReply);

module.exports = router;