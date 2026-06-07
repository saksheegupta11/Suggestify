const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Infrastructure', 'Cleanliness', 'IT', 'Safety', 'Academic', 'Other'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'resolved'], 
    default: 'pending' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  aiPlan: { type: String },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update `updatedAt` on save
IssueSchema.pre('save', async function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Issue', IssueSchema);