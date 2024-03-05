import db from '../models/index';
const createNewRoles = async (roles) => {

    // const testArray = [
    //     { url: "t", description: "1" },
    //     { url: "/user/read", description: 'abc' }

    // ]
    let currentRoles = await db.Role.findAll({
        attributes: ['url', 'description'],
        raw: true
    })
    // console.log("check roles: ", roles)
    const persists = roles.filter(({ url: url1 }) =>
        !currentRoles.some(({ url: url2 }) => url1 === url2)

    );
    console.log("check roles: ", currentRoles)
    console.log("check roles: ", persists)
    if (persists.length === 0) {
        return {
            EM: 'Nothing to creating ... ',
            EC: 0,
            DT: []
        }
    }
    await db.Role.bulkCreate(persists);
    return {
        EM: `create roles successed: ${persists.length} roles ....`,
        EC: 0,
        DT: []
    }
}
const getAllRole = async () => {
    try {
        let roles = await db.Role.findAll();

        if (roles) {
            return {
                EM: 'get data success',
                EC: 0,
                DT: roles
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
const getRoleByGroup = async (id) => {
    try {
        if (!id) {
            return {
                EM: 'not found any role',
                EC: 0,
                DT: []
            }
        }
        let roles = await db.Group.findOne({
            where: { id: id },
            attributes: ["id", "name", "description"],
            include: {
                model: db.Role,
                attributes: ["id", "url", "description"],
                through: { attributes: [] }
            }
        })
        return {
            EM: 'get roles by group succeeds',
            EC: 0,
            DT: roles
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
const assignRoleToGroup = async (data) => {
    try {
        await db.Group_Role.destroy({
            where: { groupId: +data.groupId }
        })
        await db.Group_Role.bulkCreate(data.groupRoles);
        return {
            EM: 'Assign Role to Group succeeds',
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
module.exports = {
    createNewRoles, getAllRole, getRoleByGroup, assignRoleToGroup
}