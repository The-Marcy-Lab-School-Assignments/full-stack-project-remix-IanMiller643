const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  // Drop tables in reverse dependency order
  await pool.query('DROP TABLE IF EXISTS cards');
  await pool.query('DROP TABLE IF EXISTS decks');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE decks (
      deck_id     SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT,
      is_public   BOOLEAN DEFAULT FALSE,
      user_id     INTEGER REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE cards (
      card_id     SERIAL PRIMARY KEY,
      front       TEXT NOT NULL,
      back        TEXT NOT NULL,
      deck_id     INTEGER REFERENCES decks(deck_id) ON DELETE CASCADE
    )
  `);

  const [aliceHash, bobHash] = await Promise.all([
    bcrypt.hash('password123', SALT_ROUNDS),
    bcrypt.hash('password123', SALT_ROUNDS),
  ]);

  const { rows: users } = await pool.query(`
    INSERT INTO users (username, password_hash) VALUES
      ('alice', $1),
      ('bob',   $2)
    RETURNING user_id, username
  `, [aliceHash, bobHash]);

  const [alice, bob] = users;

  const { rows: decks } = await pool.query(`
    INSERT INTO decks (title, description, is_public, user_id) VALUES
      ('JavaScript Basics', 'Fundamentals of JS', TRUE,  $1),
      ('Private Notes',     'Secret study tips',  FALSE, $1),
      ('PostgreSQL',        'Database commands',  TRUE,  $2)
    RETURNING deck_id, title
  `, [alice.user_id, bob.user_id]);

  const [jsDeck, privateDeck, sqlDeck] = decks;

  await pool.query(`
    INSERT INTO cards (front, back, deck_id) VALUES
      ('What is a Closure?', 'A function with its lexical environment.', $1),
      ('Map vs ForEach',     'Map returns an array, ForEach does not.',  $1),
      ('Top Secret',         'Do not share this card.',                  $2),
      ('SELECT',             'Used to fetch data from a database.',      $3),
      ('SERIAL',             'Auto-incrementing integer in Postgres.',   $3)
  `, [jsDeck.deck_id, privateDeck.deck_id, sqlDeck.deck_id]);

  return users;
};

seed()
  .then((users) => {
    console.log('Database seeded successfully.');
    console.log(`  Users: ${users.map((u) => u.username).join(', ')}`);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());