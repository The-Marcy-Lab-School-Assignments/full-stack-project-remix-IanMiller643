const cardModel = require('../models/cardModel');
const deckModel = require('../models/deckModel');

// Lists all cards for a specific deck
// Logic: Allow if the deck is public OR if the requester is the owner
module.exports.listCards = async (req, res, next) => {
    try {
        const { deck_id } = req.params;
        const deck = await deckModel.find(deck_id);

        if (!deck) return res.status(404).send({ error: 'Deck not found.' });

        // Privacy check: If deck is private and user doesn't own it, deny access
        if (!deck.is_public && deck.user_id !== req.session.user_id) {
            return res.status(403).send({ error: 'This deck is private.' });
        }

        const cards = await cardModel.listByDeck(deck_id);
        res.send(cards);
    } catch (err) {
        next(err);
    }
};

module.exports.createCard = async (req, res, next) => {
    try {
        const { deck_id } = req.params;
        const { front, back } = req.body;

        if (!front || !back) {
            return res.status(400).send({ error: 'Front and back text are required.' });
        }

        // Verify deck ownership before allowing card creation
        const deck = await deckModel.find(deck_id);
        if (!deck) return res.status(404).send({ error: 'Deck not found.' });
        if (deck.user_id !== req.session.user_id) {
            return res.status(403).send({ error: 'Not authorized to add cards to this deck.' });
        }

        const card = await cardModel.create({ front, back }, deck_id);
        res.status(201).send(card);
    } catch (err) {
        next(err);
    }
};

module.exports.updateCard = async (req, res, next) => {
    try {
        const { card_id } = req.params;

        // 1. Find the card
        const card = await cardModel.find(card_id);
        if (!card) return res.status(404).send({ error: 'Card not found.' });

        // 2. Find the parent deck to check ownership
        const deck = await deckModel.find(card.deck_id);
        if (deck.user_id !== req.session.user_id) {
            return res.status(403).send({ error: 'Not authorized.' });
        }

        const updatedCard = await cardModel.update(card_id, req.body);
        res.send(updatedCard);
    } catch (err) {
        next(err);
    }
};

module.exports.deleteCard = async (req, res, next) => {
    try {
        const { card_id } = req.params;

        // 1. Find the card
        const card = await cardModel.find(card_id);
        if (!card) return res.status(404).send({ error: 'Card not found.' });

        // 2. Find the parent deck to check ownership
        const deck = await deckModel.find(card.deck_id);
        if (deck.user_id !== req.session.user_id) {
            return res.status(403).send({ error: 'Not authorized.' });
        }

        const destroyedCard = await cardModel.destroy(card_id);
        res.send(destroyedCard);
    } catch (err) {
        next(err);
    }
};