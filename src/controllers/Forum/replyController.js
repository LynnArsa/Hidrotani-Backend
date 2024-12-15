const { promisePool } = require('../../db');

class ReplyController {
  // CREATE
  async createReply(req, res) {
    const { id_post } = req.params;
    const { content, image_url } = req.body;
    const userId = req.user.userId;

    try {
      const result = await promisePool.query(
        'INSERT INTO Reply (id_post, user_id, content, image_url) VALUES (?, ?, ?, ?)',
        [id_post, userId, content, image_url]
      );
      res.status(201).json({ message: 'Reply created successfully!' });
    } catch (error) {
      console.error('Error creating reply:', error);
      res.status(500).json({ error: 'An error occurred while creating the reply.' });
    }
  }

  // GET ALL REPLIES BY POST ID
  async getRepliesByPostId(req, res) {
    const { id_post } = req.params;

    try {
      const [replies] = await promisePool.query('SELECT * FROM Reply WHERE id_post = ?', [id_post]);
      res.status(200).json(replies);
    } catch (error) {
      console.error('Error fetching replies:', error);
      res.status(500).json({ error: 'An error occurred while fetching replies.' });
    }
  }

  // DELETE REPLY
  async deleteReply(req, res) {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const [reply] = await promisePool.query('SELECT * FROM Reply WHERE id_reply = ?', [id]);
      if (reply.length === 0) {
        return res.status(404).json({ error: 'Reply not found' });
      }

      if (reply[0].user_id !== userId) {
        return res.status(403).json({ error: 'You are not authorized to delete this reply' });
      }

      await promisePool.query('DELETE FROM Reply WHERE id_reply = ?', [id]);
      res.status(200).json({ message: 'Reply deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete reply' });
    }
  }
}

module.exports = new ReplyController();