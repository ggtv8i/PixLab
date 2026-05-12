import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  gameCode: {
    html: {
      type: String,
      required: true
    },
    css: {
      type: String,
      default: ''
    },
    javascript: {
      type: String,
      required: true
    }
  },
  assets: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['image', 'audio', 'font', 'other']
    }
  }],
  category: {
    type: String,
    enum: ['action', 'puzzle', 'adventure', 'strategy', 'arcade', 'casual', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  saves: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    savedAt: {
      type: Date,
      default: Date.now
    }
  }],
  plays: {
    type: Number,
    default: 0
  },
  highScores: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number,
    achievedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: {
      type: Number,
      default: 0
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  version: {
    type: String,
    default: '1.0.0'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
gameSchema.index({ creator: 1 });
gameSchema.index({ isPublished: 1, createdAt: -1 });
gameSchema.index({ likes: -1 });
gameSchema.index({ plays: -1 });
gameSchema.index({ category: 1, isPublished: 1 });

// Virtual for like count
gameSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for save count
gameSchema.virtual('saveCount').get(function() {
  return this.saves.length;
});

// Virtual for comment count
gameSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

gameSchema.set('toJSON', { virtuals: true });
gameSchema.set('toObject', { virtuals: true });

const Game = mongoose.model('Game', gameSchema);

export default Game;
