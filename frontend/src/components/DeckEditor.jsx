import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCardsByDeck, createCard, deleteCard } from '../adapters/card-adapters';
import './DeckEditor.css'; // Import the new CSS file

const DeckEditor = () => {
    const { deck_id } = useParams();
    const [cards, setCards] = useState([]);
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');

    useEffect(() => {
        const loadCards = async () => {
            const { data } = await fetchCardsByDeck(deck_id);
            if (data) setCards(data);
        };
        loadCards();
    }, [deck_id]);

    const handleAddCard = async (e) => {
        e.preventDefault();
        const { data } = await createCard(deck_id, { front, back });
        if (data) {
            setCards([...cards, data]);
            setFront('');
            setBack('');
        }
    };

    const handleDelete = async (card_id) => {
        const { error } = await deleteCard(card_id);
        if (!error) {
            setCards(cards.filter(c => c.card_id !== card_id));
        }
    };

    return (
        <div className="editor-container">
            <h2>Edit Deck</h2>
            <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>

            <section className="add-card-section">
                <h3>Add New Card</h3>
                <form onSubmit={handleAddCard}>
                    <input
                        className="card-input"
                        placeholder="Front Side"
                        value={front}
                        onChange={(e) => setFront(e.target.value)}
                        required
                    />
                    <input
                        className="card-input"
                        placeholder="Back Side"
                        value={back}
                        onChange={(e) => setBack(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-add">Add Card</button>
                </form>
            </section>

            <div className="card-list">
                <h3>Cards in this Deck</h3>
                {cards.map(card => (
                    <div key={card.card_id} className="card-row">
                        <span className="card-text">
                            <strong>{card.front}</strong> / {card.back}
                        </span>
                        <button 
                            className="btn-delete-card" 
                            onClick={() => handleDelete(card.card_id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeckEditor;