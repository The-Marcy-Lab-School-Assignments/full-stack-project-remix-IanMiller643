import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../adapters/auth-adapters';
import './Navbar.css';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        setUser(null);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">
                <h3>Build-A-Deck</h3>
            </Link>

            <div className="nav-links">
                {user ? (
                    <>
                        <span className="user-welcome">Welcome, {user.username}!</span>
                        <Link to="/dashboard" className="nav-link">My Decks</Link>
                        <button onClick={handleLogout} className="btn-logout">
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/auth" className="nav-link nav-link-auth">
                        Login / Register
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;