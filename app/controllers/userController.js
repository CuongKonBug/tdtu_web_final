const TypeInform = require("../models/typeInform");
const User = require("../models/user");
const fs = require("fs-extra");
class UserController {
  createAcc(req, res, next) {
    try {
      const { username, name } = req.body;

      const user = new User({
        username: username,
        name,
        password: name,
        role: "faculty",
        hookEnabled: true,
        avatar: "img/test.jpg",
        faculty: name,
      });
      console.log(username);
      console.log(user);
      user.save();

      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  }

  classifyPost = async (req, res, next) => {
    try {
      const { idType, idUser } = req.body;

      User.findById(idUser, async (err, doc) => {
        if (err) {
          throw err;
        }
        if (doc != null) {
          const type = await TypeInform.findById(idType);
          doc.manageTopic = type.id;
          doc.save();
        }
        res.redirect("back");
      });
    } catch (err) {
      console.log(err);
    }
  };
  editInfor = async (req, res, next) => {
    try {
      const { name, faculty } = req.body;
      const classNumber = req.body.class;

      User.findById(req.user._id, async (err, doc) => {
        if (err) {
          throw err;
        }

        doc.name = name;
        doc.class = classNumber;
        doc.faculty = faculty;

        await doc.save();
        res.redirect("back");
      });
    } catch (err) {
      console.log(err);
      res.redirect("back");
    }
  };

  checkUser = async (req, res, next) => {
    try {
      const listUser = await User.find().limit(5);
      const { id } = req.query;

      const user = await User.findById(id);

      if (!user) {
        throw new Error();
      }

      res.render("user", {
        title: req.user.name,
        user: req.user,
        target: "user",
        targetedUser: user,
        listUser,
      });
    } catch (err) {
      res.redirect("back");
    }
  };
  changeForm = async (req, res, next) => {
    res.render("changePassword", {
      title: "Change Password",
    });
  };
  editAvatar(req, res, next) {
    try {
      let { path, originalname } = req.file;
      let newPath = `img/${
        req.user._id
      }/${new Date().getTime()}${originalname}`;

      if (fs.existsSync("public/" + newPath)) {
        return res.end(
          JSON.stringify({
            success: false,
            message: "File already existed",
          })
        );
      }
      fs.moveSync(path, "public/" + newPath);

      User.findById(req.user._id, (err, doc) => {
        if (err) {
          throw err;
        }
        doc.avatar = newPath;
        doc.save();
        res.redirect("back");
      });
    } catch (err) {
      console.log(err);
      res.redirect("back");
    }
  }
  logout(req, res, next) {
    req.logout();
    res.redirect("/login");
  }
  changePass = async (req, res, next) => {
    try {
      User.findById(req.user._id, async (err, doc) => {
        if (err) {
          throw err;
        }
        doc.password = req.body.newPassword;
        doc.hookEnabled = true;
        await doc.save();
        res.redirect("back");
      });
    } catch (er) {
      console.log(er);
      res.redirect("back");
    }
  };
}

module.exports = new UserController();
