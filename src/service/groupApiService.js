import db from '../models/index'
const getGroups = async () => {
    try {
        let users = await db.Group.findAll({
            order: [
                ['name', 'ASC']
            ]
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
module.exports = {
    getGroups

}

