const Inform = require("../models/inform");
const TypeInform = require("../models/typeInform");
const socket = require("../config-socket");

class InformController {
  notify = async (req, res, next) => {
    try {
      const { id } = req.query;
      if (id && id != "") {
        const informPost = await Inform.findById(id)

          .populate("idType")
          .populate("idOwner");
        res.render("informationView", {
          informPost,
          title: req.user.name,
          user: req.user,
        });
      } else {
        let { type, page } = req.query;
        console.log(type);
        if (typeof type == "undefined") {
          type = "all";
        }
        if (typeof page == "undefined") {
          page = 1;
        }
        page = Number(page);
        const pag = 5;
        let listInform = [];
        let totalInform = 0;
        if (type == "all") {
          listInform = await Inform.find()
            .populate("idType")
            .limit(pag)
            .skip((page - 1) * pag)
            .sort({ createdAt: -1 });
          totalInform = await Inform.count();
        } else {
          totalInform = await Inform.count({
            idType: type,
          }).count();
          listInform = await Inform.find({
            idType: type,
          })
            .populate("idType")
            .limit(pag)
            .skip((page - 1) * pag)
            .sort({ createdAt: -1 });
        }
        const totalPage = Math.ceil(totalInform / pag);

        const listTypeInform = await TypeInform.find();
        console.log(listInform);
        res.render("listInforView", {
          title: "List Inform",
          back: page > 1 ? true : false,
          next: page < totalPage ? true : false,
          currentPage: page,
          user: req.user,
          listInform,
          listTypeInform,
          type,
          idType: type,
        });
      }
    } catch (error) {
      res.send(error);
      res.redirect("back");
    }
  };

  createNotify = async (req, res, next) => {
    try {
      const { classify, title, content } = req.body;

      const type = req.user.manageTopic;
      const newInform = new Inform({
        idOwner: req.user._id,
        classify,
        title,
        content,
        createdAt: new Date(),
        idType: classify,
      });

      await newInform.save();
      socket.getIO().local.emit("haveNewInform", "ok");
      res.redirect("back");
    } catch (error) {
      res.send(error);
      res.redirect("back");
    }
  };

  returnNotify = async (req, res, next) => {
    try {
      const listInform = await Inform.find()
        .populate("idType")
        .limit(5)
        .sort({ createdAt: -1 });
      res.json(listInform);
    } catch (error) {
      res.send(error);
      res.status(401);
    }
  };
  deleteNotify(req, res, next) {
    try {
      const { id } = req.params;
      Inform.findByIdAndRemove(id).exec();
      res.redirect("/inform");
    } catch (error) {
      res.send(error);
      res.redirect("back");
    }
  }
  editNotify = async (req, res, next) => {
    try {
      const { idInform, title, content } = req.body;
      const userID = req.user._id;
      await Inform.findById(idInform, async (error, check) => {
        if (error) {
          throw new Error();
        }
        if (String(check.idOwner) == userID) {
          check.content = content;
          check.title = title;
          check.save();
          res.redirect("back");
        }
      });
    } catch (error) {
      res.send(error);
      res.redirect("/");
    }
  };
}

module.exports = new InformController();
