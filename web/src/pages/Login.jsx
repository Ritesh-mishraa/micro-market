import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Login form submitted", formData);
        try {
            console.log("Calling login function...");
            await login(formData.email, formData.password);
            console.log("Login successful, navigating to home");
            navigate('/');
        } catch (err) {
            console.error("Login error:", err);
            const errorMsg = err.response?.data?.error || 'Login failed';
            setError(errorMsg);
            alert(`Login failed: ${errorMsg}`);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <p className="error-msg">{error}</p>}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
