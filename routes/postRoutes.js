const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Create post
router.post('/', async (req, res) => {
    try {
        const newPost = await Post.create(req.body);
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'name email');
        res.json(posts);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
