import passport, { use } from 'passport';
import LocalStrategy from 'passport-local'
import loginRegisterService from '../service/loginRegisterService'

const configPassport = () => {
    passport.use(new LocalStrategy({
        passReqToCallback: true
    },
        async (req, username, password, done) => {
            const rawData = {
                valueLogin: username,
                password: password
            }
            let res = await loginRegisterService.loginUser(rawData);

            if (res && +res.EC === 0) {
                return done(null, res.DT)
            } else {
                return done(null, false, { message: res.EM });
            }
        }

    ))

}
const handleLogout = (req, res, next) => {
    req.session.destroy(function (err) {
        req.logout();
        res.redirect('/');
    });
}
module.exports = { configPassport, handleLogout };
