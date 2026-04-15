const Post = require('../models/Post');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name userType');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
