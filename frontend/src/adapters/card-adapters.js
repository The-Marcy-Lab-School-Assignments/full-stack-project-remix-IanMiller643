const handleFetch = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Fetch failed. ${response.status} ${response.statusText}`);

        const contentType = response.headers.get("content-type");
        const data = (contentType && contentType.includes("application/json"))
            ? await response.json()
            : null;

        return { data, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

// Fetch all cards belonging to a specific deck
export const fetchCardsByDeck = async (deck_id) => {
    return handleFetch(`/api/decks/${deck_id}/cards`);
};

// Create a new card inside a specific deck
export const createCard = async (deck_id, { front, back }) => {
    return handleFetch(`/api/decks/${deck_id}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ front, back }),
    });
};

// Update a specific card's content
export const updateCard = async (card_id, updates) => {
    return handleFetch(`/api/cards/${card_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
};

// Delete a specific card
export const deleteCard = async (card_id) => {
    return handleFetch(`/api/cards/${card_id}`, {
        method: 'DELETE'
    });
};