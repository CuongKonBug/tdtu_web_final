const testRouter = require("./home");
const ggRouter = require("./google");
const commentRouter = require("./comment");
const postRouter = require("./post");
const informRouter = require("./inform");
const typeInformRouter = require("./typeInform");
const userRouter = require("./user");
const passport = require("../middleware/middlePassport");

function router(app) {
  app.use("/comment", commentRouter);
  app.use("/post", postRouter);
  app.use("/inform", informRouter);
  app.use("/typeInform", typeInformRouter);
  app.use("/user", userRouter);
  app.use("/", testRouter);
  app.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );
  app.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",

      successRedirect: "/",
      failureFlash: true,
    })
  );
}

module.exports = router;
