const express = require('express');
const mongoose = require('mongoose');
const ENV = require('dotenv').config();
const UserRoutes = require('./routes/userRoutes');
const MovieRoutes = require('./routes/movieRoutes');

const app = express();

app.use(express.json());

const PORT = process.env.PORT;
const URL = process.env.URL;

mongoose.connect(process.env.DB_URI).then(() => {
  console.log('Connected to DB');

  app.listen(PORT, URL, () => {
    console.log(`Server listening to http://${URL}/${PORT}`);
  });
});

app.use('/users', UserRoutes);
app.use('/movies', MovieRoutes);
