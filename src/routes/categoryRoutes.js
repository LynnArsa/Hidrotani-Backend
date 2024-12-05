const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');

router.get('/', (req, res) => CategoryController.getAllCategories(req, res));

router.get('/:id', (req, res) => CategoryController.getCategoryById(req, res));

router.post('/', (req, res) => CategoryController.createCategory(req, res));

module.exports = router;
