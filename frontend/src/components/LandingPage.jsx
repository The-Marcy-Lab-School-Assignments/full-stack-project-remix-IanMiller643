import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublicDecks } from '../adapters/deck-adapters';
import './LandingPage.css'; // <--- Import the new styles

const LandingPage = () => {
    const [publicDecks, setPublicDecks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPublicContent = async () => {
            const { data } = await fetchPublicDecks();
            if (data) setPublicDecks(data);
            setLoading(false);
        };
        loadPublicContent();
    }, []);

    return (
        <div className="landing-container">
            <header className="landing-header">
                <h1>Explore Community Decks</h1>
                <p>Learn from decks created by the Build-A-Deck community.</p>
            </header>

            {loading ? (
                <div className="loading-state">
                    <p>Finding the best decks for you...</p>
                </div>
            ) : (
                <div className="deck-grid">
                    {publicDecks.map((deck) => (
                        <div key={deck.deck_id} className="deck-card">
                            <div>
                                <h3 className="deck-title">{deck.title}</h3>
                                <p className="deck-description">
                                    {deck.description || "No description provided for this deck."}
                                </p>

                                <div className="attribution-container">
                                    <span className="attribution-label">Created by</span>
                                    <span className="username-badge">@{deck.username}</span>
                                </div>
                            </div>

                            <Link to={`/study/${deck.deck_id}`} className="study-button">
                                Study This Deck
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {!loading && publicDecks.length === 0 && (
                <div className="empty-state">
                    <p>No public decks available yet. Log in to create the first one!</p>
                </div>
            )}
        </div>
    );
};

export default LandingPage;