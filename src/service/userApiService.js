import db from '../models/index'
import bcrypt from 'bcryptjs'
const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {

    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;


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
const getAllUser = async () => {
    try {
        let users = await db.User.findAll({
            attributes: ["id", "username", "email", "phone", "sex"],
            include: { model: db.Group, attributes: ["name", "description"], }
        });
        if (users) {

            return {
                EM: 'get data success',
                EC: 0,
                DT: users
            }

        } else {
            return {
                EM: 'get data success',
                EC: 0,
                DT: []
            }

        }

    } catch (error) {
        console.log(error)
        return {
            EM: 'somthing wrongs with',
            EC: 1,
            DT: []
        }
    }

}
const getUserWithPagination = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.User.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: ["id", "username", "email", "phone", "sex", "address"],
            include: { model: db.Group, attributes: ["name", "description", "id"], },
            order: [['id', 'DESC']]
        })
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            users: rows

        }
        return {
            EM: 'get data success',
            EC: 0,
            DT: data
        }

    } catch (error) {
        console.log(error)
        return {
            EM: 'somthing wrongs with',
            EC: 1,
            DT: []
        }

    }
}
const createNewUser = async (data) => {
    try {
        let isEmailExist = await checkEmail(data.email)
        if (isEmailExist === true) {
            return {
                EM: 'the email is already exist',
                EC: 2,
                DT: []
            }
        }
        let isPhoneExist = await checkPhone(data.phone)
        if (isPhoneExist === true) {
            return {
                EM: 'the phone is already exist',
                EC: 2,
                DT: []
            }
        }
        let hashPassword = hashUserPassword(data.password)

        await db.User.create({
            email: data.email,
            phone: data.phone,
            username: data.username,
            password: hashPassword,
            sex: data.sex,
            groupId: data.group,
            address: data.address,
        });
        return {
            EM: 'A user is created successfully',
            EC: 0,
            DT: []
        }

    } catch (error) {
        console.log(error)
        return {
            EM: 'somthing wrongs with',
            EC: 1,
            DT: []
        }

    }
}
const updateUser = async (data) => {
    try {
        if (!data.groupId) {
            return {
                EM: 'Error with empty groupId ',
                EC: 2,
                DT: 'group'
            };
        }
        let user = await db.User.findOne({
            where: {
                id: data.id
            }
        })
        if (user) {
            console.log("check user:", data);
            await user.update({
                username: data.username,
                address: data.address,
                sex: data.sex,
                groupId: data.groupId
            })
            return {
                EM: 'A user is update successfully',
                EC: 0,
                DT: []
            }
        }
        else {
            return {
                EM: 'user not found',
                EC: 1,
                DT: []
            }

        }


    } catch (error) {
        console.log(error)
        return {
            EM: 'somthing wrongs with',
            EC: 1,
            DT: []
        }

    }

}
const deleteUser = async (id) => {
    try {
        let user = await db.User.findOne({
            where: { id: id }
        })
        if (user) {
            await user.destroy();
            return {
                EM: 'Delete User Success',
                EC: 0,
                DT: []
            };

        } else {

            return {
                EM: 'User not exist',
                EC: 2,
                DT: []
            }

        }


    } catch (error) {
        console.log(error)
        return {
            EM: 'somthing wrongs with',
            EC: 1,
            DT: []
        }

    }

}

module.exports = {
    getAllUser, createNewUser, updateUser, deleteUser, getUserWithPagination

}