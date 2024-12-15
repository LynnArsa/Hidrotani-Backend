require('dotenv').config();

// console.log('JWT_SECRET:', process.env.JWT_SECRET_KEY);

const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/Articles/articleRoutes');
const postRoutes = require('./routes/Forum/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const replyRoutes = require('./routes/Forum/replyRoutes');


const app = express();

app.get('/', (req, res) => {
  res.send('Hello, this is the root route!');
});

// Middleware
const authenticateToken = require('./middleware/authMiddleware');
app.use(cors());
app.use(express.json());

// Routes
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/forum/posts', postRoutes);
app.use('/api/posts', replyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.get('/db-check', async (req, res) => {
  try {
    res.status(200).send('Database connected successfully!');
  } catch (error) {
    res.status(500).send('Database connection failed: ' + error.message);
  }
});