const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const User = require('../models/User');

// Get all products with search and pagination
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search
        ? { title: { $regex: search, $options: 'i' } }
        : {};

    try {
        const products = await Product.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Product not found' });
        res.status(500).send('Server Error');
    }
});

// Add Favorite
router.put('/like/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const productId = req.params.id;

        // Check if already favorite (compare as strings)
        if (user.favorites.some(favId => favId.toString() === productId)) {
            return res.status(400).json({ msg: 'Product already liked' });
        }

        user.favorites.unshift(productId); // Add to beginning
        await user.save();
        res.json(user.favorites);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Remove Favorite
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const productId = req.params.id;

        // Find index (compare as strings)
        const removeIndex = user.favorites.findIndex(favId => favId.toString() === productId);

        if (removeIndex === -1) {
            return res.status(400).json({ msg: 'Product not yet liked' });
        }

        user.favorites.splice(removeIndex, 1);
        await user.save();
        res.json(user.favorites);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
