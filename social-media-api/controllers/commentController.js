const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { comments, users, posts } = require('../utils/mockData');

// @desc    Get all comments
// @route   GET /api/comments
exports.getComments = asyncHandler(async (req, res, next) => {
  const results = comments.map(comment => {
    const user = users.find(u => u.id === comment.user_id);
    return {
      ...comment,
      user: user ? { id: user.id, username: user.username } : null,
    };
  });

  res.status(200).json({ success: true, data: results });
});

// @desc    Create comment
// @route   POST /api/comments
exports.createComment = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');
  if (!userId) {
    return next(new ErrorResponse('Not authorized', 401));
  }

  const post = posts.find(p => p.id === req.body.post_id);
  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  const newComment = {
    id: (comments.length + 1).toString(),
    text: req.body.text,
    post_id: req.body.post_id,
    user_id: userId,
    created_at: new Date().toISOString(),
  };

  comments.push(newComment);

  res.status(201).json({ success: true, data: newComment });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');

  const index = comments.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return next(new ErrorResponse('Comment not found', 404));
  }

  if (comments[index].user_id !== userId) {
    return next(new ErrorResponse('Not authorized', 401));
  }

  comments.splice(index, 1);

  res.status(200).json({ success: true, data: {} });
});