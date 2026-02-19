import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './ProductList.css'; // Reuse basic grid styles

const Favorites = () => {
    const { user } = useContext(AuthContext);

    if (!user) return <div>Please login to view favorites.</div>;

    // Since /me populates favorites, user.favorites should be an array of objects
    const favorites = user.favorites || [];

    return (
        <div className="product-list-container">
            <h2>Your Favorites</h2>
            {favorites.length === 0 ? (
                <p>No favorites yet.</p>
            ) : (
                <div className="product-grid">
                    {favorites.map(product => (
                        // Check if product is populated (has title) or just ID. If ID, we can't display much.
                        // But we ensured /me populates it.
                        product.title ? (
                            <div key={product._id} className="product-card">
                                <Link to={`/products/${product._id}`}>
                                    <img src={product.image} alt={product.title} />
                                    <div className="product-info">
                                        <h3>{product.title}</h3>
                                        <p>${product.price}</p>
                                    </div>
                                </Link>
                            </div>
                        ) : null
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
