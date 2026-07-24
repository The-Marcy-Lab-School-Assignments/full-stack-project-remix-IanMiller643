import { useState } from 'react';
import { updateUsername, deleteAccount } from '../adapters/auth-adapters';
import './ProfilePage.css';

const ProfilePage = ({ currentUser, setCurrentUser }) => {
    const [username, setUsername] = useState(currentUser.username);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleUsernameSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        const { data: user, error } = await updateUsername(username);
        if (error) {
            setErrorMessage('Could not update username. It may already be taken.');
            return;
        }
        setCurrentUser(user);
        setSuccessMessage('Username updated!');
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? This will permanently delete your decks and cards.'
        );
        if (!confirmed) return;

        const { error } = await deleteAccount();
        if (error) {
            setErrorMessage('Could not delete account. Please try again.');
            return;
        }
        setCurrentUser(null);
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>Your Profile</h2>

                <form onSubmit={handleUsernameSubmit} className="profile-form">
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    {errorMessage && <p className="error-text">{errorMessage}</p>}
                    {successMessage && <p className="success-text">{successMessage}</p>}
                    <button type="submit" className="auth-btn">Save Changes</button>
                </form>

                <div className="danger-zone">
                    <h3>Danger Zone</h3>
                    <p>Deleting your account permanently removes all of your decks and cards. This cannot be undone.</p>
                    <button onClick={handleDeleteAccount} className="btn-danger">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
