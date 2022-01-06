const Comment = require("../models/comment");
const Post = require("../models/post");

class CommentController {
  comment(req, res, next) {
    try {
      const { message, idOwner, idPostCmt } = req.body;
      const listNewComment = new Comment({
        message,
        idOwner,
        createdAt: new Date(),
      });
      Post.findById(idPostCmt, async function (error, check) {
        if (error) {
          throw error;
        }
        listNewComment.save();
        if (check != null) {
          check.listComment.push(listNewComment._id);
          await check.save();
          await listNewComment.populate("idOwner").execPopulate();
          res.json(listNewComment);
        }
      });
    } catch (error) {
      res.send(error);
    }
  }

  deleteComment(req, res, next) {
    try {
      const { idComment, idUser } = req.query;
      Comment.findByIdAndRemove(idComment, {
        idOwner: idUser,
      }).exec();
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = new CommentController();
