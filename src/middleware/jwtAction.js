require("dotenv").config;
import jwt from 'jsonwebtoken';
const nonSecurePaths = ['/logout', '/login', '/register'];

const createJWT = (payLoad) => {
    let key = process.env.JWT_SECRET
    let token = null;
    try {
        token = jwt.sign(payLoad, key);

    } catch (error) {
        console.log(error)
    }

    return token
}
const verifytoken = (token) => {
    let key = process.env.JWT_SECRET
    let data = null;
    try {
        let decoded = jwt.verify(token, key);
        data = decoded

    } catch (error) {
        console.log(error)
    }
    return data;

}
const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}
const checkUserJWT = (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();

    let cookies = req.cookies;
    let tokenFromHeader = extractToken(req);

    if ((cookies && cookies.access_token) || tokenFromHeader) {
        let access_token = cookies && cookies.access_token ? cookies.access_token : tokenFromHeader;
        let decoded = verifytoken(access_token);
        if (decoded) {
            decoded.access_token = access_token;
            decoded.refresh_token = cookies.refresh_token;
            req.user = decoded;

            next();
        } else {
            return res.status(401).json({
                EC: -1,
                DT: '',
                EM: 'Not authenticated the user'
            })
        }
    }
    else {
        return res.status(401).json({
            EC: -1,
            DT: '',
            EM: 'Not authenticated the user'
        })
    }
}
const checkUserPermisstion = (req, res, next) => {
    if (nonSecurePaths.includes(req.path) || req.path === '/account') return next();
    if (req.user) {
        let email = req.user.email
        let roles = req.user.groupWithRoles.Roles;
        let currentUrl = req.path;
        if (!roles && roles.length === 0) {
            return res.status(403).json({
                EC: -1,
                DT: '',
                EM: 'bạn không có quyền truy cập'
            })
        }
        let canAccess = roles.some(item => item.url === currentUrl || currentUrl.includes(item.url))
        if (canAccess) {
            next();
        }
        else {
            return res.status(403).json({
                EC: -1,
                DT: '',
                EM: 'bạn không có quyền truy cập'
            })
        }

    } else {
        return res.status(401).json({
            EM: 'Not Authentication the user',
            DT: '',
            EC: -1
        })
    }
}

module.exports = {
    createJWT, verifytoken, checkUserJWT, checkUserPermisstion, extractToken
}