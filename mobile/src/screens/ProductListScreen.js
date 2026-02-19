import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, Button } from 'react-native';
import api from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductListScreen = ({ navigation, setIsLoggedIn }) => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, [page, search]);

    const fetchProducts = async () => {
        try {
            const res = await api.get(`/products?page=${page}&search=${search}`);
            if (page === 1) {
                setProducts(res.data.products);
            } else {
                setProducts(prev => [...prev, ...res.data.products]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetail', { id: item._id })}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>${item.price}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search..."
                    value={search}
                    onChangeText={(text) => { setSearch(text); setPage(1); }}
                />
                <Button title="Logout" onPress={handleLogout} color="red" />
            </View>

            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                onEndReached={() => setPage(prev => prev + 1)}
                onEndReachedThreshold={0.5}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
        gap: 10,
    },
    searchBar: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 8,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: 'white',
        marginBottom: 15,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    image: {
        width: '100%',
        height: 150,
    },
    info: {
        padding: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
        color: '#007bff',
        marginTop: 5,
    }
});

export default ProductListScreen;
