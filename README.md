# Flashcard Study App — Full-Stack Case Study

A full-stack Flashcard Study app built with React, Express, and Postgres. Demonstrates session-based authentication, session rehydration, auth-dependent data fetching, and conditional rendering — the same patterns students use in their full-stack projects.

## User Stories

**Auth**
- A user can register for an account with a username and password
- A user can log in to an existing account
- A user can log out
- A returning user who has an active session is automatically logged in when they revisit the app

**Decks & Cards**
- A logged-in user can create a new deck (toggling it as public or private)
- A logged-in user can see a list of all decks they own
- A logged-in user can add, edit, or delete cards within their own decks
- Any user can view decks marked as public
- A logged-in user can only edit or delete decks that they specifically own

## Schema

```
users
─────────────────────────────
user_id       SERIAL PRIMARY KEY
username      TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL

decks
─────────────────────────────
deck_id     SERIAL PRIMARY KEY
title       TEXT NOT NULL
description TEXT
is_public   BOOLEAN DEFAULT FALSE
user_id     INTEGER REFERENCES users(user_id) ON DELETE CASCADE

cards
─────────────────────────────
card_id     SERIAL PRIMARY KEY
front       TEXT NOT NULL
back        TEXT NOT NULL
deck_id     INTEGER REFERENCES decks(deck_id) ON DELETE CASCADE
```

A user has many decks. A deck has many cards. Deleting a user deletes their decks; deleting a deck deletes its cards.

## API Contract

### Auth endpoints

| Method | Endpoint             | Request Body             | Response                          |
| ------ | -------------------- | ------------------------ | --------------------------------- |
| POST   | `/api/auth/register` | `{ username, password }` | `{ user_id, username }`           |
| POST   | `/api/auth/login`    | `{ username, password }` | `{ user_id, username }`           |
| DELETE | `/api/auth/logout`   | —                        | `{ message }`                     |
| GET    | `/api/auth/me`       | —                        | `{ user_id, username }` or `null` |

### Deck endpoints

| Method | Endpoint         | Request Body                        | Response                                   |
| ------ | ---------------- | ----------------------------------- | ------------------------------------------ |
| GET    | `/api/decks`     | —                                   | `[{ deck_id, title, is_public, user_id }]` |
| GET    | `/api/decks/me`  | —                                   | `[{ deck_id, title, is_public, user_id }]` |
| POST   | `/api/decks`     | `{ title, description, is_public }` | `{ deck_id, title, is_public, user_id }`   |
| PUT    | `/api/decks/:id` | `{ title, description, is_public }` | `{ deck_id, title, is_public, user_id }`   |
| DELETE | `/api/decks/:id` | —                                   | `{ message }`                              |

### Card endpoints (all require owner authentication)

| Method | Endpoint               | Request Body      | Response                       |
| ------ | ---------------------- | ----------------- | ------------------------------ |
| GET    | `/api/decks/:id/cards` | —                 | `[{ card_id, front, back }]`   |
| POST   | `/api/decks/:id/cards` | `{ front, back }` | `{ card_id, front, back }`     |
| PATCH  | `/api/cards/:card_id`  | `{ front, back }` | `{ card_id, front, back }`     |
| DELETE | `/api/cards/:card_id`  | —                 | `{ message }`                  |





## Setup

### 1. Database

Create a local Postgres database:

```sh
createdb flashcards_db
```

### 2. Server

```sh
cd server
npm install
cp .env.template .env
```

Open `.env` and fill in your Postgres credentials and a session secret. Then seed the database:

```sh
npm run db:seed
```

Start the server:

```sh
npm run dev
```

The server runs on `http://localhost:8080`.

### 3. Frontend

In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`. The Vite dev proxy forwards all `/api` requests to the Express server so session cookies work correctly.

## Seed Users

After running `npm run db:seed`, these accounts are available:

| Username | Password    |
| -------- | ----------- |
| alice    | password123 |
| bob      | password123 |

## Application Structure

```
swe-casestudy-7-todo-app/
├── frontend/               # React app (Vite)
│   ├── src/
│   │   ├── App.jsx         # Root component: currentUser state, session rehydration, auth handlers
│   │   ├── adapters/
│   │   │   ├── auth-adapters.js  # Fetch adapters for /api/auth/* endpoints
│   │   │   └── todo-adapters.js  # Fetch adapters for /api/todos/* endpoints
│   │   └── components/
│   │       ├── AuthPage.jsx    # Login + Register forms (shown when logged out)
│   │       ├── TodoPage.jsx    # Main app container (shown when logged in)
│   │       ├── AddTodoForm.jsx # Form to create a new todo
│   │       ├── TodoList.jsx    # Renders a list of TodoItems
│   │       └── TodoItem.jsx    # Single todo: checkbox, title, delete button
│   └── vite.config.js      # Proxies /api requests to Express in development
└── server/                 # Express + Postgres API
    ├── index.js            # App entry point, route definitions
    ├── controllers/
    │   ├── authControllers.js  # register, login, logout, getMe
    │   └── todoControllers.js  # list, create, update, delete todos
    ├── models/
    │   ├── userModel.js    # SQL queries for the users table
    │   └── todoModel.js    # SQL queries for the todos table
    ├── middleware/
    │   ├── checkAuthentication.js  # Blocks unauthenticated requests
    │   └── logRoutes.js            # Logs each incoming request
    └── db/
        ├── pool.js         # Postgres connection pool
        └── seed.js         # Creates tables and inserts sample data
```
