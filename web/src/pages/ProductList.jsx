import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const { user, setUser } = useContext(AuthContext); // We need setUser to update favorites locally

    useEffect(() => {
        fetchProducts();
    }, [page, search]);

    const fetchProducts = async () => {
        try {
            const res = await api.get(`/products?page=${page}&search=${search}`);
            setProducts(res.data.products);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleFavorite = async (id) => {
        if (!user) {
            alert('Please login to favorite items');
            return;
        }

        console.log('Toggling favorite for:', id);
        const isFav = user.favorites.some(f => (f._id || f) === id);
        console.log('Current status:', isFav ? 'Liked' : 'Not Liked');

        try {
            if (isFav) {
                console.log('Removing from favorites...');
                await api.put(`/products/unlike/${id}`);
            } else {
                console.log('Adding to favorites...');
                await api.put(`/products/like/${id}`);
            }

            console.log('Fetching updated user profile...');
            const userRes = await api.get('/auth/me');
            console.log('Updated user favorites:', userRes.data.favorites);
            setUser(userRes.data);
        } catch (err) {
            console.error('Error toggling favorite:', err);
            alert('Failed to update favorite');
        }
    };

    const isFavorite = (id) => {
        if (!user) return false;
        return user.favorites.some(f => (f._id || f) === id);
    };

    return (
        <div className="product-list-container">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
            </div>

            <div className="product-grid">
                {products.map(product => (
                    <div key={product._id} className="product-card">
                        <Link to={`/products/${product._id}`}>
                            <img src={product.image} alt={product.title} />
                            <div className="product-info">
                                <h3>{product.title}</h3>
                                <p>${product.price}</p>
                            </div>
                        </Link>
                        <button
                            className={`fav-btn ${isFavorite(product._id) ? 'active' : ''}`}
                            onClick={() => toggleFavorite(product._id)}
                        >
                            {isFavorite(product._id) ? '♥' : '♡'}
                        </button>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </div>
    );
};

export default ProductList;
