const { promisePool } = require('../../db');

class ForumPostController {
  // CREATE
  async createPost(req, res) {
    const { title, content, category_id, image_url } = req.body;
    const userId = req.user.userId;

    try {
      const result = await promisePool.query(
        'INSERT INTO Post (title, content, user_id, id_category, image_url) VALUES (?, ?, ?, ?, ?)',
        [title, content, userId, category_id, image_url]
      );
      res.status(201).json({ message: 'Post created successfully!' });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'An error occurred while creating the post.' });
    }
  }

  // GET ALL
  async getAllPosts(req, res) {
    try {
      const [posts] = await promisePool.query('SELECT * FROM Post');
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'An error occurred while fetching posts.' });
    }
  }

  // GET BY ID
  async getPostById(req, res) {
    const { id } = req.params;

    try {
      const [post] = await promisePool.query('SELECT * FROM Post WHERE id_post = ?', [id]);
      if (post.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.status(200).json(post[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  }

  // UPDATE
  async updatePost(req, res) {
    const { id } = req.params;
    const { title, content, category_id, image_url } = req.body;
    const userId = req.user.userId;

    try {
      const [post] = await promisePool.query('SELECT * FROM Post WHERE id_post = ?', [id]);
      if (post.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (post[0].user_id !== userId) {
        return res.status(403).json({ error: 'You are not authorized to update this post' });
      }

      await promisePool.query(
        'UPDATE Post SET title = ?, content = ?, id_category = ?, image_url = ? WHERE id_post = ?',
        [
          title || post[0].title,
          content || post[0].content,
          category_id || post[0].id_category,
          image_url || post[0].image_url,
          id,
        ]
      );

      res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update post' });
    }
  }

  // DELETE
  async deletePost(req, res) {
    const { id } = req.params;
    const userId = req.user.userId; 

    try {
      const [post] = await promisePool.query('SELECT * FROM Post WHERE id_post = ?', [id]);
      if (post.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (post[0].user_id !== userId) {
        return res.status(403).json({ error: 'You are not authorized to delete this post' });
      }

      await promisePool.query('DELETE FROM Post WHERE id_post = ?', [id]);
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete post' });
    }
  }
}

module.exports = new ForumPostController();
