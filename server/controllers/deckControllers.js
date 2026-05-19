const deckModel = require('../models/deckModel');

// Lists only the decks owned by the logged-in user
module.exports.listMyDecks = async (req, res, next) => {
  try {
    const decks = await deckModel.listByUser(req.session.user_id);
    res.send(decks);
  } catch (err) {
    next(err);
  }
};

// Lists all decks marked as public (accessible to anyone)
module.exports.listPublicDecks = async (req, res, next) => {
  try {
    const decks = await deckModel.listPublic();
    res.send(decks);
  } catch (err) {
    next(err);
  }
};

module.exports.createDeck = async (req, res, next) => {
  try {
    const { title, description, is_public } = req.body;
    if (!title) return res.status(400).send({ error: 'Title is required.' });

    const deck = await deckModel.create(
      { title, description, is_public: is_public || false },
      req.session.user_id
    );
    res.status(201).send(deck);
  } catch (err) {
    next(err);
  }
};

module.exports.updateDeck = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify existence and ownership
    const deck = await deckModel.find(id);
    if (!deck) return res.status(404).send({ error: 'Deck not found.' });
    if (deck.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    const updatedDeck = await deckModel.update(id, req.body);
    res.send(updatedDeck);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteDeck = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify existence and ownership
    const deck = await deckModel.find(id);
    if (!deck) return res.status(404).send({ error: 'Deck not found.' });
    if (deck.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    const destroyedDeck = await deckModel.destroy(id);
    res.send(destroyedDeck);
  } catch (err) {
    next(err);
  }
};