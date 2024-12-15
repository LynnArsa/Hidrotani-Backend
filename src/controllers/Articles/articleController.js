const { promisePool } = require('../../db');

class ArticleController {
  // CREATE
  async createArticle(req, res) {
    const { title, content, user_id, id_category, image_url } = req.body;

    if (!title || !content || !user_id) {
      return res.status(400).json({ error: 'Title, content, and user_id are required' });
    }

    try {
      const [result] = await promisePool.query(
        'INSERT INTO Articles (title, content, user_id, id_category, image_url) VALUES (?, ?, ?, ?, ?)',
        [title, content, user_id, id_category, image_url]
      );
      res.status(201).json({
        message: 'Article created successfully.',
        article: { id_article: result.insertId, title, content, user_id, id_category, image_url },
      });
    } catch (error) {
      console.error('Error creating article:', error.message);
      res.status(500).json({ error: 'Failed to create article' });
    }
  }

  // READ ALL
  async getAllArticles(req, res) {
    try {
      const [articles] = await promisePool.query('SELECT * FROM Articles');
      res.status(200).json(articles);
    } catch (error) {
      console.error('Error fetching articles:', error.message);
      res.status(500).json({ error: 'Failed to fetch articles' });
    }
  }

  // READ BY ID
  async getArticleById(req, res) {
    const { id } = req.params;

    try {
      const [articles] = await promisePool.query('SELECT * FROM Articles WHERE id_article = ?', [id]);

      if (articles.length === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }

      res.status(200).json(articles[0]);
    } catch (error) {
      console.error('Error fetching article:', error.message);
      res.status(500).json({ error: 'Failed to fetch article' });
    }
  }

  // UPDATE
  async updateArticle(req, res) {
    const { id } = req.params;
    const { title, content, id_category, image_url } = req.body;

    try {
      const [article] = await promisePool.query('SELECT * FROM Articles WHERE id_article = ?', [id]);
      if (article.length === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }

      await promisePool.query(
        'UPDATE Articles SET title = ?, content = ?, id_category = ?, image_url = ? WHERE id_article = ?',
        [
          title || article[0].title,
          content || article[0].content,
          id_category || article[0].id_category,
          image_url || article[0].image_url,
          id,
        ]
      );

      res.status(200).json({ message: 'Article updated successfully' });
    } catch (error) {
      console.error('Error updating article:', error.message);
      res.status(500).json({ error: 'Failed to update article' });
    }
  }

  // DELETE
  async deleteArticle(req, res) {
    const { id } = req.params;

    try {
      const [article] = await promisePool.query('SELECT * FROM Articles WHERE id_article = ?', [id]);
      if (article.length === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }

      await promisePool.query('DELETE FROM Articles WHERE id_article = ?', [id]);
      res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
      console.error('Error deleting article:', error.message);
      res.status(500).json({ error: 'Failed to delete article' });
    }
  }
}

module.exports = new ArticleController();