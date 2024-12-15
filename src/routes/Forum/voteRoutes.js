const express = require('express');
const voteController = require('../../controllers/Forum/voteController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.post('/vote', authenticateToken, voteController.vote);
router.get('/votes', voteController.getVotesByPostId);

module.exports = router;