import express from "express";
import homeController from '../controller/homeController';
import loginController from '../controller/loginController'
import passport from 'passport';
import checkUser from "../middleware/checkUser"
import passportController from '../controller/passportController'
const router = express.Router();

/**
 * 
 * @param {*} app : express app
 */

const initWebRoutes = (app) => {
    //path, handler
    router.get("/", checkUser.isLogin, homeController.handleHelloWord);
    router.get("/user", homeController.handleUserPage);
    router.post("/users/create-user", homeController.handleCreateNewUser);
    router.post("/delete-user/:id", homeController.handleDelteUser)
    router.get("/update-user/:id", homeController.getUpdateUserPage);
    router.post("/user/update-user", homeController.handleUpdateUser);


    router.get("/login", checkUser.isLogin, loginController.getLoginPage);
    // router.post("/login", passport.authenticate('local', {
    //     successRedirect: '/',
    //     failureRedirect: '/login'
    // }))
    router.post("/login", function (req, res, next) {
        passport.authenticate('local', function (error, user, infor) {
            if (error) {
                return res.status(500).json(error);
            }
            if (!user) {
                return res.status(401).json(infor.message);
            }
            req.login(user, function (err) {
                if (err) return next(err);
                return res.status(200).json({ ...user, redirectURL: req.body.serviceURL });
            });
        })(req, res, next)
    })
    router.post('/logout', passportController.handleLogout);
    router.post('/verify-token', loginController.verifySSOToken)

    router.get('/auth/google',
        passport.authenticate('google', { scope: ['profile', 'email'] }));

    router.get('/google/redirect',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function (req, res) {
            // Successful authentication, redirect home.
            // res.redirect('/');
            console.log(res)
            return res.render("social.ejs", { ssoToken: req.user.code })
        });
    //rest api
    //GET - R, POST- C, PUT - U, DELETE - D


    return app.use("/", router);
}

export default initWebRoutes;