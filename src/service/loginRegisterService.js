import db from "../models/index"
import bcrypt from 'bcryptjs'
import { Op } from 'sequelize'
import { getGroupWithRole } from "./jwtService";
import { createJWT } from '../middleware/jwtAction'
require("dotenv").config();
import { v4 as uuidv4 } from 'uuid';
const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {

    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;


}
const checkPassword = (inputPassword, hashPassword) => {

    return bcrypt.compareSync(inputPassword, hashPassword)

}
const checkEmail = async (UserEmail) => {
    let user = await db.User.findOne({
        where: { email: UserEmail }
    })
    if (user) {
        return true;
    }
    return false;

}
const checkPhone = async (UserPhone) => {
    let user = await db.User.findOne({
        where: { phone: UserPhone }
    })
    if (user) {
        return true;
    }
    return false;

}
const registerNewUser = async (rawUserDate) => {
    try {
        let isEmailExist = await checkEmail(rawUserDate.email)
        if (isEmailExist === true) {
            return {
                EM: 'the email is already exist',
                EC: 1
            }
        }
        let isPhoneExist = await checkPhone(rawUserDate.phone)
        if (isPhoneExist === true) {
            return {
                EM: 'the phone is already exist',
                EC: 1
            }
        }
        let hashPassword = hashUserPassword(rawUserDate.password)

        await db.User.create({
            email: rawUserDate.email,
            phone: rawUserDate.phone,
            username: rawUserDate.username,
            password: hashPassword,
            groupId: 4
        });
        return {
            EM: 'A user is created successfully',
            EC: 0
        }

    } catch (error) {
        console.log(error)
        return {
            EM: 'Something wrongs is service.....',
            EC: -2
        }
    }

}
const updateUserRefreshToken = async (email, token) => {
    try {
        let a = await db.User.update(
            { refreshToken: token },
            {
                where: { email: email }
            }
        );
    } catch (error) {
        console.log(">>> error", error);
    }
}
const loginUser = async (rawUserDate) => {
    try {
        let user = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email: rawUserDate.valueLogin },
                    { phone: rawUserDate.valueLogin }
                ]
            }
        })
        if (user) {
            let isCorectPassword = checkPassword(rawUserDate.password, user.password)
            if (isCorectPassword === true) {
                const code = uuidv4();
                //role
                let groupWithRoles = await getGroupWithRole(user);
                // let payload = {
                //     email: user.email,
                //     groupWithRoles,
                //     username: user.username,

                // }
                // let token = createJWT(payload);
                return {
                    EM: 'oke',
                    EC: 0,
                    DT: {
                        code: code,
                        // access_token: token,
                        // data: groupWithRoles,
                        // email: user.email,
                        // username: user.username
                        email: user.email,
                        username: user.username,
                        groupWithRoles
                    }
                }

            }

        }
        console.log(">>> Not found user with email/phone: ", rawUserDate.valueLogin, "password: ", rawUserDate.password)
        return {
            EM: 'tài khoảng hoặc mật khẩu không đúng',
            EC: 1,
            DT: ''
        }







    } catch (error) {
        console.log("check er:", error)
        console.log(error)
        return {
            EM: 'Something wrongs is service.....',
            EC: -2
        }

    }

}
const upsertUser = async (typeAcc, dataRaw) => {
    try {
        let user = null;
        if (typeAcc === 'GOOGLE') {
            user = await db.User.findOne({
                where: {
                    email: dataRaw.email,
                    type: typeAcc
                },
                raw: true
            })
        }
        if (!user) {
            user = await db.User.create({
                email: dataRaw.email,
                username: dataRaw.username,
                type: typeAcc
            })
            user = user.get({ plain: true });
        }
        return user;
    } catch (err) {
        console.log(err);
    }
}
module.exports = {
    registerNewUser,
    loginUser,
    updateUserRefreshToken,
    upsertUser
}