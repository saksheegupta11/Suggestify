const Issue = require('../models/Issue');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
exports.getStats = async (req, res) => {
  try {
    const total = await Issue.countDocuments();
    const pending = await Issue.countDocuments({ status: 'pending' });
    const inProgress = await Issue.countDocuments({ status: 'in-progress' });
    const resolved = await Issue.countDocuments({ status: 'resolved' });

    // Optional: category breakdown
    const categories = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      total,
      pending,
      inProgress,
      resolved,
      categories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};