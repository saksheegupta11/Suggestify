const Issue = require('../models/Issue');

// @desc    Create a new issue
// @route   POST /api/issues
exports.createIssue = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = req.file.path; // Cloudinary URL
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      priority,
      imageUrl,
      submittedBy: req.user._id
    });

    // Populate submitter info
    await issue.populate({ path: 'submittedBy', select: 'name email' });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all issues (with filters)
// @route   GET /api/issues
exports.getIssues = async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    // Students see only their own issues
    if (req.user.role === 'student') {
      filter.submittedBy = req.user._id;
    }

    const issues = await Issue.find(filter)
      .populate('submittedBy', 'name email')
      .populate('resolvedBy', 'name email')
      .sort('-createdAt');

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('submittedBy', 'name email')
      .populate('resolvedBy', 'name email');

    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    // Check if student owns the issue
    if (req.user.role === 'student' && issue.submittedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update issue status (faculty/admin)
// @route   PUT /api/issues/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    issue.status = status;
    issue.updatedAt = Date.now();
    await issue.save();

    const updatedIssue = await Issue.findById(issue._id)
      .populate('submittedBy', 'name email')
      .populate('resolvedBy', 'name email');

    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve issue (admin only)
// @route   PUT /api/issues/:id/resolve
exports.resolveIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    issue.status = 'resolved';
    issue.resolvedBy = req.user._id;
    issue.updatedAt = Date.now();
    await issue.save();

    const resolvedIssue = await Issue.findById(issue._id)
      .populate('submittedBy', 'name email')
      .populate('resolvedBy', 'name email');

    res.json(resolvedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate AI plan for an issue (faculty/admin)
// @route   POST /api/issues/:id/ai-plan
exports.generateAIPlan = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    // Call Gemini API
    const axios = require('axios');
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Generate a concise 3-step action plan to resolve this campus issue: "${issue.title} - ${issue.description}"`
          }]
        }]
      }
    );

    const aiPlan = response.data.candidates[0].content.parts[0].text;
    
    // Save to issue
    issue.aiPlan = aiPlan;
    await issue.save();

    res.json({ aiPlan });
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to generate AI plan' });
  }
};