const multer = require("multer");
const Post = require("../models/post");
const User = require("../models/user");
const fs = require("fs-extra");

class postController {
  createPost = async (req, res, next) => {
    try {
      const { youtube, content } = req.body;

      let images = [];
      for (let i = 0; i < req.files.length; i++) {
        let { path, originalname } = req.files[i];
        let newPath = `img/${
          req.user._id
        }/${new Date().getTime()}${originalname}`;

        if (fs.existsSync("public/" + newPath)) {
          return res.end(
            JSON.stringify({
              success: false,
              message: "Failed",
            })
          );
        }
        fs.moveSync(path, "public/" + newPath);
        images.push(newPath);
      }

      const post = new Post({
        idOwner: req.user._id,
        content,
        createdAt: new Date(),
        images,
        video: youtube,
      });
      await post.save();

      User.findById(req.user._id, async (error, doc) => {
        if (error) {
          throw error;
        }

        if (doc != null) {
          doc.post.push(post._id);
          await doc.save();

          await post
            .populate("idOwner")
            .populate({
              path: "listComment",
              model: "Comment",
              populate: {
                path: "idOwner",
                model: "User",
              },
            })
            .execPopulate();
          res.json(post);
          console.log(post);
        }
      });
    } catch (error) {
      res.send(error);
    }
  };

  //API trra về 10post
  pagePost = async (req, res, next) => {
    const { idUser, turn } = req.query;
    console.log(turn);

    let listPost = [];
    if (typeof idUser == "undefined") {
      listPost = await Post.find()
        .populate("idOwner")
        .populate({
          path: "listComment",
          model: "Comment",
          populate: {
            path: "idOwner",
            model: "User",
          },
        })
        .limit(10)
        .skip(10 * Number(turn))
        .sort({ createdAt: -1 })
        .exec();
    } else {
      listPost = await Post.find({ idOwner: idUser })
        .populate("idOwner")
        .populate({
          path: "listComment",
          model: "Comment",
          populate: {
            path: "idOwner",
            model: "User",
          },
        })
        .limit(5)
        .skip(5 * Number(turn))
        .sort({ createdAt: -1 })
        .exec();
    }

    res.send(listPost);
  };

  reactPost(req, res, next) {
    try {
      const { idUserReact, idPostReact } = req.body;

      Post.findById(idPostReact, async function (err, doc) {
        if (err) {
          throw err;
        }

        const index = doc.heart.indexOf(idUserReact);
        if (index != -1) {
          doc.heart.splice(index, 1);
        } else {
          doc.heart.push(idUserReact);
        }

        await doc.save();
        res.status(401);
      });
    } catch (error) {
      next(error);
    }
  }

  repairPost = async (req, res, next) => {
    try {
      const { youtube, content, deleteImages, idPost } = req.body;

      const booleanDeleteImages = deleteImages == "true" ? true : false;
      let images = [];

      if (booleanDeleteImages == false) {
        for (let i = 0; i < req.files.length; i++) {
          let { path, originalname } = req.files[i];
          let newPath = `img/${
            req.user._id
          }/${new Date().getTime()}${originalname}`;

          if (fs.existsSync("public/" + newPath)) {
            return res.end(
              JSON.stringify({
                success: false,
                message: "File failed",
              })
            );
          }
          fs.moveSync(path, "public/" + newPath);
          images.push(newPath);
        }
      }

      Post.findById(idPost, async function (error, check) {
        if (error) {
          throw error;
        }

        check.content = content;
        check.updatedAt = new Date();
        check.images = images;
        if (youtube.trim() != "") {
          check.video = youtube;
        }

        await check.save();

        console.log(check, "11");
        await check
          .populate("idOwner")
          .populate({
            path: "listComment",
            model: "Comment",
            populate: {
              path: "idOwner",
              model: "User",
            },
          })
          .execPopulate();
        console.log(check);

        res.json(check);
      });
    } catch (error) {
      next(error);
    }
  };

  deletePost = async (req, res, next) => {
    try {
      const { idPostDel } = req.query;
      Post.findByIdAndRemove(idPostDel, {
        idOwner: req.user._id,
      }).exec();

      res.status(401);
    } catch (error) {
      next(err);
    }
  };
}

module.exports = new postController();
