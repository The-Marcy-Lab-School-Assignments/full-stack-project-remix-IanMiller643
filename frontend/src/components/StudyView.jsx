import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCardsByDeck } from '../adapters/card-adapters';
import Flashcard from '../components/Flashcard';
import './StudyView.css'; // Import the new CSS file

const StudyView = () => {
    const { deck_id } = useParams();
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const loadCards = async () => {
            const { data } = await fetchCardsByDeck(deck_id);
            if (data) setCards(data);
        };
        loadCards();
    }, [deck_id]);

    if (cards.length === 0) {
        return (
            <div className="study-empty">
                <p>No cards in this deck!</p>
                <Link to="/dashboard" className="btn-primary">Go create some!</Link>
            </div>
        );
    }

    const nextCard = () => setCurrentIndex((prev) => (prev + 1) % cards.length);
    const prevCard = () => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);

    return (
        <div className="study-container">
            <header className="study-header">
                <Link to="/dashboard">← Back</Link>
                <h2>Card {currentIndex + 1} of {cards.length}</h2>
                <div style={{ width: '50px' }}></div> {/* Spacer for alignment */}
            </header>

            <main className="flashcard-focus">
                <Flashcard card={cards[currentIndex]} />
            </main>

            <footer className="study-controls">
                <button className="control-btn" onClick={prevCard}>Previous</button>
                <button className="control-btn" onClick={nextCard}>Next</button>
            </footer>
        </div>
    );
};

export default StudyView;