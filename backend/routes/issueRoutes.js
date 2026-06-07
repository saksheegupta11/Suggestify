const express = require('express');
const {
  createIssue,
  getIssues,
  getIssueById,
  updateStatus,
  resolveIssue,
  generateAIPlan
} = require('../controllers/issueController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', protect, upload.single('image'), createIssue);
router.get('/', protect, getIssues);
router.get('/:id', protect, getIssueById);

router.put('/:id/status', protect, authorize('faculty', 'admin'), updateStatus);
router.put('/:id/resolve', protect, authorize('admin'), resolveIssue);
router.post('/:id/ai-plan', protect, authorize('faculty', 'admin'), generateAIPlan);

module.exports = router;