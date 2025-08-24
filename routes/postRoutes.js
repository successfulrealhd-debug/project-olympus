const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET /api/posts?skip=0&limit=10  (feed, newest first)
router.get('/posts', async (req, res) => {
  try {
    const skip = Math.max(parseInt(req.query.skip || '0', 10), 0);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 20);
    const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    res.json(posts);
  } catch (e) {
    console.error('GET /posts error', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/posts  { url, caption? }
router.post('/posts', async (req, res) => {
  try {
    const { url, caption } = req.body;
    if (!url) return res.status(400).json({ error: 'url is required' });
    const post = await Post.create({ url, caption: caption || '' });
    res.status(201).json(post);
  } catch (e) {
    console.error('POST /posts error', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/posts/:id/like  (increments likes)
router.post('/posts/:id/like', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    ).lean();
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json({ likes: post.likes });
  } catch (e) {
    console.error('POST /like error', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/posts/:id/comment  { user?, text }
router.post('/posts/:id/comment', async (req, res) => {
  try {
    const { user, text } = req.body;
    if (!text) return res.status(400).json({ error: 'text is required' });
    const update = {
      $push: { comments: { user: user || 'anon', text, createdAt: new Date() } }
    };
    const post = await Post.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json({ comments: post.comments });
  } catch (e) {
    console.error('POST /comment error', e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
