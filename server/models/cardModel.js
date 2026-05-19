const pool = require('../db/pool');

// Returns all cards for a specific deck, ordered by creation time
module.exports.listByDeck = async (deck_id) => {
    const query = 'SELECT * FROM cards WHERE deck_id = $1 ORDER BY card_id ASC';
    const { rows } = await pool.query(query, [deck_id]);
    return rows;
};

// Returns a single card row (used for ownership checks or specific card edits)
module.exports.find = async (card_id) => {
    const query = 'SELECT * FROM cards WHERE card_id = $1';
    const { rows } = await pool.query(query, [card_id]);
    return rows[0] || null;
};

// Creates a new card within a deck. Returns the full card row.
module.exports.create = async ({ front, back }, deck_id) => {
    const query = 'INSERT INTO cards (front, back, deck_id) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await pool.query(query, [front, back, deck_id]);
    return rows[0];
};

// Updates the front and back of a card. Returns the updated row.
module.exports.update = async (card_id, { front, back }) => {
    const query = 'UPDATE cards SET front = $1, back = $2 WHERE card_id = $3 RETURNING *';
    const { rows } = await pool.query(query, [front, back, card_id]);
    return rows[0];
};

// Deletes a card by id
module.exports.destroy = async (card_id) => {
    const query = 'DELETE FROM cards WHERE card_id = $1 RETURNING *';
    const { rows } = await pool.query(query, [card_id]);
    return rows[0] || null;
};