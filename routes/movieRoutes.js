// POST /movies: Lägg till en ny film.

// GET /movies: Hämta en lista med alla filmer.

// GET /movies/:id: Hämta detaljer för en specifik film.

// PUT /movies/:id: Uppdatera en specifik film.

// GET /movies/:id/reviews: Hämta alla recensioner för en specifik film.

// DELETE /movies/:id: Ta bort en specifik film

const { Movie } = require('../models/movieModel');
const express = require('express');
const router = express.Router();
const { authenticate, verifyRole } = require('../middlewares/auth');
const { default: mongoose } = require('mongoose');

router

  .post('/', authenticate, verifyRole(['admin']), async (req, res) => {
    try {
      const { title, director, releaseYear, genre } = req.body;

      const existingMovie = await Movie.findOne({
        title,
        director,
        releaseYear,
        genre,
      });
      if (existingMovie) {
        return res
          .status(400)
          .send(
            'A movie with this title, director, release year, and genre already exists.'
          );
      }

      const movie = new Movie({
        title,
        director,
        releaseYear,
        genre,
      });

      movie.save();
      res.status(200).send(movie);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  })

  .get('/', async (req, res) => {
    try {
      const movies = await Movie.find({});
      res.status(200).json(movies);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  })

  .get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'invalid id format' });
    }
    try {
      const movie = await Movie.findById(id);
      if (!movie) {
        return res.status(404).json({ error: 'No movie found' });
      }

      res.status(200).json(movie);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })

  .put('/:id', authenticate, verifyRole(['admin']), async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedMovie) {
        return res.status(404).json({ error: 'No movie was found' });
      }
      res.status(200).json(updatedMovie);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
// .get("/movies/:id/reviews", (req, res) => {

// })
// .delete("/movies/:id", (req, res) => {

// })

module.exports = router;
