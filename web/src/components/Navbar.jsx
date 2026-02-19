import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">MicroMarket</Link>
                <div className="navbar-menu">
                    {user ? (
                        <>
                            <Link to="/" className="navbar-item">Products</Link>
                            <Link to="/favorites" className="navbar-item">Favorites</Link>
                            <button onClick={handleLogout} className="navbar-btn logout">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-item">Login</Link>
                            <Link to="/register" className="navbar-item">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
