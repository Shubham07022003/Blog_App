const express = require('express');
const { Post, User, Comment } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all published posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { isDraft: false },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Get user's posts (including drafts)
router.get('/my-posts', auth, async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { authorId: req.user.id },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post' });
  }
});

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, isDraft, tags } = req.body;
    const post = await Post.create({
      title,
      content,
      isDraft,
      tags: tags || [],
      authorId: req.user.id,
    });

    const postWithAuthor = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name'],
        },
      ],
    });

    res.status(201).json(postWithAuthor);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
});

// Update post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, isDraft, tags } = req.body;
    await post.update({ title, content, isDraft, tags: tags || post.tags });

    const updatedPost = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name'],
        },
      ],
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Error updating post' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post' });
  }
});

// Get post comments
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.id },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Add comment
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.create({
      content,
      postId: req.params.id,
      authorId: req.user.id,
    });

    const commentWithAuthor = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name'],
        },
      ],
    });

    res.status(201).json(commentWithAuthor);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment' });
  }
});

module.exports = router; 