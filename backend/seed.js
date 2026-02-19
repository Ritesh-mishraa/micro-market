const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const products = [
    {
        title: 'Modern Laptop',
        price: 999,
        description: 'High performance laptop for work and play.',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wfGVufDB8fDB8fHww'
    },
    {
        title: 'Wireless Headphones',
        price: 199,
        description: 'Noise cancelling overhead headphones.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        title: 'Smart Watch',
        price: 299,
        description: 'Track your fitness and notifications.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNtYXJ0JTIwd2F0Y2h8ZW58MHx8MHx8fDA%3D'
    },
    {
        title: 'Casual Sneaker',
        price: 89,
        description: 'Comfortable everyday wear.',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D'
    },
    {
        title: 'DSLR Camera',
        price: 1200,
        description: 'Capture life in high quality.',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtZXJhfGVufDB8fDB8fHww'
    },
    {
        title: 'Gaming Mouse',
        price: 59,
        description: 'Precision control for gamers.',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91c2V8ZW58MHx8MHx8fDA%3D'
    },
    {
        title: 'Mechanical Keyboard',
        price: 129,
        description: 'Clicky and responsive typing.',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a2V5Ym9hcmR8ZW58MHx8MHx8fDA%3D'
    },
    {
        title: 'Sunglasses',
        price: 150,
        description: 'Stylish protection from the sun.',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VuZ2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        title: 'Backpack',
        price: 79,
        description: 'Durable bag for travel.',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFja3BhY2t8ZW58MHx8MHx8fDA%3D'
    },
    {
        title: 'Ceramic Mug',
        price: 15,
        description: 'Perfect for your morning coffee.',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVnfGVufDB8fDB8fHww'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        await Product.deleteMany({});
        await User.deleteMany({});

        await Product.insertMany(products);
        console.log('Products seeded');

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        const user1 = new User({
            username: 'johndoe',
            email: 'john@example.com',
            password
        });
        const user2 = new User({
            username: 'janedoe',
            email: 'jane@example.com',
            password
        });

        await user1.save();
        await user2.save();
        console.log('Users seeded');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
