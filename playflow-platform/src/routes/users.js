import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/:id
// @desc    Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-googleId')
      .populate('createdGames', 'title thumbnail likes plays category')
      .populate('badges', 'name description icon color rarity');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Only show saved games if it's the current user
    let savedGames = [];
    if (req.user && req.user._id.toString() === req.params.id) {
      savedGames = await User.findById(req.params.id)
        .populate({
          path: 'savedGames',
          populate: { path: 'creator', select: 'displayName avatar' }
        })
        .then(u => u.savedGames);
    }
    
    res.json({
      success: true,
      data: {
        ...user.toObject(),
        savedGames: savedGames.length > 0 ? savedGames : undefined
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { displayName, bio, coverImage, theme, walletAddress } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (displayName) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (coverImage !== undefined) user.coverImage = coverImage;
    if (theme) user.theme = theme;
    if (walletAddress !== undefined) user.walletAddress = walletAddress;
    
    await user.save();
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/users/me/library
// @desc    Get current user's saved games library
router.get('/me/library', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'savedGames',
        populate: { path: 'creator', select: 'displayName avatar' }
      });
    
    res.json({
      success: true,
      count: user.savedGames.length,
      data: user.savedGames
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/users/me/scores
// @desc    Get current user's high scores
router.get('/me/scores', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'highScores.game',
        select: 'title thumbnail'
      });
    
    res.json({
      success: true,
      count: user.highScores.length,
      data: user.highScores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/users/me/games
// @desc    Get current user's created games
router.get('/me/games', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'createdGames',
        populate: { path: 'creator', select: 'displayName avatar' }
      });
    
    res.json({
      success: true,
      count: user.createdGames.length,
      data: user.createdGames
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
