import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import api from '../api/axios';

const ProductDetailScreen = ({ route }) => {
    const { id } = route.params;
    const [product, setProduct] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        fetchProduct();
        checkFavorite();
    }, []);

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`);
            setProduct(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const checkFavorite = async () => {
        try {
            const res = await api.get('/auth/me'); // We need /me to return populated favorites
            // API returns favorites as objects or IDs. 
            // If populated, we check _id.
            const favs = res.data.favorites || [];
            const isFav = favs.some(f => (f._id || f) === id);
            setIsFavorite(isFav);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                await api.put(`/products/unlike/${id}`);
            } else {
                await api.put(`/products/like/${id}`);
            }
            setIsFavorite(!isFavorite);
        } catch (err) {
            Alert.alert('Error', 'Failed to update favorite');
        }
    };

    if (!product) return <View style={styles.center}><Text>Loading...</Text></View>;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title}>{product.title}</Text>
                <Text style={styles.price}>${product.price}</Text>
                <Text style={styles.description}>{product.description}</Text>

                <View style={styles.btnContainer}>
                    <Button
                        title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                        onPress={toggleFavorite}
                        color={isFavorite ? "red" : "#007bff"}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 300,
    },
    info: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        color: '#007bff',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 30,
        color: '#555',
    },
    btnContainer: {
        marginTop: 10,
    }
});

export default ProductDetailScreen;
