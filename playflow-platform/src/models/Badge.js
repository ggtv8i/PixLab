import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 200
  },
  icon: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#FFD700' // Gold by default
  },
  criteria: {
    type: String,
    required: true,
    maxlength: 500
  },
  category: {
    type: String,
    enum: ['achievement', 'milestone', 'special', 'event'],
    default: 'achievement'
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  }
}, {
  timestamps: true
});

const Badge = mongoose.model('Badge', badgeSchema);

export default Badge;
