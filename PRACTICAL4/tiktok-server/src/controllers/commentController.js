const prisma = require('../lib/prisma');

exports.addComment = async (req, res) => {
  try {
    const comment = await prisma.comment.create({
      data: { text: req.body.text, userId: req.user.id, videoId: parseInt(req.params.videoId) }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { videoId: parseInt(req.params.videoId) },
      include: { user: { select: { username: true } } }
    });
    res.json(comments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};