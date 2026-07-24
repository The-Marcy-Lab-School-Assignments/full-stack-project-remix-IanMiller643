import { useState } from 'react';
import './Flashcard.css'; // Use the CSS logic provided in the previous response

const Flashcard = ({ card }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="card-container" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                <div className="card-front">
                    <span className="card-eyebrow">Front</span>
                    <p>{card.front}</p>
                </div>
                <div className="card-back">
                    <span className="card-eyebrow">Back</span>
                    <p>{card.back}</p>
                </div>
            </div>
        </div>
    );
};

export default Flashcard;