const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: String, default: 'anon' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const postSchema = new mongoose.Schema({
  url: { type: String, required: true },        // direct MP4 URL (free hosting)
  caption: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  comments: { type: [commentSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
