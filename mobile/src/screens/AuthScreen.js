import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthScreen = ({ navigation, setIsLoggedIn }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleSubmit = async () => {
        // Basic validation
        if (!email || !password || (!isLogin && !username)) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (!isLogin && password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const payload = isLogin ? { email, password } : { username, email, password };

            const res = await api.post(endpoint, payload);
            await AsyncStorage.setItem('token', res.data.token);
            setIsLoggedIn(true);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Authentication failed';
            Alert.alert('Error', errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>

            {!isLogin && (
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                />
            )}

            <TextInput
                ref={emailRef}
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
            />

            <Button title={isLogin ? "Login" : "Register"} onPress={handleSubmit} />

            <View style={styles.switchContainer}>
                <Button
                    title={isLogin ? "Switch to Register" : "Switch to Login"}
                    onPress={() => setIsLogin(!isLogin)}
                    color="gray"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    switchContainer: {
        marginTop: 20,
    }
});

export default AuthScreen;
