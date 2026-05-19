const handleFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Fetch failed. ${response.status} ${response.statusText}`);

    // For DELETE or empty responses, we check if there's content before parsing
    const contentType = response.headers.get("content-type");
    const data = (contentType && contentType.includes("application/json"))
      ? await response.json()
      : null;

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// Fetch all public decks
export const fetchPublicDecks = async () => {
  return handleFetch('/api/decks');
};

// Fetch decks owned by the current user
export const fetchMyDecks = async () => {
  return handleFetch('/api/decks/me');
};

export const createDeck = async ({ title, description, is_public }) => {
  return handleFetch('/api/decks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, is_public }),
  });
};

export const updateDeck = async (id, updates) => {
  return handleFetch(`/api/decks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
};

export const deleteDeck = async (id) => {
  return handleFetch(`/api/decks/${id}`, { method: 'DELETE' });
};