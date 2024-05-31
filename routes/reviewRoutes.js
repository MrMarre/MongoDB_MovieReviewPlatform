const { Review } = require('../models/reviewModel');
const express = require('express');
const router = express.Router();
const { default: mongoose } = require('mongoose');

const { authenticate, verifyRole } = require('../middlewares/auth');

// POST /reviews: Lägg till en ny recension.
router
  .post('/', authenticate, async (req, res) => {
    const userId = req.user.userId;
    const { movieId, rating, comment } = req.body;
    try {
      const postReview = await Review({ movieId, userId, rating, comment });

      await postReview.save();
      res.status(200).json(postReview);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  })

  // GET /reviews: Hämta en lista med alla recensioner.

  .get('/', async (req, res) => {
    try {
      const reviews = await Review.find({});
      res.status(200).json(reviews);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  })

  // GET /reviews/:id: Hämta detaljer för en specifik recension.

  .get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid id format' });
    }
    try {
      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ error: 'No review found' });

      res.status(200).json(review);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })

  // PUT /reviews/:id: Uppdatera en specifik recension.

  //   !GLÖM NU FAN INTE ATT RODDA MED att user bara har behörighet över sin egen, och att admin har kontroll över allas. LIKSOM

  .put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.userId) {
      return res.status(400).json({ error: 'Cannot update userId' });
    }

    try {
      const updateReview = await Review.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updateReview)
        return res.status(404).json({ error: 'No review was found' });
      res.status(200).json(updateReview);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
// DELETE /reviews/:id: Ta bort en specifik recension.

//   .delete('/id', (req, res) => {
//     try {
//     } catch (err) {}
//   });

module.exports = router;
