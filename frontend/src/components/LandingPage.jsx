import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublicDecks } from '../adapters/deck-adapters';
import './LandingPage.css'; // <--- Import the new styles

// A self-contained demo card for the hero — not tied to real deck data,
// it exists purely to let a visitor feel the flip before they sign up.
const HeroCard = () => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="hero-card-stage">
            <button
                type="button"
                className={`hero-card ${isFlipped ? 'is-flipped' : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
                aria-label="Tap to flip the demo card"
            >
                <span className="hero-card-face hero-card-front">
                    <span className="hero-card-eyebrow">Front</span>
                    <span className="hero-card-text">¿Cómo estás?</span>
                </span>
                <span className="hero-card-face hero-card-back">
                    <span className="hero-card-eyebrow">Back</span>
                    <span className="hero-card-text">How are you?</span>
                </span>
            </button>
            <p className="hero-card-hint">Tap the card</p>
        </div>
    );
};

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
            <section className="hero">
                <div className="hero-copy">
                    <span className="mark-label">Build-A-Deck</span>
                    <h1>
                        Everything you know
                        <br />
                        started as a card.
                    </h1>
                    <p className="hero-subtext">
                        Turn what you're learning into decks you can drill anywhere —
                        vocabulary, formulas, dates, anything worth remembering.
                    </p>
                    <Link to="/auth" className="hero-cta">
                        Start building a deck →
                    </Link>
                </div>
                <HeroCard />
            </section>

            <section className="community-section">
                <header className="landing-header">
                    <span className="mark-label">Community decks</span>
                    <h2>Learn from what others have built</h2>
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
            </section>
        </div>
    );
};

export default LandingPage;