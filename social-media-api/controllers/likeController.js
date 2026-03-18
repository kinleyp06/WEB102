const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { likes, posts } = require('../utils/mockData');

// @desc    Like a post
// @route   POST /api/likes
exports.likePost = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');

  if (!userId) {
    return next(new ErrorResponse('Not authorized', 401));
  }

  const post = posts.find(p => p.id === req.body.post_id);
  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  const alreadyLiked = likes.find(
    l => l.post_id === req.body.post_id && l.user_id === userId
  );

  if (alreadyLiked) {
    return next(new ErrorResponse('Already liked', 400));
  }

  const newLike = {
    id: (likes.length + 1).toString(),
    post_id: req.body.post_id,
    user_id: userId,
  };

  likes.push(newLike);

  res.status(201).json({ success: true, data: newLike });
});

// @desc    Unlike post
// @route   DELETE /api/likes/:id
exports.unlikePost = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');

  const index = likes.findIndex(l => l.id === req.params.id);

  if (index === -1) {
    return next(new ErrorResponse('Like not found', 404));
  }

  if (likes[index].user_id !== userId) {
    return next(new ErrorResponse('Not authorized', 401));
  }

  likes.splice(index, 1);

  res.status(200).json({ success: true, data: {} });
});