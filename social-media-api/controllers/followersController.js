const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { followers, users } = require('../utils/mockData');

// @desc    Follow user
// @route   POST /api/followers
exports.followUser = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');
  const targetId = req.body.user_id;

  if (!userId) {
    return next(new ErrorResponse('Not authorized', 401));
  }

  if (userId === targetId) {
    return next(new ErrorResponse("You can't follow yourself", 400));
  }

  const targetUser = users.find(u => u.id === targetId);
  if (!targetUser) {
    return next(new ErrorResponse('User not found', 404));
  }

  const alreadyFollowing = followers.find(
    f => f.user_id === userId && f.following_id === targetId
  );

  if (alreadyFollowing) {
    return next(new ErrorResponse('Already following', 400));
  }

  const newFollow = {
    id: (followers.length + 1).toString(),
    user_id: userId,
    following_id: targetId,
  };

  followers.push(newFollow);

  res.status(201).json({ success: true, data: newFollow });
});

// @desc    Unfollow user
// @route   DELETE /api/followers/:id
exports.unfollowUser = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');

  const index = followers.findIndex(f => f.id === req.params.id);

  if (index === -1) {
    return next(new ErrorResponse('Follow not found', 404));
  }

  if (followers[index].user_id !== userId) {
    return next(new ErrorResponse('Not authorized', 401));
  }

  followers.splice(index, 1);

  res.status(200).json({ success: true, data: {} });
});