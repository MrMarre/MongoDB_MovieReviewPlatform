// !EN ENPOINT ÄR FORTFARANDE KVAR
const { Movie } = require('../models/movieModel');
const { Review } = require('../models/reviewModel');
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
  .get('/ratings', async (req, res) => {
    try {
      const ratings = await Movie.aggregate([
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'movieId',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            averageRatings: { $avg: '$reviews.rating' },
          },
        },
        {
          $project: {
            title: 1,
            director: 1,
            releaseYear: 1,
            genre: 1,
            averageRatings: { $avg: '$reviews.rating' },
          },
        },
      ]);
      res.status(200).json(ratings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })

  .get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid id format' });
    }
    try {
      const movie = await Movie.findById(id);
      if (!movie) return res.status(404).json({ error: 'No movie found' });

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
      if (!updatedMovie)
        return res.status(404).json({ error: 'No movie was found' });

      res.status(200).json(updatedMovie);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })

  .get('/:id/reviews', async (req, res) => {
    const { id } = req.params;

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid id format' });
      }
      const reviews = await Review.find({ movieId: id });
      if (reviews.length < 1) {
        res.status(404).json({ message: 'No reviews found on this movie' });
      }
      res.status(200).json(reviews);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  })

  .delete('/:id', authenticate, verifyRole(['admin']), async (req, res) => {
    const { id } = req.params;

    try {
      const movie = await Movie.findByIdAndDelete(id);

      if (!movie) return res.status(400).json({ error: 'No movie found' });

      res.status(200).json({ success: true, deletedMovie: movie });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
