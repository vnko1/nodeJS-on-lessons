const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './.env' });

const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB successfully connected..');
  })
  .catch((err) => {
    console.log(err);

    process.exit(1);
  });

app.use(cors());
app.use(express.json());

// ENDPOINTS ========================
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/todos', todoRoutes);

// UNKNOWN REQUESTS HANDLER ==========
app.all('*', (req, res) => {
  res.status(404).json({
    message: 'Oops! Resource not found..',
  });
});

// GLOBAL ERROR HANDLER ==============
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
});

// SERVER =====================
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
});
