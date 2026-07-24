const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');
require('dotenv').config();

const logRoutes = require('./middleware/logRoutes');
const checkAuthentication = require('./middleware/checkAuthentication');
const authControllers = require('./controllers/authControllers');
const deckControllers = require('./controllers/deckControllers');
const cardControllers = require('./controllers/cardControllers');

const app = express();
const PORT = process.env.PORT || 8080;

// ====================================
// Middleware
// ====================================

app.use(logRoutes);
app.use(cookieSession({ name: 'session', secret: process.env.SESSION_SECRET }));
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// ====================================
// Auth routes
// ====================================

app.post('/api/auth/register', authControllers.register);
app.post('/api/auth/login', authControllers.login);
app.get('/api/auth/me', authControllers.getMe);
app.patch('/api/auth/me', checkAuthentication, authControllers.updateUsername);
app.delete('/api/auth/me', checkAuthentication, authControllers.deleteAccount);
app.delete('/api/auth/logout', authControllers.logout);

// ====================================
// Deck routes
// ====================================

app.get('/api/decks', deckControllers.listPublicDecks);
app.get('/api/decks/me', checkAuthentication, deckControllers.listMyDecks);
app.post('/api/decks', checkAuthentication, deckControllers.createDeck);
app.put('/api/decks/:id', checkAuthentication, deckControllers.updateDeck);
app.delete('/api/decks/:id', checkAuthentication, deckControllers.deleteDeck);

// ====================================
// Card routes (All require authentication)
// ====================================

app.get('/api/decks/:deck_id/cards', checkAuthentication, cardControllers.listCards);
app.post('/api/decks/:deck_id/cards', checkAuthentication, cardControllers.createCard);
app.patch('/api/cards/:card_id', checkAuthentication, cardControllers.updateCard);
app.delete('/api/cards/:card_id', checkAuthentication, cardControllers.deleteCard);

// ====================================
// Global Error Handler
// ====================================

const handleError = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
};
app.use(handleError);

// ====================================
// Listen
// ====================================

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));