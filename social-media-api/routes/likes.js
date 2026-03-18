const express = require('express');
const {
    getlikes,
    getLike,
    createLike,
    updateLike,
    deleteLike
} = require('../Likes/commentLike');

const router = express.Router();

router.route('/').get(getLikes).post(createLike);

router.route('/:id').get(getLike).put(updateLike).delete(deleteLike);

module.exports = router;
