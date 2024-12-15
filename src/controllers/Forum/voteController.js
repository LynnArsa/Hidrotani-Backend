const { promisePool } = require('../../db');

class VoteController {
  // CREATE OR UPDATE VOTE
  async vote(req, res) {
    const { id_post } = req.params;
    const { vote_type } = req.body;
    const userId = req.user.userId;

    try {
      const [existingVote] = await promisePool.query(
        'SELECT * FROM Vote WHERE id_post = ? AND user_id = ?',
        [id_post, userId]
      );

      if (existingVote.length > 0) {

        await promisePool.query(
          'UPDATE Vote SET vote_type = ? WHERE id_post = ? AND user_id = ?',
          [vote_type, id_post, userId]
        );
        return res.status(200).json({ message: 'Vote updated successfully' });
      } else {

        await promisePool.query(
          'INSERT INTO Vote (id_post, user_id, vote_type) VALUES (?, ?, ?)',
          [id_post, userId, vote_type]
        );
        return res.status(201).json({ message: 'Vote created successfully' });
      }
    } catch (error) {
      console.error('Error voting:', error);
      res.status(500).json({ error: 'An error occurred while voting.' });
    }
  }

  // GET VOTES BY POST ID
  async getVotesByPostId(req, res) {
    const { id_post } = req.params;

    try {
      const [votes] = await promisePool.query('SELECT * FROM Vote WHERE id_post = ?', [id_post]);
      res.status(200).json(votes);
    } catch (error) {
      console.error('Error fetching votes:', error);
      res.status(500).json({ error: 'An error occurred while fetching votes.' });
    }
  }
}

module.exports = new VoteController();