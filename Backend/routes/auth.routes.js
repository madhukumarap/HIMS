const { verifySignUp } = require("../middleware/verifySignUp");
const controller = require("../Controller/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/:ClientID/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );
  app.post(
    "/api/:ClientID/auth/signupUI",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signupUI
  );
  app.post("/api/auth/signin", controller.signin);

  app.post("/:ClientID/api/auth/signin", controller.signin);
  app.post("/api/logout", controller.logout);
  app.get(
    "/api/get-logged-in-status-by-userid",
    controller.getLoggedInStatusByUserId
  );
};
