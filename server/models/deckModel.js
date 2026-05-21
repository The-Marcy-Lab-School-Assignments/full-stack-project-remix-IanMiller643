const pool = require('../db/pool');

// Returns all decks owned by a specific user
module.exports.listByUser = async (user_id) => {
  const query = 'SELECT * FROM decks WHERE user_id = $1 ORDER BY deck_id ASC';
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns all decks marked as public
module.exports.listPublic = async () => {
  const query = 'SELECT decks.*, users.username AS username FROM decks INNER JOIN users ON decks.user_id = users.user_id WHERE decks.is_public = TRUE ORDER BY deck_id DESC';
  const { rows } = await pool.query(query);
  return rows;
};

// Returns a single deck row (used for ownership checks or viewing details)
module.exports.find = async (deck_id) => {
  const query = 'SELECT * FROM decks WHERE deck_id = $1';
  const { rows } = await pool.query(query, [deck_id]);
  return rows[0] || null;
};

// Creates a new deck. Returns the full deck row.
module.exports.create = async ({ title, description, is_public }, user_id) => {
  const query = `
    INSERT INTO decks (title, description, is_public, user_id) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *`;
  const { rows } = await pool.query(query, [title, description, is_public, user_id]);
  return rows[0];
};

// Updates deck details. Returns the updated row.
module.exports.update = async (deck_id, { title, description, is_public }) => {
  const query = `
    UPDATE decks 
    SET title = $1, description = $2, is_public = $3 
    WHERE deck_id = $4 
    RETURNING *`;
  const { rows } = await pool.query(query, [title, description, is_public, deck_id]);
  return rows[0];
};

// Deletes a deck by id
module.exports.destroy = async (deck_id) => {
  const query = 'DELETE FROM decks WHERE deck_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [deck_id]);
  return rows[0] || null;
};