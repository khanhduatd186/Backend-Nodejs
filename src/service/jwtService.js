
import db from '../models/index'
const getGroupWithRole = async (user) => {
    let roles = await db.Group.findOne({
        where: { id: user.groupId },
        include: [{ model: db.Role, attributes: ["id", "description", "url"], through: { attributes: [] } }]
    })
    return roles ? roles : {};
}
module.exports = {
    getGroupWithRole
}