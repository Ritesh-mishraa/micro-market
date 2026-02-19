import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your machine's IP address if running on physical device
// For Android Emulator, use 'http://10.0.2.2:5000'
// For iOS Simulator, use 'http://localhost:5000'
const BASE_URL = 'http://10.0.2.2:5000';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export default api;
