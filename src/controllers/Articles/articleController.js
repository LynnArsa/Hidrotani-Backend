class ArticleController {
  // GET ALL
  async getAllArticles(req, res) {
    try {
      const [articles] = await promisePool.query('SELECT * FROM Article');
      res.status(200).json(articles);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching articles.' });
    }
  }

  // GET BY ID
  async getArticleById(req, res) {
    const { id } = req.params;
    try {
      const [article] = await promisePool.query('SELECT * FROM Article WHERE id_article = ?', [id]);

      if (article.length === 0) {
        return res.status(404).json({ error: 'Article not found.' });
      }

      res.status(200).json(article[0]);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching the article.' });
    }
  }
}

module.exports = new ArticleController();
