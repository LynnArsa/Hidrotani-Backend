const { promisePool } = require('../db');

class CategoryController {
  // GET ALL
  async getAllCategories(req, res) {
    try {
      const [categories] = await promisePool.query('SELECT * FROM Category');
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  // GET BY ID
  async getCategoryById(req, res) {
    const { id } = req.params;

    try {
      const [categories] = await promisePool.query(
        'SELECT * FROM Category WHERE id_category = ?',
        [id]
      );

      if (categories.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.status(200).json(categories[0]);
    } catch (error) {
      console.error('Error fetching category:', error.message);
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  }

  // CREATE
  async createCategory(req, res) {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    try {
      const [result] = await promisePool.query(
        'INSERT INTO Category (name) VALUES (?)',
        [name]
      );
      res.status(201).json({
        message: 'Category created successfully.',
        category: { id_category: result.insertId, name },
      });
    } catch (error) {
      console.error('Error creating category:', error.message);
      res.status(500).json({ error: 'Failed to create category' });
    }
  }
}

module.exports = new CategoryController();
