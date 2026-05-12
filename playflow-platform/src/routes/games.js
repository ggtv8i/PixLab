import express from 'express';
import Game from '../models/Game.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/games
// @desc    Get all published games (for endless scrolling)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const sort = req.query.sort || 'createdAt';
    
    let query = { isPublished: true };
    
    if (category) {
      query.category = category;
    }
    
    const games = await Game.find(query)
      .populate('creator', 'displayName avatar')
      .sort({ [sort]: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    
    const total = await Game.countDocuments(query);
    
    res.json({
      success: true,
      count: games.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: games
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/games/:id
// @desc    Get single game
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('creator', 'displayName avatar email')
      .populate('comments.user', 'displayName avatar');
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }
    
    // Increment play count
    game.plays += 1;
    await game.save();
    
    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/games
// @desc    Create new game (requires authentication)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, gameCode, category, tags, thumbnail } = req.body;
    
    const game = await Game.create({
      title,
      description,
      creator: req.user._id,
      gameCode,
      category,
      tags,
      thumbnail,
      isPublished: true
    });
    
    // Add game to user's created games
    req.user.createdGames.push(game._id);
    await req.user.save();
    
    res.status(201).json({
      success: true,
      data: game
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/games/:id
// @desc    Update game (requires authentication and ownership)
router.put('/:id', protect, async (req, res) => {
  try {
    let game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }
    
    // Check ownership
    if (game.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this game'
      });
    }
    
    game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/games/:id
// @desc    Delete game (requires authentication and ownership)
router.delete('/:id', protect, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }
    
    // Check ownership
    if (game.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this game'
      });
    }
    
    await game.deleteOne();
    
    // Remove from user's created games
    req.user.createdGames = req.user.createdGames.filter(
      id => id.toString() !== req.params.id
    );
    await req.user.save();
    
    res.json({
      success: true,
      message: 'Game deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/games/:id/like
// @desc    Like/unlike a game
router.post('/:id/like', protect, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }
    
    // Check if already liked
    const existingLike = game.likes.find(
      like => like.user.toString() === req.user._id.toString()
    );
    
    if (existingLike) {
      // Unlike
      game.likes = game.likes.filter(
        like => like.user.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      game.likes.push({ user: req.user._id });
    }
    
    await game.save();
    
    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/games/:id/save
// @desc    Save/unsave a game to library
router.post('/:id/save', protect, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }
    
    // Check if already saved
    const existingSave = game.saves.find(
      save => save.user.toString() === req.user._id.toString()
    );
    
    if (existingSave) {
      // Unsave
      game.saves = game.saves.filter(
        save => save.user.toString() !== req.user._id.toString()
      );
      
      // Remove from user's saved games
      req.user.savedGames = req.user.savedGames.filter(
        id => id.toString() !== req.params.id
      );
    } else {
      // Save
      game.saves.push({ user: req.user._id });
      
      // Add to user's saved games
      req.user.savedGames.push(game._id);
    }
    
    await game.save();
    await req.user.save();
    
    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/games/:id/comment
// @desc    Add comment to a game
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }
    
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }
    
    game.comments.push({
      user: req.user._id,
      text: text.trim()
    });
    
    await game.save();
    
    const updatedGame = await Game.findById(game._id)
      .populate('comments.user', 'displayName avatar');
    
    res.json({
      success: true,
      data: updatedGame
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/games/:id/score
// @desc    Submit high score for a game
router.post('/:id/score', protect, async (req, res) => {
  try {
    const { score } = req.body;
    
    if (typeof score !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Score must be a number'
      });
    }
    
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }
    
    // Add or update high score
    const existingScore = game.highScores.find(
      hs => hs.user.toString() === req.user._id.toString()
    );
    
    if (existingScore) {
      if (score > existingScore.score) {
        existingScore.score = score;
        existingScore.achievedAt = Date.now();
      }
    } else {
      game.highScores.push({
        user: req.user._id,
        score
      });
    }
    
    // Sort high scores (descending)
    game.highScores.sort((a, b) => b.score - a.score);
    
    // Keep only top 100
    game.highScores = game.highScores.slice(0, 100);
    
    await game.save();
    
    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;
