import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProduct();
    }, [id]);

    const toggleFavorite = async () => {
        if (!user) return alert('Please login');
        const isFav = user.favorites.some(f => (f._id || f) === id);
        try {
            if (isFav) {
                await api.put(`/products/unlike/${id}`);
            } else {
                await api.put(`/products/like/${id}`);
            }
            const userRes = await api.get('/auth/me');
            setUser(userRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (!product) return <div>Loading...</div>;

    const isFav = user?.favorites.some(f => (f._id || f) === id);

    return (
        <div className="product-detail-container">
            <div className="detail-image">
                <img src={product.image} alt={product.title} />
            </div>
            <div className="detail-info">
                <h1>{product.title}</h1>
                <p className="price">${product.price}</p>
                <p className="description">{product.description}</p>
                <button
                    className={`fav-btn-large ${isFav ? 'active' : ''}`}
                    onClick={toggleFavorite}
                >
                    {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
