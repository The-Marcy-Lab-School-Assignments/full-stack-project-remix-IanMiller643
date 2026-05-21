import { useEffect, useState } from 'react';
import { fetchMyDecks, createDeck, deleteDeck } from '../adapters/deck-adapters';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const [decks, setDecks] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    const loadDecks = async () => {
        const { data } = await fetchMyDecks();
        if (data) setDecks(data);
    };

    useEffect(() => { loadDecks(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const { data } = await createDeck({
            title: newTitle,
            description: newDescription,
            is_public: isPublic
        });

        if (data) {
            setDecks([...decks, data]);
            setNewTitle('');
            setNewDescription('');
            setIsPublic(false);
        }
    };

    const handleDelete = async (id) => {
        await deleteDeck(id);
        setDecks(decks.filter(d => d.deck_id !== id));
    };

    return (
        <div className="dashboard-container">
            <h1>My Decks</h1>

            <section className="create-deck-section">
                <h3>Create a New Deck</h3>
                <form onSubmit={handleCreate}>
                    <input
                        className="deck-input"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Deck Title (e.g. Spanish Verbs)"
                        required
                    />
                    <textarea
                        className="deck-textarea"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Description (Optional)"
                    />
                    <label className="privacy-label">
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                        />
                        <span>Make this deck public?</span>
                    </label>
                    <button type="submit" className="btn-primary">Create Deck</button>
                </form>
            </section>

            <div className="deck-list">
                {decks.map(deck => (
                    <div key={deck.deck_id} className="deck-item">
                        <div className="deck-info">
                            <h3>{deck.title}</h3>
                            <p className="deck-description">
                                {deck.description || "No description provided."}
                            </p>
                            <span className={`status-badge ${deck.is_public ? 'status-public' : 'status-private'}`}>
                                {deck.is_public ? 'Public' : 'Private'}
                            </span>
                        </div>

                        <div className="deck-actions">
                            <Link to={`/study/${deck.deck_id}`}>
                                <button className="btn-action btn-study">Study</button>
                            </Link>
                            <Link to={`/edit/${deck.deck_id}`}>
                                <button className="btn-action btn-manage">Manage Cards</button>
                            </Link>
                            <button className="btn-action btn-delete" onClick={() => handleDelete(deck.deck_id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;